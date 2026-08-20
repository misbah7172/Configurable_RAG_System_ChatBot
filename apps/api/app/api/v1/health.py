"""Health check endpoint — verifies all infrastructure connectivity."""

from fastapi import APIRouter

from app.database import check_database_connection
from app.infrastructure.qdrant_client import check_qdrant_connection
from app.infrastructure.redis_client import check_redis_connection
from app.infrastructure.minio_client import check_minio_connection

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Deep health check — pings PostgreSQL (NeonDB), Qdrant, Redis, and MinIO.
    Returns individual service status.
    """
    db_ok = await check_database_connection()
    qdrant_ok = await check_qdrant_connection()
    redis_ok = await check_redis_connection()
    minio_ok = await check_minio_connection()

    all_ok = all([db_ok, qdrant_ok, redis_ok, minio_ok])

    return {
        "status": "ok" if all_ok else "degraded",
        "services": {
            "database": "connected" if db_ok else "unreachable",
            "qdrant": "connected" if qdrant_ok else "unreachable",
            "redis": "connected" if redis_ok else "unreachable",
            "minio": "connected" if minio_ok else "unreachable",
        },
    }
