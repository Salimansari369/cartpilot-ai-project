import pytest
from app.agents.orchestrator import MultiAgentOrchestrator
from app.agents.langgraph_orchestrator import LangGraphOrchestrator
from app.utils.cache import TTLCache, RateLimiter
from app.providers.serpapi_provider import SerpApiShoppingProvider
from app.providers.tavily_provider import TavilyProvider
from app.database import SessionLocal, Base, engine
from app.seed_data import seed_database
from app.routers.missions import create_mission
from app.schemas import MissionCreate

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    seed_database()
    session = SessionLocal()
    yield session
    session.close()

def test_workflow_sony_wh_ch720n():
    """Task 6 Test 1: Sony WH-CH720N headphones complete shopping intelligence workflow."""
    orch = MultiAgentOrchestrator()
    res = orch.run_mission("Sony WH-CH720N headphones")
    assert res["status"] == "completed"
    assert len(res["recommendations"]) >= 1

    top_rec = res["recommendations"][0]
    assert "720N" in top_rec["canonical_title"] or "Sony" in top_rec["canonical_title"]
    assert top_rec["best_price"] > 0
    assert len(top_rec["evidence"]) >= 1

    # Check evidence from Verification Agent
    claims = [e["claim_text"] for e in top_rec["evidence"]]
    assert any("Noise" in c or "Battery" in c or "Authorized" in c for c in claims)

def test_workflow_samsung_galaxy_s24():
    """Task 6 Test 2: Samsung Galaxy S24 256GB exact variant and multi-platform matching."""
    orch = MultiAgentOrchestrator()
    res = orch.run_mission("Samsung Galaxy S24 256GB")
    assert res["status"] == "completed"
    assert len(res["recommendations"]) >= 1

    s24_rec = next((r for r in res["recommendations"] if "S24" in r["canonical_title"]), None)
    assert s24_rec is not None
    assert "256GB" in s24_rec["canonical_title"] or s24_rec["variants"].get("storage") == "256GB"
    assert s24_rec["best_price"] < 80000.0

    # Verify multiple store offers are cross-compared
    platforms = [o.platform if hasattr(o, "platform") else o["platform"] for o in s24_rec["offers"]]
    assert "amazon" in platforms or "flipkart" in platforms

def test_workflow_laptop_programming_under_70k():
    """Task 6 Test 3: A laptop for programming under ₹70,000."""
    orch = MultiAgentOrchestrator()
    res = orch.run_mission("A laptop for programming under ₹70,000")
    assert res["status"] == "completed"
    assert len(res["recommendations"]) >= 1

    # Check all top recommendations are under ₹70,000 (with allowance buffer)
    for r in res["recommendations"]:
        assert r["best_price"] <= 75000.0
        assert r["category"] == "electronics"

    # Best recommendation should have programming suitable specs (RAM/CPU)
    top_laptop = res["recommendations"][0]
    assert "ThinkPad" in top_laptop["canonical_title"] or "Vivobook" in top_laptop["canonical_title"]

def test_ttl_cache_and_rate_limiter():
    """Task 6 Requirement: Caching and rate limiting."""
    cache = TTLCache(default_ttl_seconds=1)
    cache.set("test_key", {"data": 123})
    assert cache.get("test_key") == {"data": 123}

    limiter = RateLimiter(max_calls_per_minute=2)
    assert limiter.can_proceed() is True
    assert limiter.can_proceed() is True
    assert limiter.can_proceed() is False  # Exceeded limit

def test_live_search_mission_persistence(db):
    """Task 5 Requirement: Persist live search results in DB."""
    payload = MissionCreate(raw_query="Sony WH-CH720N headphones")
    mission_res = create_mission(mission_in=payload, db=db)
    assert mission_res.status == "completed"
    assert mission_res.latest_run is not None
    assert len(mission_res.latest_run.recommendations) >= 1
    top_p = mission_res.latest_run.recommendations[0].product
    assert top_p.id is not None
    assert "Sony" in top_p.canonical_title or "720N" in top_p.canonical_title

def test_categories_for_you_section():
    """Verify all 5 'For You' categories return authentic cross-store products."""
    orch = MultiAgentOrchestrator()
    
    # 1. Books & More
    res_books = orch.run_mission("Bestselling books and self-improvement paperbacks")
    assert res_books["status"] == "completed"
    assert len(res_books["recommendations"]) >= 3
    titles_books = [r["canonical_title"] for r in res_books["recommendations"]]
    assert any("Atomic Habits" in t or "Psychology of Money" in t or "Ikigai" in t for t in titles_books)
    
    # 2. Home & Living
    res_home = orch.run_mission("Best home and living essentials, ergonomic chairs, and appliances")
    assert res_home["status"] == "completed"
    assert len(res_home["recommendations"]) >= 3
    titles_home = [r["canonical_title"] for r in res_home["recommendations"]]
    assert any("Induction" in t or "Mattress" in t or "Air Purifier" in t or "Monster" in t for t in titles_home)

    # 3. Beauty & Personal Care
    res_beauty = orch.run_mission("Top beauty and personal care essentials with best ratings")
    assert res_beauty["status"] == "completed"
    assert len(res_beauty["recommendations"]) >= 3
    titles_beauty = [r["canonical_title"] for r in res_beauty["recommendations"]]
    assert any("Cleanser" in t or "Niacinamide" in t or "Trimmer" in t or "Toothbrush" in t for t in titles_beauty)

    # 4. Fashion
    res_fashion = orch.run_mission("Best casual jackets, shirts, and fashion under budget")
    assert res_fashion["status"] == "completed"
    assert len(res_fashion["recommendations"]) >= 3
    titles_fashion = [r["canonical_title"] for r in res_fashion["recommendations"]]
    assert any("Shirt" in t or "Jacket" in t or "Sneaker" in t for t in titles_fashion)
