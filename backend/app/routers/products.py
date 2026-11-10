from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import Product, MerchantOffer
from app.schemas import ProductSchema, PriceTrendResponse, PricePoint
from app.agents.price_agent import PriceIntelligenceAgent

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("", response_model=List[ProductSchema])
def list_products(
    category: Optional[str] = None,
    query: Optional[str] = None,
    brand: Optional[str] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Product)
    if category and category.lower() != "all":
        q = q.filter(Product.category.ilike(f"%{category}%"))
    if brand:
        q = q.filter(Product.brand.ilike(f"%{brand}%"))
    if query:
        q = q.filter(
            (Product.canonical_title.ilike(f"%{query}%")) |
            (Product.brand.ilike(f"%{query}%")) |
            (Product.category.ilike(f"%{query}%"))
        )

    products = q.all()

    # Filter max_price based on minimum offer
    if max_price:
        filtered = []
        for p in products:
            if p.offers:
                lowest = min(o.price for o in p.offers)
                if lowest <= max_price:
                    filtered.append(p)
            else:
                filtered.append(p)
        return filtered

    return products

@router.get("/{product_id}", response_model=ProductSchema)
def get_product(product_id: int, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@router.get("/{product_id}/trend", response_model=PriceTrendResponse)
def get_product_price_trend(product_id: int, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    best_price = min((o.price for o in prod.offers), default=4499.0)
    price_agent = PriceIntelligenceAgent()
    analysis = price_agent.analyze(prod.canonical_title, best_price, product_id=prod.id, db=db)

    points = [
        PricePoint(month=h["month"], price=h["price"], note=h.get("note"))
        for h in analysis.get("history", [])
    ]

    return PriceTrendResponse(
        product_id=prod.id,
        canonical_title=prod.canonical_title,
        current_price=analysis["current_price"],
        historical_average=analysis["historical_average"],
        price_drop=analysis["price_drop"],
        price_drop_pct=analysis["price_drop_pct"],
        recommendation=analysis["recommendation"],
        confidence=analysis["confidence"],
        points=points,
        is_demo_data=not analysis.get("is_real_observed_data", False)
    )
