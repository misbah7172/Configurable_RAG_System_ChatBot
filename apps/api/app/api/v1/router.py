"""V1 API router — aggregates all v1 sub-routers."""

from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1.chatbots import router as chatbots_router
from app.api.v1.knowledge_bases import router as kb_router

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(health_router)
v1_router.include_router(chatbots_router)
v1_router.include_router(kb_router)
