import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), default="Shopper")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    preferences = relationship("Preference", back_populates="user", uselist=False)
    missions = relationship("ShoppingMission", back_populates="user")
    saved_items = relationship("SavedItem", back_populates="user")
    alerts = relationship("PriceAlert", back_populates="user")


class Preference(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    price_weight = Column(Float, default=0.25)
    performance_weight = Column(Float, default=0.25)
    battery_weight = Column(Float, default=0.20)
    comfort_weight = Column(Float, default=0.15)
    reliability_weight = Column(Float, default=0.15)
    brand_affinity = Column(JSON, default=dict)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="preferences")


class ShoppingMission(Base):
    __tablename__ = "shopping_missions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    raw_query = Column(Text, nullable=False)
    parsed_category = Column(String(100), default="electronics")
    max_budget = Column(Float, nullable=True)
    min_budget = Column(Float, nullable=True)
    intended_use = Column(String(255), default="general")
    priorities = Column(JSON, default=list)
    brands = Column(JSON, default=list)
    status = Column(String(50), default="completed")  # queued, running, completed, clarification_needed
    clarification_question = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="missions")
    runs = relationship("AgentRun", back_populates="mission", cascade="all, delete-orphan")


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("shopping_missions.id"), nullable=False)
    orchestrator_version = Column(String(50), default="2.0-multi-agent")
    status = Column(String(50), default="completed")  # queued, running, completed, failed
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    total_duration_ms = Column(Integer, default=0)

    mission = relationship("ShoppingMission", back_populates="runs")
    events = relationship("AgentEvent", back_populates="run", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="run", cascade="all, delete-orphan")


class AgentEvent(Base):
    __tablename__ = "agent_events"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("agent_runs.id"), nullable=False)
    agent_name = Column(String(50), nullable=False)  # intent, scout, matcher, review, price, decision, verification
    event_type = Column(String(50), nullable=False)  # started, thought, finding, disagreement, completed, skipped, failed
    message = Column(Text, nullable=False)
    payload_json = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    run = relationship("AgentRun", back_populates="events")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    canonical_title = Column(String(255), nullable=False, index=True)
    category = Column(String(100), index=True)
    brand = Column(String(100), index=True)
    model_number = Column(String(100), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    badge = Column(String(50), nullable=True)  # "Best Overall", "Best for Gaming", "Best Value"
    rating = Column(Float, default=4.0)
    review_count = Column(Integer, default=100)
    key_features = Column(JSON, default=list)  # list of strings: ["Active Noise Cancellation", "Up to 70 Hours Battery"]
    base_specifications = Column(JSON, default=dict)
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    offers = relationship("MerchantOffer", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("ReviewRecord", back_populates="product", cascade="all, delete-orphan")
    insights = relationship("ReviewInsight", back_populates="product", cascade="all, delete-orphan")
    specs = relationship("NormalizedSpec", back_populates="product", cascade="all, delete-orphan")


class NormalizedSpec(Base):
    __tablename__ = "normalized_specs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    attribute_name = Column(String(100), nullable=False)
    normalized_value = Column(String(255), nullable=False)
    raw_value = Column(String(255), nullable=True)
    confidence = Column(Float, default=1.0)

    product = relationship("Product", back_populates="specs")


class MerchantOffer(Base):
    __tablename__ = "merchant_offers"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    platform = Column(String(50), nullable=False)  # amazon, flipkart, meesho, myntra
    external_product_id = Column(String(100), nullable=True)
    title = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=False)
    discount_pct = Column(Integer, default=0)
    currency = Column(String(10), default="INR")
    in_stock = Column(Boolean, default=True)
    seller_name = Column(String(100), default="Verified Seller")
    seller_rating = Column(Float, default=4.5)
    delivery_days = Column(Integer, default=2)
    return_policy = Column(String(100), default="7-day replacement")
    retrieved_at = Column(DateTime, default=datetime.datetime.utcnow)
    provenance_metadata = Column(JSON, default=dict)

    product = relationship("Product", back_populates="offers")
    price_observations = relationship("PriceObservation", back_populates="offer", cascade="all, delete-orphan")


class PriceObservation(Base):
    __tablename__ = "price_observations"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(Integer, ForeignKey("merchant_offers.id"), nullable=False)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)
    price = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")

    offer = relationship("MerchantOffer", back_populates="price_observations")


class ReviewRecord(Base):
    __tablename__ = "review_records"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    platform = Column(String(50), default="amazon")
    rating = Column(Float, nullable=False)
    review_text = Column(Text, nullable=False)
    reviewer_name = Column(String(100), default="Customer")
    review_date = Column(DateTime, default=datetime.datetime.utcnow)
    verified_purchase = Column(Boolean, default=True)

    product = relationship("Product", back_populates="reviews")


class ReviewInsight(Base):
    __tablename__ = "review_insights"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    aspect = Column(String(100), nullable=False)  # sound, battery, comfort, build, value
    sentiment_score = Column(Float, default=0.8)  # -1 to 1
    mention_count = Column(Integer, default=150)
    summary = Column(Text, nullable=False)
    suspicious_patterns_score = Column(Float, default=0.08)  # 0 to 1
    fake_review_indicators = Column(JSON, default=list)

    product = relationship("Product", back_populates="insights")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("agent_runs.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    rank = Column(Integer, nullable=False)
    badge = Column(String(50), nullable=True)  # e.g. "Best Overall", "Best for Gaming", "Best Value"
    overall_score = Column(Float, nullable=False)
    score_breakdown = Column(JSON, default=dict)  # price, performance, battery, comfort, reliability
    reasons = Column(JSON, default=list)
    sacrifice_tradeoffs = Column(JSON, default=list)  # what user gives up
    disagreements = Column(JSON, default=list)  # agent disagreements
    confidence_score = Column(Float, default=0.92)

    run = relationship("AgentRun", back_populates="recommendations")
    product = relationship("Product")
    evidence = relationship("RecommendationEvidence", back_populates="recommendation", cascade="all, delete-orphan")


class RecommendationEvidence(Base):
    __tablename__ = "recommendation_evidence"

    id = Column(Integer, primary_key=True, index=True)
    recommendation_id = Column(Integer, ForeignKey("recommendations.id"), nullable=False)
    agent_name = Column(String(50), nullable=False)
    claim_text = Column(Text, nullable=False)
    evidence_source = Column(String(255), nullable=False)
    confidence = Column(Float, default=0.9)
    verified = Column(Boolean, default=True)

    recommendation = relationship("Recommendation", back_populates="evidence")


class SavedItem(Base):
    __tablename__ = "saved_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    list_type = Column(String(50), default="wishlist")  # wishlist, smart_cart, compare
    notes = Column(Text, nullable=True)
    added_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_items")
    product = relationship("Product")


class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    target_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    notify_email = Column(String(255), default="user@example.com")
    active = Column(Boolean, default=True)
    triggered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="alerts")
    product = relationship("Product")
