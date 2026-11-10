import pytest
from app.agents.intent_agent import IntentAgent
from app.agents.scout_agent import ScoutAgent
from app.agents.entity_matcher import EntityMatchingAgent
from app.agents.review_agent import ReviewIntelligenceAgent
from app.agents.price_agent import PriceIntelligenceAgent
from app.agents.decision_agent import DecisionAgent
from app.agents.verification_agent import VerificationAgent

def test_intent_agent_budget_and_category():
    agent = IntentAgent()
    res = agent.parse("I want a wireless headphone under ₹5,000 for work and occasional gaming.")
    assert res["category"] == "electronics"
    assert res["max_budget"] == 5000.0
    assert "gaming" in res["intended_use"]
    assert not res["clarification_needed"]

def test_intent_agent_clarification():
    agent = IntentAgent()
    res = agent.parse("laptop")
    assert res["clarification_needed"] is True
    assert "budget" in res["clarification_question"].lower()

def test_scout_agent_discovery():
    scout = ScoutAgent()
    offers, stats = scout.discover("wireless headphone", category="electronics", max_budget=6000.0)
    assert len(offers) > 0
    assert "amazon" in stats
    assert "flipkart" in stats
    assert "myntra" in stats

def test_entity_matcher_grouping():
    scout = ScoutAgent()
    matcher = EntityMatchingAgent()
    offers, _ = scout.discover("770nc", category="electronics")
    groups = matcher.group_offers(offers)
    assert len(groups) >= 1
    # Check specs normalized
    norm_str, num_val = matcher.normalize_spec_value("battery_hours", "70 hours")
    assert num_val == 70.0

def test_review_intelligence_agent():
    rev_agent = ReviewIntelligenceAgent()
    insights = rev_agent.analyze("JBL Tune 770NC")
    assert insights["overall_sentiment"] > 0.7
    assert len(insights["aspects"]) > 0
    assert insights["suspicious_patterns_score"] < 0.1

def test_price_intelligence_agent():
    price_agent = PriceIntelligenceAgent()
    analysis = price_agent.analyze("JBL Tune 770NC", 4499.0)
    assert analysis["current_price"] == 4499.0
    assert analysis["historical_average"] > 4499.0
    assert "Buy Now" in analysis["recommendation"]

def test_decision_agent_deterministic_ranking():
    decision = DecisionAgent()
    sample_products = [
        {
            "canonical_title": "JBL Tune 770NC",
            "best_price": 4499.0,
            "specs": {"has_anc": True, "battery_hours": 70, "weight_g": 232},
            "rating": 4.4,
            "review_count": 42000
        },
        {
            "canonical_title": "boAt Immortal 1000D",
            "best_price": 3999.0,
            "specs": {"has_anc": False, "latency_ms": 40, "battery_hours": 65, "weight_g": 280},
            "rating": 4.3,
            "review_count": 28000
        }
    ]
    ranked = decision.rank(sample_products, intended_use="work and gaming")
    assert len(ranked) == 2
    assert "score_breakdown" in ranked[0]
    assert len(ranked[0]["sacrifice_tradeoffs"]) > 0

def test_verification_agent_audit():
    verifier = VerificationAgent()
    recs = [{
        "canonical_title": "JBL Tune 770NC",
        "rank": 1,
        "best_price": 4499.0
    }]
    verified = verifier.audit_recommendations(recs)
    assert len(verified[0]["evidence"]) > 0
    assert verified[0]["evidence"][0]["verified"] is True
