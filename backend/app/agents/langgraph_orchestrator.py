import datetime
from typing import Dict, Any, List, Optional, TypedDict
from langgraph.graph import StateGraph, END

from app.agents.intent_agent import IntentAgent
from app.agents.scout_agent import ScoutAgent
from app.agents.entity_matcher import EntityMatchingAgent
from app.agents.review_agent import ReviewIntelligenceAgent
from app.agents.price_agent import PriceIntelligenceAgent
from app.agents.decision_agent import DecisionAgent
from app.agents.verification_agent import VerificationAgent
from app.providers.tavily_provider import TavilyProvider
from app.providers.serpapi_provider import SerpApiShoppingProvider

class MissionGraphState(TypedDict):
    raw_query: str
    user_preferences: Dict[str, float]
    parsed_intent: Dict[str, Any]
    raw_offers: List[Any]
    normalized_specs: Dict[str, Any]
    matched_products: List[Dict[str, Any]]
    review_insights: Dict[str, Any]
    price_analytics: Dict[str, Any]
    recommendations: List[Dict[str, Any]]
    verification_results: List[Dict[str, Any]]
    events: List[Dict[str, Any]]

class LangGraphOrchestrator:
    """
    LangGraph-powered state graph multi-agent orchestrator for CartPilot AI.
    Features 8 specialized agents executing in a traceable, verifiable graph.
    """
    def __init__(self):
        self.intent_agent = IntentAgent()
        self.scout_agent = ScoutAgent()
        self.entity_matcher = EntityMatchingAgent()
        self.review_agent = ReviewIntelligenceAgent()
        self.price_agent = PriceIntelligenceAgent()
        self.decision_agent = DecisionAgent()
        self.verification_agent = VerificationAgent()
        self.tavily_provider = TavilyProvider()
        self.serpapi_provider = SerpApiShoppingProvider()

        # Build Graph
        self.graph = self._build_graph()

    def _now(self) -> str:
        return datetime.datetime.now(datetime.timezone.utc).isoformat()

    def _node_intent_parser(self, state: MissionGraphState) -> Dict[str, Any]:
        parsed = self.intent_agent.parse(state["raw_query"])
        cat = parsed.get("category", "electronics")
        budget = parsed.get("max_budget") or 5000.0
        prios = parsed.get("priorities", ["battery", "performance"])
        event = {
            "step_id": "intent_parser",
            "agent_name": "Intent Parser",
            "status": "completed",
            "message": f"Identified category: {cat.upper()}, Budget cap: ₹{budget:,.0f}, Priorities: {', '.join(prios)}",
            "timestamp": self._now()
        }
        return {
            "parsed_intent": {
                "category": cat,
                "max_budget": budget,
                "priorities": prios,
                "brand_preferences": parsed.get("brand_preferences", []),
                "use_case": parsed.get("use_case", "general")
            },
            "events": state["events"] + [event]
        }

    def _node_product_scout(self, state: MissionGraphState) -> Dict[str, Any]:
        intent = state["parsed_intent"]
        offers, stats = self.scout_agent.discover(
            query=state["raw_query"],
            category=intent.get("category"),
            max_budget=intent.get("max_budget")
        )
        if self.serpapi_provider.is_connected():
            live_res = self.serpapi_provider.search_google_shopping(
                state["raw_query"], intent.get("category"), intent.get("max_budget")
            )
            for lo in live_res.get("offers", []):
                offers.append(lo)

        event = {
            "step_id": "product_scout",
            "agent_name": "Product Scout",
            "status": "completed",
            "message": f"Discovered {len(offers)} offers across Amazon, Flipkart, Meesho, Myntra & Google Shopping",
            "timestamp": self._now()
        }
        return {
            "raw_offers": offers,
            "events": state["events"] + [event]
        }

    def _node_spec_normalizer(self, state: MissionGraphState) -> Dict[str, Any]:
        specs_map = {}
        for offer in state["raw_offers"]:
            if hasattr(offer, "specs") and offer.specs:
                for k, v in offer.specs.items():
                    norm_label, num_val = self.entity_matcher.normalize_spec_value(k, v)
                    specs_map[f"{offer.external_id}_{k}"] = {
                        "raw": v,
                        "normalized": norm_label,
                        "numeric_value": num_val
                    }
        event = {
            "step_id": "spec_normalizer",
            "agent_name": "Specification Normalizer",
            "status": "completed",
            "message": "Normalized technical specifications into canonical SI units",
            "timestamp": self._now()
        }
        return {
            "normalized_specs": specs_map,
            "events": state["events"] + [event]
        }

    def _node_entity_matcher(self, state: MissionGraphState) -> Dict[str, Any]:
        matched = self.entity_matcher.group_offers(state["raw_offers"])
        event = {
            "step_id": "entity_matcher",
            "agent_name": "Entity Matcher",
            "status": "completed",
            "message": f"Merged multi-platform listings into {len(matched)} distinct canonical products with variant separation",
            "timestamp": self._now()
        }
        return {
            "matched_products": matched,
            "events": state["events"] + [event]
        }

    def _node_review_analyst(self, state: MissionGraphState) -> Dict[str, Any]:
        insights = {}
        for p in state["matched_products"]:
            analysis = self.review_agent.analyze(p["canonical_title"])
            if self.tavily_provider.is_connected():
                ext = self.tavily_provider.search_product_intelligence(p["canonical_title"])
                analysis["editorial_reviews"] = ext.get("editorial_reviews", [])
            insights[p["canonical_title"]] = analysis

        event = {
            "step_id": "review_analyst",
            "agent_name": "Review Analyst",
            "status": "completed",
            "message": "Synthesized aspect sentiments, common complaints, and verified sample sizes",
            "timestamp": self._now()
        }
        return {
            "review_insights": insights,
            "events": state["events"] + [event]
        }

    def _node_price_tracker(self, state: MissionGraphState) -> Dict[str, Any]:
        analytics = {}
        for p in state["matched_products"]:
            pa = self.price_agent.analyze(
                canonical_title=p["canonical_title"],
                current_best_price=p["best_price"]
            )
            analytics[p["canonical_title"]] = pa

        event = {
            "step_id": "price_tracker",
            "agent_name": "Price Tracker",
            "status": "completed",
            "message": "Evaluated price histories, deal depth, and Buy Now vs Wait statistical forecast",
            "timestamp": self._now()
        }
        return {
            "price_analytics": analytics,
            "events": state["events"] + [event]
        }

    def _node_ranking_agent(self, state: MissionGraphState) -> Dict[str, Any]:
        intent = state["parsed_intent"]
        recs = self.decision_agent.rank(
            products=state["matched_products"],
            preferences=state["user_preferences"],
            intended_use=intent.get("use_case", "general"),
            max_budget=intent.get("max_budget")
        )
        event = {
            "step_id": "ranking_agent",
            "agent_name": "Ranking Agent",
            "status": "completed",
            "message": "Generated explainable rankings with transparent multi-factor weighted scoring",
            "timestamp": self._now()
        }
        return {
            "recommendations": recs,
            "events": state["events"] + [event]
        }

    def _node_evidence_verifier(self, state: MissionGraphState) -> Dict[str, Any]:
        verified_results = self.verification_agent.audit_recommendations(state["recommendations"])
        event = {
            "step_id": "evidence_verifier",
            "agent_name": "Independent Evidence Verifier",
            "status": "completed",
            "message": "Audited factual claims, merchant return policies, and source timestamps",
            "timestamp": self._now()
        }
        return {
            "verification_results": verified_results,
            "events": state["events"] + [event]
        }

    def _build_graph(self):
        builder = StateGraph(MissionGraphState)

        # 8 Agent Nodes
        builder.add_node("intent_parser", self._node_intent_parser)
        builder.add_node("product_scout", self._node_product_scout)
        builder.add_node("spec_normalizer", self._node_spec_normalizer)
        builder.add_node("entity_matcher", self._node_entity_matcher)
        builder.add_node("review_analyst", self._node_review_analyst)
        builder.add_node("price_tracker", self._node_price_tracker)
        builder.add_node("ranking_agent", self._node_ranking_agent)
        builder.add_node("evidence_verifier", self._node_evidence_verifier)

        # Edges
        builder.set_entry_point("intent_parser")
        builder.add_edge("intent_parser", "product_scout")
        builder.add_edge("product_scout", "spec_normalizer")
        builder.add_edge("spec_normalizer", "entity_matcher")
        builder.add_edge("entity_matcher", "review_analyst")
        builder.add_edge("review_analyst", "price_tracker")
        builder.add_edge("price_tracker", "ranking_agent")
        builder.add_edge("ranking_agent", "evidence_verifier")
        builder.add_edge("evidence_verifier", END)

        return builder.compile()

    def run_mission(self, raw_query: str, user_weights: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
        initial_state: MissionGraphState = {
            "raw_query": raw_query,
            "user_preferences": user_weights or {
                "price_weight": 0.30,
                "performance_weight": 0.25,
                "reliability_weight": 0.20,
                "battery_weight": 0.15,
                "comfort_weight": 0.10
            },
            "parsed_intent": {},
            "raw_offers": [],
            "normalized_specs": {},
            "matched_products": [],
            "review_insights": {},
            "price_analytics": {},
            "recommendations": [],
            "verification_results": [],
            "events": []
        }
        return self.graph.invoke(initial_state)

langgraph_orchestrator = LangGraphOrchestrator()
