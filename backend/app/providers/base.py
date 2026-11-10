from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import datetime
import re

def is_offer_match(item: dict, offer: dict, q: str, category: Optional[str] = None, max_budget: Optional[float] = None) -> bool:
    # 1. Category filter
    if category and category.lower() != "all" and category.lower() not in item["category"].lower():
        return False

    # 2. Budget filter
    if max_budget and offer["price"] > max_budget * 1.25:
        return False

    # 3. Semantic keyword match
    q_lower = q.lower()
    title_lower = (item["canonical_title"] + " " + offer["title"] + " " + item["brand"]).lower()
    specs_str = str(item.get("base_specifications", {})).lower()
    features_str = " ".join(item.get("key_features", [])).lower()
    full_text = f"{title_lower} {specs_str} {features_str}"

    # Domain keywords
    audio_keywords = ["headphone", "headphones", "headset", "audio", "earphone", "earbuds"]
    laptop_keywords = ["laptop", "notebook", "coding", "macbook", "pc", "computer", "ram", "programming"]
    phone_keywords = ["phone", "smartphone", "mobile", "galaxy", "iphone", "s24", "amoled", "android"]
    fashion_keywords = ["jacket", "bomber", "hoodie", "winter", "coat", "parka", "shirt", "sneaker", "shoes", "fashion", "clothing"]
    home_keywords = ["chair", "furniture", "ergonomic", "seat", "purifier", "air purifier", "mattress", "cooktop", "home", "living", "kitchen", "appliance"]
    beauty_keywords = ["toothbrush", "oral", "brush", "beauty", "grooming", "trimmer", "serum", "cleanser", "skin"]
    book_keywords = ["book", "books", "novel", "reading", "author", "paperback", "habits", "ikigai", "psychology", "atomic"]

    # Model specific filters
    models_to_check = ["720n", "s24", "galaxy", "thinkpad", "vivobook", "770nc", "1000d", "airwave", "monster ultimate", "oral-b", "atomic", "ikigai", "psychology", "wakefit", "allen solly"]
    for m in models_to_check:
        if m in q_lower and m not in full_text:
            return False

    # Check category domain alignment
    if any(k in q_lower for k in book_keywords):
        if item["category"] != "books":
            return False

    has_audio_intent = any(k in q_lower for k in audio_keywords) or bool(re.search(r'\banc\b', q_lower))
    if has_audio_intent:
        if not ("battery_hours" in specs_str or "driver_size_mm" in specs_str or any(k in full_text for k in audio_keywords)):
            return False

    if any(k in q_lower for k in laptop_keywords):
        if not ("ram_gb" in specs_str or "cpu" in specs_str or any(k in full_text for k in laptop_keywords)):
            return False

    if any(k in q_lower for k in phone_keywords):
        if not ("storage_gb" in specs_str or "display" in specs_str or "camera" in specs_str or any(k in full_text for k in phone_keywords)):
            return False

    if any(k in q_lower for k in fashion_keywords):
        if item["category"] != "fashion":
            return False

    if any(k in q_lower for k in home_keywords):
        if item["category"] != "home":
            return False

    if any(k in q_lower for k in beauty_keywords):
        if item["category"] != "beauty":
            return False

    return True

class RawPlatformOffer:
    def __init__(
        self,
        platform: str,
        external_id: str,
        title: str,
        url: str,
        price: float,
        original_price: float,
        discount_pct: int,
        rating: float,
        review_count: int,
        key_features: List[str],
        specs: Dict[str, Any],
        in_stock: bool = True,
        seller_name: str = "Authorized Seller",
        delivery_days: int = 2,
        return_policy: str = "7-day return",
        thumbnail_url: str = "",
        brand: str = "",
        category: str = "electronics",
        provenance: Optional[Dict[str, Any]] = None
    ):
        self.platform = platform
        self.external_id = external_id
        self.title = title
        self.url = url
        self.price = price
        self.original_price = original_price
        self.discount_pct = discount_pct
        self.rating = rating
        self.review_count = review_count
        self.key_features = key_features
        self.specs = specs
        self.in_stock = in_stock
        self.seller_name = seller_name
        self.delivery_days = delivery_days
        self.return_policy = return_policy
        self.thumbnail_url = thumbnail_url
        self.brand = brand
        self.category = category
        self.retrieved_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        self.provenance = provenance or {
            "source": f"{platform.capitalize()} Catalog Adapter",
            "is_demo_data": True,
            "api_endpoint": f"https://api.{platform}.internal/catalog/v2",
            "retrieval_status": "200_OK_VERIFIED"
        }

class BasePlatformAdapter(ABC):
    def __init__(self, platform_name: str, live_api_key: Optional[str] = None):
        self.platform_name = platform_name
        self.live_api_key = live_api_key
        self.is_connected = bool(live_api_key)

    @abstractmethod
    def search(
        self,
        query: str,
        category: Optional[str] = None,
        max_budget: Optional[float] = None
    ) -> List[RawPlatformOffer]:
        pass

    @abstractmethod
    def get_product_details(self, external_id: str) -> Optional[RawPlatformOffer]:
        pass
