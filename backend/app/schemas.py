from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import datetime

class PreferenceBase(BaseModel):
    price_weight: float = Field(0.25, ge=0.0, le=1.0)
    performance_weight: float = Field(0.25, ge=0.0, le=1.0)
    battery_weight: float = Field(0.20, ge=0.0, le=1.0)
    comfort_weight: float = Field(0.15, ge=0.0, le=1.0)
    reliability_weight: float = Field(0.15, ge=0.0, le=1.0)
    brand_affinity: Dict[str, float] = {}

class PreferenceUpdate(PreferenceBase):
    pass

class PreferenceResponse(PreferenceBase):
    id: int
    user_id: Optional[int] = None
    last_updated: datetime.datetime

    class Config:
        from_attributes = True


class MerchantOfferSchema(BaseModel):
    id: int
    platform: str
    external_product_id: Optional[str] = None
    title: str
    url: str
    price: float
    original_price: float
    discount_pct: int
    currency: str
    in_stock: bool
    seller_name: str
    seller_rating: float
    delivery_days: int
    return_policy: str
    retrieved_at: datetime.datetime
    provenance_metadata: Dict[str, Any] = {}

    class Config:
        from_attributes = True


class NormalizedSpecSchema(BaseModel):
    attribute_name: str
    normalized_value: str
    raw_value: Optional[str] = None
    confidence: float = 1.0

    class Config:
        from_attributes = True


class ReviewInsightSchema(BaseModel):
    aspect: str
    sentiment_score: float
    mention_count: int
    summary: str
    suspicious_patterns_score: float
    fake_review_indicators: List[str] = []

    class Config:
        from_attributes = True


class ProductSchema(BaseModel):
    id: int
    canonical_title: str
    category: str
    brand: str
    model_number: Optional[str] = None
    thumbnail_url: Optional[str] = None
    badge: Optional[str] = None
    rating: float
    review_count: int
    key_features: List[str] = []
    base_specifications: Dict[str, Any] = {}
    verified: bool = True
    offers: List[MerchantOfferSchema] = []
    insights: List[ReviewInsightSchema] = []
    specs: List[NormalizedSpecSchema] = []

    class Config:
        from_attributes = True


class AgentEventSchema(BaseModel):
    id: Optional[int] = None
    agent_name: str
    event_type: str  # started, thought, finding, disagreement, completed, skipped, failed
    message: str
    payload_json: Dict[str, Any] = {}
    timestamp: datetime.datetime

    class Config:
        from_attributes = True


class RecommendationEvidenceSchema(BaseModel):
    agent_name: str
    claim_text: str
    evidence_source: str
    confidence: float
    verified: bool

    class Config:
        from_attributes = True


class RecommendationSchema(BaseModel):
    id: int
    product_id: int
    rank: int
    badge: Optional[str] = None
    overall_score: float
    score_breakdown: Dict[str, float]
    reasons: List[str]
    sacrifice_tradeoffs: List[str]
    disagreements: List[Dict[str, Any]] = []
    confidence_score: float
    product: ProductSchema
    evidence: List[RecommendationEvidenceSchema] = []

    class Config:
        from_attributes = True


class AgentRunResponse(BaseModel):
    id: int
    mission_id: int
    orchestrator_version: str
    status: str
    started_at: datetime.datetime
    completed_at: Optional[datetime.datetime] = None
    total_duration_ms: int
    events: List[AgentEventSchema] = []
    recommendations: List[RecommendationSchema] = []

    class Config:
        from_attributes = True


class MissionCreate(BaseModel):
    raw_query: str
    preferences: Optional[PreferenceBase] = None
    clarification_response: Optional[Dict[str, Any]] = None


class MissionResponse(BaseModel):
    id: int
    raw_query: str
    parsed_category: str
    max_budget: Optional[float] = None
    min_budget: Optional[float] = None
    intended_use: str
    priorities: List[str] = []
    brands: List[str] = []
    status: str
    clarification_question: Optional[str] = None
    created_at: datetime.datetime
    latest_run: Optional[AgentRunResponse] = None

    class Config:
        from_attributes = True


class SavedItemCreate(BaseModel):
    product_id: int
    list_type: str = "wishlist"  # wishlist, smart_cart, compare
    notes: Optional[str] = None


class SavedItemResponse(BaseModel):
    id: int
    product_id: int
    list_type: str
    notes: Optional[str] = None
    added_at: datetime.datetime
    product: ProductSchema

    class Config:
        from_attributes = True


class PriceAlertCreate(BaseModel):
    product_id: int
    target_price: float
    notify_email: str = "user@example.com"


class PriceAlertResponse(BaseModel):
    id: int
    product_id: int
    target_price: float
    current_price: float
    notify_email: str
    active: bool
    triggered: bool
    created_at: datetime.datetime
    product: ProductSchema

    class Config:
        from_attributes = True


class PricePoint(BaseModel):
    month: str
    price: float
    note: Optional[str] = None


class PriceTrendResponse(BaseModel):
    product_id: int
    canonical_title: str
    current_price: float
    historical_average: float
    price_drop: float
    price_drop_pct: float
    recommendation: str  # "Buy Now: Price is 36% lower than average", "Wait for Sale", etc.
    confidence: float
    points: List[PricePoint]
    is_demo_data: bool = True


class BenchmarkCase(BaseModel):
    query: str
    user_constraints: Dict[str, Any]
    agent_top_pick: str
    agent_score: float
    cheapest_pick: str
    cheapest_price: float
    keyword_pick: str
    why_agent_won: str
    metrics: Dict[str, float]


class EvaluationResultSchema(BaseModel):
    timestamp: datetime.datetime
    total_cases_evaluated: int
    agent_satisfaction_rate: float
    baseline_cheapest_satisfaction_rate: float
    baseline_keyword_satisfaction_rate: float
    average_tradeoff_transparency_score: float
    disagreement_resolution_count: int
    cases: List[BenchmarkCase]
