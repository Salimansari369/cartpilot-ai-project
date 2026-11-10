from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import User, Product, SavedItem
from app.schemas import SavedItemResponse, SavedItemCreate

router = APIRouter(prefix="/api/saved", tags=["saved_items"])

@router.get("", response_model=List[SavedItemResponse])
def get_saved_items(list_type: Optional[str] = None, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        return []
    q = db.query(SavedItem).filter(SavedItem.user_id == user.id)
    if list_type:
        q = q.filter(SavedItem.list_type == list_type)
    return q.order_by(SavedItem.added_at.desc()).all()

@router.post("", response_model=SavedItemResponse)
def add_saved_item(item_in: SavedItemCreate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(email="shopper@cartpilot.ai", name="Alex Morgan")
        db.add(user)
        db.flush()

    # Check if already in list
    existing = db.query(SavedItem).filter(
        SavedItem.user_id == user.id,
        SavedItem.product_id == item_in.product_id,
        SavedItem.list_type == item_in.list_type
    ).first()

    if existing:
        return existing

    item = SavedItem(
        user_id=user.id,
        product_id=item_in.product_id,
        list_type=item_in.list_type,
        notes=item_in.notes
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{saved_id}")
def delete_saved_item(saved_id: int, db: Session = Depends(get_db)):
    item = db.query(SavedItem).filter(SavedItem.id == saved_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Saved item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed successfully", "id": saved_id}
