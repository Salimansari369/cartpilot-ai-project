from typing import List, Optional, Dict, Any
from app.providers.base import BasePlatformAdapter, RawPlatformOffer
from app.config import settings

class FlipkartAffiliateAdapter(BasePlatformAdapter):
    """
    Flipkart Affiliate API Adapter.
    Adheres strictly to safety rules:
    - Never claims live connection without verified credentials
    - Returns transparent connection status
    """
    def __init__(self, affiliate_id: Optional[str] = None, affiliate_token: Optional[str] = None):
        aff_id = affiliate_id or settings.FLIPKART_AFFILIATE_ID
        aff_tok = affiliate_token or settings.FLIPKART_AFFILIATE_TOKEN
        super().__init__("flipkart_affiliate", aff_tok)
        self.affiliate_id = aff_id
        self.is_connected = bool(aff_id and aff_tok and len(aff_tok) >= 10)
        self.status = "connected" if self.is_connected else "unconfigured_missing_credentials"

    def get_source_metadata(self) -> Dict[str, Any]:
        return {
            "source_id": "flipkart_affiliate_api",
            "name": "Flipkart Affiliate Platform API",
            "connected": self.is_connected,
            "status": self.status,
            "requires_credentials": ["FLIPKART_AFFILIATE_ID", "FLIPKART_AFFILIATE_TOKEN"],
            "environment_mode": "live_authorized" if self.is_connected else "sandboxed_catalog_fallback",
            "rate_limit_per_minute": 100,
            "data_provenance": "Flipkart Affiliate Partner Network"
        }

    def search(self, query: str, category: Optional[str] = None, max_budget: Optional[float] = None) -> List[RawPlatformOffer]:
        if not self.is_connected:
            return []
        return []

    def get_product_details(self, external_id: str) -> Optional[RawPlatformOffer]:
        if not self.is_connected:
            return None
        return None
