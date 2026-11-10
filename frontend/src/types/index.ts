export interface MerchantOffer {
  id: number;
  platform: 'amazon' | 'flipkart' | 'meesho' | 'myntra' | string;
  external_product_id?: string;
  title: string;
  url: string;
  price: number;
  original_price: number;
  discount_pct: number;
  currency: string;
  in_stock: boolean;
  seller_name: string;
  seller_rating: number;
  delivery_days: number;
  return_policy: string;
  provenance_metadata?: Record<string, any>;
}

export interface ReviewInsight {
  aspect: string;
  sentiment_score: number;
  mention_count: number;
  summary: string;
  suspicious_patterns_score: number;
  fake_review_indicators?: string[];
}

export interface NormalizedSpec {
  attribute_name: string;
  normalized_value: string;
  raw_value?: string;
  confidence: number;
}

export interface Product {
  id: number;
  canonical_title: string;
  category: string;
  brand: string;
  model_number?: string;
  thumbnail_url?: string;
  badge?: string;
  rating: number;
  review_count: number;
  key_features: string[];
  base_specifications?: Record<string, any>;
  verified: boolean;
  offers: MerchantOffer[];
  insights: ReviewInsight[];
  specs: NormalizedSpec[];
}

export interface RecommendationEvidence {
  agent_name: string;
  claim_text: string;
  evidence_source: string;
  confidence: number;
  verified: boolean;
}

export interface Disagreement {
  contending_agents: string[];
  price_agent_stance: string;
  review_agent_stance: string;
  resolution: string;
}

export interface Recommendation {
  id: number;
  product_id: number;
  rank: number;
  badge?: string;
  overall_score: number;
  score_breakdown: {
    price: number;
    performance: number;
    battery: number;
    comfort: number;
    reliability: number;
    [key: string]: number;
  };
  reasons: string[];
  sacrifice_tradeoffs: string[];
  disagreements?: Disagreement[];
  confidence_score: number;
  product: Product;
  evidence: RecommendationEvidence[];
}

export interface AgentEvent {
  id?: number;
  agent_name: string;
  event_type: string;
  message: string;
  payload_json?: Record<string, any>;
  timestamp: string;
}

export interface AgentRun {
  id: number;
  mission_id: number;
  orchestrator_version: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  total_duration_ms: number;
  events: AgentEvent[];
  recommendations: Recommendation[];
}

export interface ShoppingMission {
  id: number;
  raw_query: string;
  parsed_category: string;
  max_budget?: number;
  min_budget?: number;
  intended_use: string;
  priorities: string[];
  brands: string[];
  status: 'queued' | 'running' | 'completed' | 'clarification_needed';
  clarification_question?: string;
  created_at: string;
  latest_run?: AgentRun;
}

export interface PricePoint {
  month: string;
  price: number;
  note?: string;
}

export interface PriceTrendData {
  product_id: number;
  canonical_title: string;
  current_price: number;
  historical_average: number;
  price_drop: number;
  price_drop_pct: number;
  recommendation: string;
  confidence: number;
  points: PricePoint[];
  is_demo_data: boolean;
}

export interface UserPreferences {
  price_weight: number;
  performance_weight: number;
  battery_weight: number;
  comfort_weight: number;
  reliability_weight: number;
  brand_affinity?: Record<string, number>;
}

export interface SavedItem {
  id: number;
  product_id: number;
  list_type: 'wishlist' | 'smart_cart' | 'compare';
  notes?: string;
  added_at: string;
  product: Product;
}

export interface PriceAlert {
  id: number;
  product_id: number;
  target_price: number;
  current_price: number;
  notify_email: string;
  active: boolean;
  triggered: boolean;
  created_at: string;
  product: Product;
}

export interface EvaluationBenchmark {
  timestamp: string;
  total_cases_evaluated: number;
  agent_satisfaction_rate: number;
  baseline_cheapest_satisfaction_rate: number;
  baseline_keyword_satisfaction_rate: number;
  average_tradeoff_transparency_score: number;
  disagreement_resolution_count: number;
  cases: Array<{
    query: string;
    user_constraints: Record<string, any>;
    agent_top_pick: string;
    agent_score: number;
    cheapest_pick: string;
    cheapest_price: number;
    keyword_pick: string;
    why_agent_won: string;
    metrics: Record<string, number>;
  }>;
}
