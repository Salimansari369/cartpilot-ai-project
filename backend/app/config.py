import os
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_SQLITE_PATH = os.path.join(BASE_DIR, "cartpilot.db").replace("\\", "/")

class Settings(BaseModel):
    APP_NAME: str = "CartPilot AI"
    APP_VERSION: str = "2.0.0-market-intelligence"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_SQLITE_PATH}")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: list[str] = ["*"]

    # Third-Party Market Intelligence API Keys
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    SERPAPI_API_KEY: str = os.getenv("SERPAPI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Authorized Marketplace Affiliate Credentials
    AMAZON_CREATORS_API_KEY: str = os.getenv("AMAZON_CREATORS_API_KEY", "")
    AMAZON_PARTNER_TAG: str = os.getenv("AMAZON_PARTNER_TAG", "")
    FLIPKART_AFFILIATE_ID: str = os.getenv("FLIPKART_AFFILIATE_ID", "")
    FLIPKART_AFFILIATE_TOKEN: str = os.getenv("FLIPKART_AFFILIATE_TOKEN", "")

    # Caching & Rate Limits
    CACHE_TTL_SECONDS: int = int(os.getenv("CACHE_TTL_SECONDS", "3600"))
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")

settings = Settings()
