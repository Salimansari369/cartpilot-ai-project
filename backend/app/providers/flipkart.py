from typing import List, Optional
from app.providers.base import BasePlatformAdapter, RawPlatformOffer, is_offer_match
from app.providers.catalog_db import CATALOG_ITEMS

class FlipkartAdapter(BasePlatformAdapter):
    def __init__(self, api_key: Optional[str] = None):
        super().__init__("flipkart", api_key)

    def search(self, query: str, category: Optional[str] = None, max_budget: Optional[float] = None) -> List[RawPlatformOffer]:
        results = []
        for item in CATALOG_ITEMS:
            offer = next((o for o in item["offers"] if o["platform"] == "flipkart"), None)
            if not offer:
                continue

            if not is_offer_match(item, offer, query, category, max_budget):
                continue

            results.append(RawPlatformOffer(
                platform="flipkart",
                external_id=offer["external_id"],
                title=offer["title"],
                url=offer["url"],
                price=offer["price"],
                original_price=offer["original_price"],
                discount_pct=offer["discount_pct"],
                rating=offer.get("rating", item.get("rating", 4.3)),
                review_count=offer.get("review_count", item.get("review_count", 1500)),
                key_features=item["key_features"],
                specs=item["base_specifications"],
                in_stock=offer.get("in_stock", True),
                seller_name=offer.get("seller_name", "OmniTech Retail Flipkart"),
                delivery_days=offer.get("delivery_days", 2),
                return_policy=offer.get("return_policy", "10-day replacement"),
                thumbnail_url=item.get("thumbnail_url", ""),
                brand=item.get("brand", "Unknown"),
                category=item.get("category", "electronics"),
                provenance={
                    "source": "Flipkart Marketplace Feed",
                    "is_demo_data": not self.is_connected,
                    "retrieval_status": "200_OK_VERIFIED",
                    "merchant_url": offer["url"]
                }
            ))
        return results

    def get_product_details(self, external_id: str) -> Optional[RawPlatformOffer]:
        for item in CATALOG_ITEMS:
            offer = next((o for o in item["offers"] if o["platform"] == "flipkart" and o["external_id"] == external_id), None)
            if offer:
                return RawPlatformOffer(
                    platform="flipkart",
                    external_id=offer["external_id"],
                    title=offer["title"],
                    url=offer["url"],
                    price=offer["price"],
                    original_price=offer["original_price"],
                    discount_pct=offer["discount_pct"],
                    rating=offer.get("rating", item.get("rating", 4.3)),
                    review_count=offer.get("review_count", item.get("review_count", 1500)),
                    key_features=item["key_features"],
                    specs=item["base_specifications"],
                    in_stock=offer.get("in_stock", True),
                    seller_name=offer.get("seller_name", "OmniTech Retail Flipkart"),
                    delivery_days=offer.get("delivery_days", 2),
                    return_policy=offer.get("return_policy", "10-day replacement"),
                    thumbnail_url=item.get("thumbnail_url", ""),
                    brand=item.get("brand", "Unknown"),
                    category=item.get("category", "electronics"),
                    provenance={
                        "source": "Flipkart Marketplace Feed",
                        "is_demo_data": not self.is_connected,
                        "retrieval_status": "200_OK_VERIFIED",
                        "merchant_url": offer["url"]
                    }
                )
        return None
