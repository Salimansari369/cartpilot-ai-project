from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from app.database import get_db
from app.models import User, Preference, Product
from app.schemas import PreferenceResponse, PreferenceUpdate
from app.agents.decision_agent import DecisionAgent

router = APIRouter(prefix="/api/preferences", tags=["preferences"])

class SimulationRequest(BaseModel):
    product_ids: List[int]
    preferences: Dict[str, float]
    intended_use: str = "general"

class SimulationResult(BaseModel):
    ranked_products: List[Dict[str, Any]]
    shift_explanation: str

@router.get("", response_model=PreferenceResponse)
def get_preferences(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user or not user.preferences:
        # Create default
        if not user:
            user = User(email="shopper@cartpilot.ai", name="Alex Morgan")
            db.add(user)
            db.flush()
        pref = Preference(
            user_id=user.id,
            price_weight=0.25,
            performance_weight=0.25,
            battery_weight=0.20,
            comfort_weight=0.15,
            reliability_weight=0.15
        )
        db.add(pref)
        db.commit()
        db.refresh(pref)
        return pref
    return user.preferences

@router.put("", response_model=PreferenceResponse)
def update_preferences(pref_in: PreferenceUpdate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    pref = user.preferences
    if not pref:
        pref = Preference(user_id=user.id)
        db.add(pref)

    pref.price_weight = pref_in.price_weight
    pref.performance_weight = pref_in.performance_weight
    pref.battery_weight = pref_in.battery_weight
    pref.comfort_weight = pref_in.comfort_weight
    pref.reliability_weight = pref_in.reliability_weight
    pref.brand_affinity = pref_in.brand_affinity

    db.commit()
    db.refresh(pref)
    return pref

@router.post("/simulate", response_model=SimulationResult)
def simulate_weight_shift(req: SimulationRequest, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.id.in_(req.product_ids)).all()
    if not products:
        products = db.query(Product).limit(4).all()

    items = []
    for p in products:
        best_price = min((o.price for o in p.offers), default=4499.0)
        items.append({
            "id": p.id,
            "canonical_title": p.canonical_title,
            "best_price": best_price,
            "specs": p.base_specifications or {},
            "rating": p.rating,
            "review_count": p.review_count,
            "badge": p.badge
        })

    decision = DecisionAgent()
    ranked = decision.rank(
        items,
        preferences=req.preferences,
        intended_use=req.intended_use
    )

    # Generate human explanation of what shifted
    explanation = "Adjusted weights: "
    if req.preferences.get("price_weight", 0) > 0.4:
        explanation += "High emphasis on Price prioritizes lower-cost models like Noise Airwave Max and boAt."
    elif req.preferences.get("battery_weight", 0) > 0.35:
        explanation += "High emphasis on Battery Life propels JBL Tune 770NC (70h) to clear leadership."
    elif req.preferences.get("comfort_weight", 0) > 0.3:
        explanation += "Comfort-first weighting elevates lightweight frames with low head clamp pressure."
    else:
        explanation += "Balanced trade-offs across sound quality, durability, and cost value."

    return SimulationResult(
        ranked_products=ranked,
        shift_explanation=explanation
    )
