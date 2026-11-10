import pytest
from app.database import SessionLocal, Base, engine
from app.seed_data import seed_database
from app.routers.products import list_products, get_product_price_trend
from app.routers.missions import create_mission, list_missions
from app.routers.comparison import compare_products, CompareRequest
from app.routers.preferences import simulate_weight_shift, SimulationRequest
from app.routers.evaluation import get_evaluation_metrics
from app.routers.alerts import get_alerts
from app.routers.cart import get_saved_items
from app.schemas import MissionCreate

@pytest.fixture(scope="module")
def db_session():
    Base.metadata.create_all(bind=engine)
    seed_database()
    db = SessionLocal()
    yield db
    db.close()

def test_list_products_api(db_session):
    products = list_products(db=db_session)
    assert len(products) >= 3
    assert any(p.canonical_title == "JBL Tune 770NC" for p in products)

def test_product_price_trend_api(db_session):
    products = list_products(db=db_session)
    prod_id = products[0].id
    trend = get_product_price_trend(product_id=prod_id, db=db_session)
    assert trend.product_id == prod_id
    assert trend.current_price > 0
    assert len(trend.points) > 0

def test_shopping_mission_create_api(db_session):
    payload = MissionCreate(
        raw_query="I want a wireless headphone under ₹5,000 for work and occasional gaming."
    )
    res = create_mission(mission_in=payload, db=db_session)
    assert res.parsed_category == "electronics"
    assert res.status == "completed"
    assert res.latest_run is not None
    assert len(res.latest_run.recommendations) >= 1

def test_compare_products_api(db_session):
    products = list_products(db=db_session)
    p_ids = [p.id for p in products[:2]]
    res = compare_products(req=CompareRequest(product_ids=p_ids), db=db_session)
    assert len(res.products) == 2
    assert "lowest_price_product" in res.best_dimensions

def test_preferences_simulation_api(db_session):
    products = list_products(db=db_session)
    p_ids = [p.id for p in products[:3]]
    sim_req = SimulationRequest(
        product_ids=p_ids,
        preferences={
            "price_weight": 0.5,
            "performance_weight": 0.1,
            "battery_weight": 0.2,
            "comfort_weight": 0.1,
            "reliability_weight": 0.1
        }
    )
    res = simulate_weight_shift(req=sim_req, db=db_session)
    assert len(res.ranked_products) == len(p_ids)
    assert "Price prioritizes lower-cost" in res.shift_explanation

def test_evaluation_benchmark_api():
    eval_res = get_evaluation_metrics()
    assert eval_res["total_cases_evaluated"] >= 3
    assert eval_res["agent_satisfaction_rate"] >= 80.0
    assert eval_res["disagreement_resolution_count"] >= 1

def test_saved_items_api(db_session):
    items = get_saved_items(list_type="smart_cart", db=db_session)
    assert len(items) >= 1

def test_alerts_api(db_session):
    alerts = get_alerts(db=db_session)
    assert len(alerts) >= 1
