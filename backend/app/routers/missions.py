import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import (
    User, Preference, ShoppingMission, AgentRun, AgentEvent,
    Recommendation, RecommendationEvidence, Product, NormalizedSpec,
    MerchantOffer, PriceObservation, ReviewInsight
)
from app.schemas import MissionCreate, MissionResponse, AgentRunResponse
from app.agents.orchestrator import MultiAgentOrchestrator

def upsert_discovered_product(db: Session, r: dict, category: str) -> Product:
    canonical_title = r["canonical_title"]
    p_obj = db.query(Product).filter(Product.canonical_title == canonical_title).first()
    now_utc = datetime.datetime.now(datetime.timezone.utc)

    if not p_obj:
        thumbnail = r.get("thumbnail_url", "")
        if not thumbnail and r.get("offers"):
            first_off = r["offers"][0]
            thumbnail = first_off.thumbnail_url if hasattr(first_off, "thumbnail_url") else first_off.get("thumbnail_url", "")

        p_obj = Product(
            canonical_title=canonical_title,
            category=r.get("category", category or "electronics"),
            brand=r.get("brand", "Unknown"),
            model_number=r.get("model_number", ""),
            thumbnail_url=thumbnail or "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
            badge=r.get("badge", "Top Pick"),
            rating=r.get("rating", 4.2),
            review_count=r.get("review_count", 150),
            key_features=r.get("key_features", []),
            base_specifications=r.get("specs", {}),
            verified=r.get("is_exact_match", True),
            created_at=now_utc
        )
        db.add(p_obj)
        db.flush()

        # Add specs
        for attr_name, attr_val in r.get("specs", {}).items():
            db.add(NormalizedSpec(
                product_id=p_obj.id,
                attribute_name=attr_name,
                normalized_value=str(attr_val),
                raw_value=str(attr_val),
                confidence=1.0
            ))

        # Add offers
        for off in r.get("offers", []):
            platform = off.platform if hasattr(off, "platform") else off.get("platform", "amazon")
            ext_id = off.external_id if hasattr(off, "external_id") else off.get("external_id", f"off_{p_obj.id}")
            title = off.title if hasattr(off, "title") else off.get("title", canonical_title)
            url = off.url if hasattr(off, "url") else off.get("url", "https://amazon.in")
            price = off.price if hasattr(off, "price") else off.get("price", r["best_price"])
            orig_price = off.original_price if hasattr(off, "original_price") else off.get("original_price", price * 1.15)
            disc_pct = off.discount_pct if hasattr(off, "discount_pct") else off.get("discount_pct", 13)
            seller = off.seller_name if hasattr(off, "seller_name") else off.get("seller_name", "Authorized Seller")
            deliv = off.delivery_days if hasattr(off, "delivery_days") else off.get("delivery_days", 2)
            ret_pol = off.return_policy if hasattr(off, "return_policy") else off.get("return_policy", "Standard Return")
            prov = off.provenance if hasattr(off, "provenance") else off.get("provenance", {})

            m_offer = MerchantOffer(
                product_id=p_obj.id,
                platform=platform,
                external_product_id=ext_id,
                title=title,
                url=url,
                price=float(price),
                original_price=float(orig_price),
                discount_pct=int(disc_pct),
                currency="INR",
                in_stock=True,
                seller_name=seller,
                seller_rating=4.5,
                delivery_days=int(deliv),
                return_policy=ret_pol,
                retrieved_at=now_utc,
                provenance_metadata=prov
            )
            db.add(m_offer)
            db.flush()

            # Record PriceObservation
            db.add(PriceObservation(
                offer_id=m_offer.id,
                price=float(price),
                currency="INR",
                recorded_at=now_utc
            ))

        # Add review insights if available
        if "review_intel" in r and r["review_intel"].get("aspects"):
            for asp in r["review_intel"]["aspects"]:
                db.add(ReviewInsight(
                    product_id=p_obj.id,
                    aspect_name=asp.get("aspect", "general"),
                    sentiment_score=float(asp.get("sentiment_score", 0.8)),
                    mention_count=int(asp.get("mention_count", 50)),
                    summary=asp.get("summary", "Positive user satisfaction")
                ))

    return p_obj

router = APIRouter(prefix="/api/missions", tags=["missions"])

@router.get("", response_model=List[MissionResponse])
def list_missions(db: Session = Depends(get_db)):
    missions = db.query(ShoppingMission).order_by(ShoppingMission.created_at.desc()).limit(20).all()
    # Eager attach latest run
    results = []
    for m in missions:
        latest_run = db.query(AgentRun).filter(AgentRun.mission_id == m.id).order_by(AgentRun.started_at.desc()).first()
        results.append(MissionResponse(
            id=m.id,
            raw_query=m.raw_query,
            parsed_category=m.parsed_category,
            max_budget=m.max_budget,
            min_budget=m.min_budget,
            intended_use=m.intended_use,
            priorities=m.priorities or [],
            brands=m.brands or [],
            status=m.status,
            clarification_question=m.clarification_question,
            created_at=m.created_at,
            latest_run=latest_run
        ))
    return results

@router.post("", response_model=MissionResponse)
def create_mission(mission_in: MissionCreate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    pref_dict = None
    if mission_in.preferences:
        pref_dict = mission_in.preferences.model_dump()
    elif user and user.preferences:
        pref_dict = {
            "price_weight": user.preferences.price_weight,
            "performance_weight": user.preferences.performance_weight,
            "battery_weight": user.preferences.battery_weight,
            "comfort_weight": user.preferences.comfort_weight,
            "reliability_weight": user.preferences.reliability_weight
        }

    orchestrator = MultiAgentOrchestrator()
    run_result = orchestrator.run_mission(
        raw_query=mission_in.raw_query,
        user_preferences=pref_dict,
        clarification_response=mission_in.clarification_response
    )

    intent = run_result["intent"]
    status = run_result["status"]

    mission = ShoppingMission(
        user_id=user.id if user else None,
        raw_query=mission_in.raw_query,
        parsed_category=intent.get("category", "electronics"),
        max_budget=intent.get("max_budget"),
        min_budget=intent.get("min_budget"),
        intended_use=intent.get("intended_use", "general"),
        priorities=intent.get("priorities", []),
        brands=intent.get("brands", []),
        status=status,
        clarification_question=intent.get("clarification_question")
    )
    db.add(mission)
    db.flush()

    agent_run = AgentRun(
        mission_id=mission.id,
        orchestrator_version="2.0-multi-agent",
        status="completed" if status == "completed" else "failed",
        total_duration_ms=run_result.get("duration_ms", 0),
        completed_at=datetime.datetime.now(datetime.timezone.utc) if status == "completed" else None
    )
    db.add(agent_run)
    db.flush()

    # Save events
    for ev in run_result.get("events", []):
        a_ev = AgentEvent(
            run_id=agent_run.id,
            agent_name=ev["agent_name"],
            event_type=ev["event_type"],
            message=ev["message"],
            payload_json=ev.get("payload_json", {})
        )
        db.add(a_ev)

    # Save recommendations
    for r in run_result.get("recommendations", []):
        p_obj = upsert_discovered_product(db, r, intent.get("category", "electronics"))
        if p_obj:
            recom = Recommendation(
                run_id=agent_run.id,
                product_id=p_obj.id,
                rank=r["rank"],
                badge=r.get("badge"),
                overall_score=r["overall_score"],
                score_breakdown=r.get("score_breakdown", {}),
                reasons=r.get("reasons", []),
                sacrifice_tradeoffs=r.get("sacrifice_tradeoffs", []),
                disagreements=r.get("disagreements", []),
                confidence_score=r.get("confidence_score", 0.95)
            )
            db.add(recom)
            db.flush()

            for ev_item in r.get("evidence", []):
                re_ev = RecommendationEvidence(
                    recommendation_id=recom.id,
                    agent_name=ev_item["agent_name"],
                    claim_text=ev_item["claim_text"],
                    evidence_source=ev_item["evidence_source"],
                    confidence=ev_item["confidence"],
                    verified=ev_item["verified"]
                )
                db.add(re_ev)

    db.commit()
    db.refresh(mission)
    db.refresh(agent_run)

    return MissionResponse(
        id=mission.id,
        raw_query=mission.raw_query,
        parsed_category=mission.parsed_category,
        max_budget=mission.max_budget,
        min_budget=mission.min_budget,
        intended_use=mission.intended_use,
        priorities=mission.priorities or [],
        brands=mission.brands or [],
        status=mission.status,
        clarification_question=mission.clarification_question,
        created_at=mission.created_at,
        latest_run=agent_run
    )

@router.get("/{mission_id}", response_model=MissionResponse)
def get_mission(mission_id: int, db: Session = Depends(get_db)):
    m = db.query(ShoppingMission).filter(ShoppingMission.id == mission_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mission not found")
    latest_run = db.query(AgentRun).filter(AgentRun.mission_id == m.id).order_by(AgentRun.started_at.desc()).first()
    return MissionResponse(
        id=m.id,
        raw_query=m.raw_query,
        parsed_category=m.parsed_category,
        max_budget=m.max_budget,
        min_budget=m.min_budget,
        intended_use=m.intended_use,
        priorities=m.priorities or [],
        brands=m.brands or [],
        status=m.status,
        clarification_question=m.clarification_question,
        created_at=m.created_at,
        latest_run=latest_run
    )
