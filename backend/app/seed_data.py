import datetime
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import (
    User, Preference, Product, MerchantOffer, ReviewRecord, ReviewInsight,
    NormalizedSpec, PriceObservation, ShoppingMission, AgentRun, AgentEvent,
    Recommendation, RecommendationEvidence, SavedItem, PriceAlert
)
from app.providers.catalog_db import CATALOG_ITEMS
from app.agents.orchestrator import MultiAgentOrchestrator

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Create Default User
        user = db.query(User).first()
        if not user:
            print("Seeding initial CartPilot AI database...")
            user = User(
                email="shopper@cartpilot.ai",
                name="Alex Morgan"
            )
            db.add(user)
            db.flush()

            # 2. User Preferences
            pref = Preference(
                user_id=user.id,
                price_weight=0.25,
                performance_weight=0.25,
                battery_weight=0.20,
                comfort_weight=0.15,
                reliability_weight=0.15,
                brand_affinity={"JBL": 0.8, "Sony": 0.9, "Lenovo": 0.85, "Samsung": 0.9}
            )
            db.add(pref)
            db.flush()

        # 3. Seed Products from curated catalog
        product_map = {}
        for item in CATALOG_ITEMS:
            existing_p = db.query(Product).filter(Product.canonical_title == item["canonical_title"]).first()
            if existing_p:
                product_map[item["canonical_title"]] = existing_p
                continue

            prod = Product(
                canonical_title=item["canonical_title"],
                category=item["category"],
                brand=item["brand"],
                model_number=item.get("model_number"),
                thumbnail_url=item.get("thumbnail_url"),
                badge=item.get("badge"),
                rating=item["rating"],
                review_count=item["review_count"],
                key_features=item["key_features"],
                base_specifications=item["base_specifications"],
                verified=item.get("verified", True)
            )
            db.add(prod)
            db.flush()
            product_map[item["canonical_title"]] = prod

            # Add normalized specs
            for spec_key, spec_val in item["base_specifications"].items():
                ns = NormalizedSpec(
                    product_id=prod.id,
                    attribute_name=spec_key,
                    normalized_value=str(spec_val),
                    raw_value=str(spec_val),
                    confidence=1.0
                )
                db.add(ns)

            # Add offers
            for o in item["offers"]:
                offer = MerchantOffer(
                    product_id=prod.id,
                    platform=o["platform"],
                    external_product_id=o["external_id"],
                    title=o["title"],
                    url=o["url"],
                    price=o["price"],
                    original_price=o["original_price"],
                    discount_pct=o["discount_pct"],
                    currency="INR",
                    in_stock=o["in_stock"],
                    seller_name=o["seller_name"],
                    seller_rating=o["seller_rating"],
                    delivery_days=o["delivery_days"],
                    return_policy=o["return_policy"],
                    provenance_metadata={
                        "source": f"{o['platform'].capitalize()} Feed",
                        "is_demo_data": True
                    }
                )
                db.add(offer)
                db.flush()

                # Add price observations (history)
                for h in item.get("history", []):
                    po = PriceObservation(
                        offer_id=offer.id,
                        price=h["price"],
                        currency="INR",
                        recorded_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=30)
                    )
                    db.add(po)

            # Add review insights
            for ins in item.get("insights", []):
                ri = ReviewInsight(
                    product_id=prod.id,
                    aspect=ins["aspect"],
                    sentiment_score=ins["sentiment_score"],
                    mention_count=ins["mention_count"],
                    summary=ins["summary"],
                    suspicious_patterns_score=item.get("suspicious_patterns_score", 0.04),
                    fake_review_indicators=item.get("fake_review_indicators", [])
                )
                db.add(ri)

        db.commit()

        # 4. Seed 3 default shopping missions and execute agent runs!
        orchestrator = MultiAgentOrchestrator()
        demo_queries = [
            "I want a wireless headphone under ₹5,000 for work and occasional gaming.",
            "Best laptop for coding under ₹70,000 with 16GB RAM and great keyboard.",
            "Casual jackets for winter warm and water repellent under ₹2,000."
        ]

        for dq in demo_queries:
            run_result = orchestrator.run_mission(dq)
            intent = run_result["intent"]

            mission = ShoppingMission(
                user_id=user.id,
                raw_query=dq,
                parsed_category=intent.get("category", "electronics"),
                max_budget=intent.get("max_budget"),
                intended_use=intent.get("intended_use", "general"),
                priorities=intent.get("priorities", []),
                brands=intent.get("brands", []),
                status="completed"
            )
            db.add(mission)
            db.flush()

            agent_run = AgentRun(
                mission_id=mission.id,
                orchestrator_version="2.0-multi-agent",
                status="completed",
                total_duration_ms=run_result.get("duration_ms", 1200),
                completed_at=datetime.datetime.utcnow()
            )
            db.add(agent_run)
            db.flush()

            # Add events
            for ev in run_result.get("events", []):
                a_event = AgentEvent(
                    run_id=agent_run.id,
                    agent_name=ev["agent_name"],
                    event_type=ev["event_type"],
                    message=ev["message"],
                    payload_json=ev.get("payload_json", {})
                )
                db.add(a_event)

            # Add recommendations
            for r in run_result.get("recommendations", []):
                p_obj = product_map.get(r["canonical_title"])
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

        # 5. Seed default saved items (wishlist, cart, compare) for user
        jbl = product_map.get("JBL Tune 770NC")
        boat = product_map.get("boAt Immortal 1000D")
        noise = product_map.get("Noise Airwave Max")

        if jbl:
            db.add(SavedItem(user_id=user.id, product_id=jbl.id, list_type="smart_cart", notes="Lowest on Amazon"))
            db.add(SavedItem(user_id=user.id, product_id=jbl.id, list_type="wishlist", notes="Favorite ANC pick"))
            db.add(SavedItem(user_id=user.id, product_id=jbl.id, list_type="compare", notes="Candidate 1"))
            db.add(PriceAlert(user_id=user.id, product_id=jbl.id, target_price=4200.0, current_price=4499.0, notify_email="shopper@cartpilot.ai"))

        if boat:
            db.add(SavedItem(user_id=user.id, product_id=boat.id, list_type="smart_cart", notes="For BGMI gaming"))
            db.add(SavedItem(user_id=user.id, product_id=boat.id, list_type="compare", notes="Candidate 2"))

        if noise:
            db.add(SavedItem(user_id=user.id, product_id=noise.id, list_type="smart_cart", notes="Value backup"))
            db.add(SavedItem(user_id=user.id, product_id=noise.id, list_type="compare", notes="Candidate 3"))

        db.commit()
        print("Database seeded successfully with users, catalog products, agent runs, and missions!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
