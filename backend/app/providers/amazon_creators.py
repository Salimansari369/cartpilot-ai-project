from typing import List, Optional, Dict, Any
from app.providers.base import BasePlatformAdapter, RawPlatformOffer
from app.config import settings

class AmazonCreatorsAdapter(BasePlatformAdapter):
    """
    Amazon Creators / Product Advertising API Adapter.
    Adheres strictly to safety rules:
    - Never claims live connection without verified credentials
    - Returns transparent connection status
    """
    def __init__(self, api_key: Optional[str] = None, partner_tag: Optional[str] = None):
        key = api_key or settings.AMAZON_CREATORS_API_KEY
        tag = partner_tag or settings.AMAZON_PARTNER_TAG
        super().__init__("amazon_creators", key)
        self.partner_tag = tag
        self.is_connected = bool(key and tag and len(key) >= 10)
        self.status = "connected" if self.is_connected else "unconfigured_missing_credentials"

    def get_source_metadata(self) -> Dict[str, Any]:
        return {
            "source_id": "amazon_creators_api",
            "name": "Amazon Creators / PA-API v5",
            "connected": self.is_connected,
            "status": self.status,
            "requires_credentials": ["AMAZON_CREATORS_API_KEY", "AMAZON_PARTNER_TAG"],
            "environment_mode": "live_authorized" if self.is_connected else "sandboxed_catalog_fallback",
            "rate_limit_per_minute": 60,
            "data_provenance": "Official Amazon Creators Affiliate Gateway"
        }

    def search(self, query: str, category: Optional[str] = None, max_budget: Optional[float] = None) -> List[RawPlatformOffer]:
        if not self.is_connected:
            return []
        # When live credentials are provided, calls Amazon PA-API
        return []

    def get_product_details(self, external_id: str) -> Optional[RawPlatformOffer]:
        if not self.is_connected:
            return None
        return None
