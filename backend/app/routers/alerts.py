from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Product, PriceAlert
from app.schemas import PriceAlertResponse, PriceAlertCreate

router = APIRouter(prefix="/api/alerts", tags=["price_alerts"])

@router.get("", response_model=List[PriceAlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        return []
    return db.query(PriceAlert).filter(PriceAlert.user_id == user.id).all()

@router.post("", response_model=PriceAlertResponse)
def create_alert(alert_in: PriceAlertCreate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(email="shopper@cartpilot.ai", name="Alex Morgan")
        db.add(user)
        db.flush()

    prod = db.query(Product).filter(Product.id == alert_in.product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    current_p = min((o.price for o in prod.offers), default=4499.0)

    alert = PriceAlert(
        user_id=user.id,
        product_id=prod.id,
        target_price=alert_in.target_price,
        current_price=current_p,
        notify_email=alert_in.notify_email,
        active=True
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

@router.delete("/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(PriceAlert).filter(PriceAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Price alert not found")
    db.delete(alert)
    db.commit()
    return {"message": "Alert deleted successfully", "id": alert_id}
