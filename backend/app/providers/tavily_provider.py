import os
import datetime
import re
from typing import Dict, Any, List, Optional
from app.config import settings
from app.utils.cache import api_cache, tavily_rate_limiter, retry_with_backoff

class TavilyProvider:
    """
    Tavily Search and Extract integration for real-time technical reviews,
    specifications, and authentic market intelligence in India.
    Features:
    - Caching and rate limiting
    - Retry logic
    - Editorial review isolation (distinguishing professional vs customer sentiment)
    """

    def __init__(self):
        self.api_key = settings.TAVILY_API_KEY
        self.client = None
        if self.api_key:
            try:
                from tavily import TavilyClient
                self.client = TavilyClient(api_key=self.api_key)
            except Exception as e:
                print(f"Tavily client init notice: {e}")

    def is_connected(self) -> bool:
        return bool(self.api_key and self.client and len(self.api_key) > 5)

    @retry_with_backoff(max_retries=2, initial_delay=0.5)
    def _execute_search(self, search_query: str) -> Dict[str, Any]:
        return self.client.search(
            query=search_query,
            search_depth="advanced",
            max_results=6,
            include_raw_content=False
        )

    def search_product_intelligence(self, query: str, category: Optional[str] = None) -> Dict[str, Any]:
        """Performs live Tavily search for technical reviews, pricing, and specs."""
        cache_key = f"tavily:{query.lower()}:{category}"
        cached = api_cache.get(cache_key)
        if cached is not None:
            return cached

        if not self.is_connected():
            return {
                "source": "Tavily Search API",
                "connected": False,
                "status": "missing_api_key",
                "message": "TAVILY_API_KEY not configured. Operating in verified sandbox catalog mode.",
                "results": [],
                "editorial_reviews": [],
                "extracted_specs": {},
                "pros": [],
                "cons": []
            }

        if not tavily_rate_limiter.can_proceed():
            return {
                "source": "Tavily Search API",
                "connected": True,
                "status": "rate_limited",
                "message": "Tavily rate limit reached. Using cached intelligence.",
                "results": [],
                "editorial_reviews": [],
                "extracted_specs": {},
                "pros": [],
                "cons": []
            }

        try:
            search_query = f"{query} price specs review pros cons india"
            response = self._execute_search(search_query)
            raw_results = response.get("results", [])

            parsed_results = []
            editorial_reviews = []
            pros_found = set()
            cons_found = set()
            extracted_specs = {}

            tech_domains = ["gadgets360.com", "mysmartprice.com", "91mobiles.com", "techradar.com", "digit.in", "gsmarena.com", "theverge.com"]

            for r in raw_results:
                title = r.get("title", "")
                url = r.get("url", "")
                content = r.get("content", "")

                parsed_results.append({
                    "title": title,
                    "url": url,
                    "snippet": content,
                    "score": r.get("score", 0.8),
                    "retrieved_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
                })

                if any(dom in url.lower() for dom in tech_domains):
                    editorial_reviews.append({
                        "publication": url.split("/")[2].replace("www.", ""),
                        "url": url,
                        "title": title,
                        "summary": content[:300],
                        "source_type": "editorial_technical_review"
                    })

                # Simple NLP sentiment sentence extraction
                for sentence in content.split("."):
                    s_clean = sentence.strip()
                    s_lower = s_clean.lower()
                    if any(pos in s_lower for pos in ["excellent battery", "great display", "solid build", "good value", "fast charging", "comfortable", "crisp sound"]):
                        if len(s_clean) < 120 and len(s_clean) > 15:
                            pros_found.add(s_clean)
                    if any(neg in s_lower for neg in ["lacks anc", "plastic build", "mediocre camera", "no charger", "slow charging", "heavier", "expensive"]):
                        if len(s_clean) < 120 and len(s_clean) > 15:
                            cons_found.add(s_clean)

                    # Specs extraction
                    ram_m = re.search(r'(\d+GB)\s*RAM', s_clean, re.I)
                    if ram_m:
                        extracted_specs["ram"] = ram_m.group(1).upper()
                    st_m = re.search(r'(\d+GB|\d+TB)\s*(?:storage|ROM|SSD)', s_clean, re.I)
                    if st_m:
                        extracted_specs["storage"] = st_m.group(1).upper()
                    bat_m = re.search(r'(\d+)\s*(?:mAh|hours|hrs)\b', s_clean, re.I)
                    if bat_m:
                        extracted_specs["battery"] = f"{bat_m.group(1)} hrs/mAh"

            res = {
                "source": "Tavily Search API (Live)",
                "connected": True,
                "status": "200_OK",
                "results_count": len(parsed_results),
                "results": parsed_results,
                "editorial_reviews": editorial_reviews,
                "extracted_specs": extracted_specs,
                "pros": list(pros_found)[:4],
                "cons": list(cons_found)[:3]
            }
            api_cache.set(cache_key, res, ttl_seconds=settings.CACHE_TTL_SECONDS)
            return res

        except Exception as e:
            return {
                "source": "Tavily Search API",
                "connected": False,
                "status": "error",
                "message": str(e),
                "results": [],
                "editorial_reviews": [],
                "extracted_specs": {},
                "pros": [],
                "cons": []
            }
