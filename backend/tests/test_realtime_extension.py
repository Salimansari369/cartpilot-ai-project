import pytest
from app.agents.entity_matcher import EntityMatchingAgent
from app.providers.base import RawPlatformOffer
from app.agents.langgraph_orchestrator import LangGraphOrchestrator
from app.providers.source_manager import source_manager
from app.providers.serpapi_provider import SerpApiShoppingProvider
from app.providers.tavily_provider import TavilyProvider
from app.routers.sources import get_sources_status
from app.routers.trends import get_market_trends
from app.database import SessionLocal, Base, engine
from app.seed_data import seed_database

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    seed_database()
    session = SessionLocal()
    yield session
    session.close()

def test_variant_matching_never_merges_different_ram():
    """Requirement 5: Never merge different variants because of similar titles."""
    matcher = EntityMatchingAgent()
    offer_8gb = RawPlatformOffer(
        platform="amazon",
        external_id="thinkpad_8gb_amz",
        title="Lenovo ThinkPad E14 Gen 5 8GB RAM 512GB SSD",
        url="https://amazon.in/dp/example1",
        price=55000.0,
        original_price=65000.0,
        discount_pct=15,
        rating=4.5,
        review_count=320,
        key_features=["8GB RAM", "Intel Core i5"],
        specs={"ram_gb": 8, "storage_gb": 512},
        brand="Lenovo"
    )
    offer_16gb = RawPlatformOffer(
        platform="flipkart",
        external_id="thinkpad_16gb_fk",
        title="Lenovo ThinkPad E14 Gen 5 16GB RAM 512GB SSD",
        url="https://flipkart.com/dp/example2",
        price=62000.0,
        original_price=72000.0,
        discount_pct=14,
        rating=4.6,
        review_count=180,
        key_features=["16GB RAM", "Intel Core i5"],
        specs={"ram_gb": 16, "storage_gb": 512},
        brand="Lenovo"
    )

    groups = matcher.group_offers([offer_8gb, offer_16gb])
    # Must create 2 distinct canonical products, not merge them
    assert len(groups) == 2
    rams = {g["variants"].get("ram") for g in groups}
    assert "8GB" in rams
    assert "16GB" in rams

def test_langgraph_orchestrator_8_nodes():
    """Requirement 4: LangGraph multi-agent orchestrator with 8 specialized agent stages."""
    orchestrator = LangGraphOrchestrator()
    result = orchestrator.run_mission("I want a wireless headphone under ₹5,000 for work and occasional gaming.")
    assert len(result["events"]) == 8
    event_agents = [e["agent_name"] for e in result["events"]]
    assert "Intent Parser" in event_agents
    assert "Product Scout" in event_agents
    assert "Specification Normalizer" in event_agents
    assert "Entity Matcher" in event_agents
    assert "Review Analyst" in event_agents
    assert "Price Tracker" in event_agents
    assert "Ranking Agent" in event_agents
    assert "Independent Evidence Verifier" in event_agents
    assert len(result["recommendations"]) >= 1

def test_source_manager_zero_fake_claims():
    """Requirement 14: Source-status dashboard with zero fake connection claims."""
    status = source_manager.get_all_sources_status()
    assert "total_sources" in status
    assert "sources" in status
    assert len(status["sources"]) >= 6

    # Verify Tavily & SerpApi report exact truth based on env
    tavily_entry = next(s for s in status["sources"] if s["id"] == "tavily_search_extract")
    serpapi_entry = next(s for s in status["sources"] if s["id"] == "serpapi_google_shopping")
    tavily = TavilyProvider()
    serpapi = SerpApiShoppingProvider()

    assert tavily_entry["connected"] == tavily.is_connected()
    assert serpapi_entry["connected"] == serpapi.is_connected()

def test_market_trends_endpoint(db):
    """Requirement 9: Trend discovery with labeled proxy indicators."""
    trends = get_market_trends(db=db)
    assert trends["status"] == "success"
    assert "trending_categories" in trends
    assert len(trends["trending_categories"]) >= 2
    assert trends["is_proxy_estimated"] is True
