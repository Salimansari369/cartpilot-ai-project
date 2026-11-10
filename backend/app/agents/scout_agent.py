from typing import List, Dict, Any, Optional, Tuple
from app.providers.base import RawPlatformOffer
from app.providers import get_platform_adapters
from app.providers.serpapi_provider import SerpApiShoppingProvider

class ScoutAgent:
    """Discovers offers across authorized marketplace feeds (Amazon, Flipkart, Meesho, Myntra, Google Shopping)."""

    def __init__(self):
        self.agent_name = "scout"
        self.adapters = get_platform_adapters()
        self.serpapi = SerpApiShoppingProvider()

    def discover(
        self,
        query: str,
        category: Optional[str] = None,
        max_budget: Optional[float] = None
    ) -> Tuple[List[RawPlatformOffer], Dict[str, Any]]:
        all_offers: List[RawPlatformOffer] = []
        platform_stats: Dict[str, Any] = {}

        # 1. Search built-in authorized marketplace catalog adapters
        for name, adapter in self.adapters.items():
            try:
                offers = adapter.search(query, category=category, max_budget=max_budget)
                all_offers.extend(offers)
                platform_stats[name] = {
                    "status": "connected_sandbox" if not adapter.is_connected else "live_connected",
                    "offers_found": len(offers),
                    "adapter_health": "100%",
                    "provenance": "Curated authorized feed" if not adapter.is_connected else "Live Marketplace API"
                }
            except Exception as e:
                platform_stats[name] = {
                    "status": "error",
                    "message": str(e),
                    "offers_found": 0
                }

        # 2. Search SerpApi Google Shopping Live if connected
        if self.serpapi.is_connected():
            try:
                live_offers = self.serpapi.search_as_offers(query, category=category, max_budget=max_budget)
                all_offers.extend(live_offers)
                platform_stats["serpapi_google_shopping"] = {
                    "status": "live_connected",
                    "offers_found": len(live_offers),
                    "adapter_health": "100%",
                    "provenance": "SerpApi Google Shopping Live Feed (India)"
                }
            except Exception as e:
                platform_stats["serpapi_google_shopping"] = {
                    "status": "error",
                    "message": str(e),
                    "offers_found": 0
                }
        else:
            platform_stats["serpapi_google_shopping"] = {
                "status": "unconfigured_missing_key",
                "offers_found": 0,
                "provenance": "Sandbox mode active (Key not configured)"
            }

        return all_offers, platform_stats
