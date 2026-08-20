"""FastAPI application entry point with lifespan events."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1.router import v1_router
from app.infrastructure.qdrant_client import close_qdrant_client
from app.infrastructure.redis_client import close_redis_client
from app.infrastructure.minio_client import ensure_bucket_exists

logger = logging.getLogger("rag-platform")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle events."""
    # ── Startup ──
    logger.info("🚀 Starting RAG Chatbot Platform API...")
    logger.info(f"   Database: {'NeonDB (cloud)' if 'neon.tech' in settings.database_url else 'local'}")
    logger.info(f"   Qdrant:   {settings.qdrant_host}:{settings.qdrant_port}")
    logger.info(f"   Redis:    {settings.redis_url}")
    logger.info(f"   MinIO:    {settings.minio_endpoint}")

    # Ensure MinIO bucket exists
    try:
        await ensure_bucket_exists()
        logger.info(f"   MinIO bucket '{settings.minio_bucket}' ready")
    except Exception as e:
        logger.warning(f"   MinIO bucket creation skipped: {e}")

    yield

    # ── Shutdown ──
    logger.info("🛑 Shutting down RAG Chatbot Platform API...")
    await close_qdrant_client()
    await close_redis_client()


# ── App ──
app = FastAPI(
    title="RAG Chatbot Platform API",
    description="Backend API for the configurable RAG chatbot desktop platform",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS (allow desktop client) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tauri desktop sends requests from custom scheme
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ──
app.include_router(v1_router)


@app.get("/")
async def root():
    """Root endpoint — basic API info."""
    return {
        "name": "RAG Chatbot Platform API",
        "version": "0.1.0",
        "docs": "/docs",
    }
