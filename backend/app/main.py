import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.seed_data import seed_database
from app.routers import missions, products, comparison, preferences, cart, alerts, evaluation, sources, trends

# Initialize tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Explainable Multi-Agent Cross-Platform Shopping Decision System"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to ensure seeded data
@app.on_event("startup")
def on_startup():
    try:
        seed_database()
    except Exception as e:
        print(f"Startup seed notice: {e}")

# Include Routers
app.include_router(missions.router)
app.include_router(products.router)
app.include_router(comparison.router)
app.include_router(preferences.router)
app.include_router(cart.router)
app.include_router(alerts.router)
app.include_router(evaluation.router)
app.include_router(sources.router)
app.include_router(trends.router)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "demo_mode": settings.DEMO_MODE,
        "connected_platforms": {
            "amazon": "curated_sandbox_feed",
            "flipkart": "curated_sandbox_feed",
            "meesho": "curated_sandbox_feed",
            "myntra": "curated_sandbox_feed"
        },
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "demo_mode": settings.DEMO_MODE}
