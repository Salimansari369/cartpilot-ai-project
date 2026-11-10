from fastapi import APIRouter
from app.providers.source_manager import source_manager

router = APIRouter(prefix="/api/sources", tags=["Sources"])

@router.get("/status")
def get_sources_status():
    """
    Returns live connectivity, credentials state, and provenance for all data feeds.
    Strictly forbids fake 'live' claims if credentials are not configured.
    """
    return source_manager.get_all_sources_status()
