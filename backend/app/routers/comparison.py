from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models import Product
from app.schemas import ProductSchema

router = APIRouter(prefix="/api/compare", tags=["comparison"])

class CompareRequest(BaseModel):
    product_ids: List[int]

class CompareResponse(BaseModel):
    products: List[ProductSchema]
    spec_keys: List[str]
    best_dimensions: Dict[str, Any]

@router.post("", response_model=CompareResponse)
def compare_products(req: CompareRequest, db: Session = Depends(get_db)):
    if not req.product_ids:
        raise HTTPException(status_code=400, detail="Must provide at least one product_id")

    products = db.query(Product).filter(Product.id.in_(req.product_ids)).all()
    if not products:
        raise HTTPException(status_code=404, detail="No matching products found")

    # Aggregate common specs
    all_spec_keys = set()
    for p in products:
        if p.base_specifications:
            all_spec_keys.update(p.base_specifications.keys())

    # Calculate best dimensions
    best_price_prod = None
    min_price = float("inf")
    best_rating_prod = None
    max_rating = 0.0

    for p in products:
        if p.offers:
            p_min = min(o.price for o in p.offers)
            if p_min < min_price:
                min_price = p_min
                best_price_prod = p.canonical_title
        if p.rating > max_rating:
            max_rating = p.rating
            best_rating_prod = p.canonical_title

    return CompareResponse(
        products=products,
        spec_keys=sorted(list(all_spec_keys)),
        best_dimensions={
            "lowest_price_product": best_price_prod,
            "lowest_price": min_price if min_price != float("inf") else 0,
            "highest_rated_product": best_rating_prod,
            "highest_rating": max_rating
        }
    )
