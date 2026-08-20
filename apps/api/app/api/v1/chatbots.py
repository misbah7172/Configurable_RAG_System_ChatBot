"""Chatbot CRUD endpoints."""

from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.domain.models import Chatbot, ChatbotConfig
from app.config import settings

router = APIRouter(prefix="/chatbots", tags=["chatbots"])


# ── Schemas ──

class ChatbotCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    avatar: str = "🤖"


class ChatbotUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    avatar: Optional[str] = None
    status: Optional[str] = None


class ChatbotConfigCreate(BaseModel):
    system_prompt: str = "You are a helpful assistant."
    llm_provider: str = "openai"
    llm_model: str = "gpt-4o-mini"
    temperature: float = 0.7
    max_tokens: int = 1024
    embedding_provider: str = "local"
    embedding_model: str = "bge-m3"
    retrieval_strategy: str = "hybrid"
    top_k: int = 10
    reranking_enabled: bool = False
    exact_cache_enabled: bool = True
    semantic_cache_enabled: bool = True
    embedding_cache_enabled: bool = True
    memory_strategy: str = "short-term"
    memory_window_size: int = 10
    knowledge_base_ids: list[str] = []


class ChatbotResponse(BaseModel):
    id: str
    name: str
    description: str
    avatar: str
    status: str
    active_config_version: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# ── Endpoints ──

@router.get("")
async def list_chatbots(db: AsyncSession = Depends(get_db)):
    """List all chatbots for the default tenant."""
    tenant_id = settings.default_tenant_id
    result = await db.execute(
        select(Chatbot).where(Chatbot.tenant_id == tenant_id).order_by(Chatbot.created_at.desc())
    )
    chatbots = result.scalars().all()
    return [
        {
            "id": str(cb.id),
            "name": cb.name,
            "description": cb.description,
            "avatar": cb.avatar,
            "status": cb.status,
            "active_config_version": cb.active_config_version,
            "created_at": cb.created_at.isoformat(),
            "updated_at": cb.updated_at.isoformat(),
        }
        for cb in chatbots
    ]


@router.post("", status_code=201)
async def create_chatbot(body: ChatbotCreate, db: AsyncSession = Depends(get_db)):
    """Create a new chatbot with a default v1 configuration."""
    import uuid

    tenant_id = settings.default_tenant_id
    chatbot_id = uuid.uuid4()

    chatbot = Chatbot(
        id=chatbot_id,
        tenant_id=tenant_id,
        name=body.name,
        description=body.description,
        avatar=body.avatar,
    )
    db.add(chatbot)

    # Create default v1 config
    config = ChatbotConfig(
        chatbot_id=chatbot_id,
        version=1,
    )
    db.add(config)

    await db.flush()
    return {
        "id": str(chatbot.id),
        "name": chatbot.name,
        "description": chatbot.description,
        "avatar": chatbot.avatar,
        "status": chatbot.status,
        "active_config_version": chatbot.active_config_version,
    }


@router.get("/{chatbot_id}")
async def get_chatbot(chatbot_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a single chatbot by ID."""
    result = await db.execute(select(Chatbot).where(Chatbot.id == chatbot_id))
    chatbot = result.scalar_one_or_none()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    return {
        "id": str(chatbot.id),
        "name": chatbot.name,
        "description": chatbot.description,
        "avatar": chatbot.avatar,
        "status": chatbot.status,
        "active_config_version": chatbot.active_config_version,
        "created_at": chatbot.created_at.isoformat(),
        "updated_at": chatbot.updated_at.isoformat(),
    }


@router.patch("/{chatbot_id}")
async def update_chatbot(chatbot_id: UUID, body: ChatbotUpdate, db: AsyncSession = Depends(get_db)):
    """Update chatbot metadata."""
    result = await db.execute(select(Chatbot).where(Chatbot.id == chatbot_id))
    chatbot = result.scalar_one_or_none()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    if body.name is not None:
        chatbot.name = body.name
    if body.description is not None:
        chatbot.description = body.description
    if body.avatar is not None:
        chatbot.avatar = body.avatar
    if body.status is not None:
        chatbot.status = body.status

    await db.flush()
    return {"id": str(chatbot.id), "name": chatbot.name, "status": chatbot.status}


@router.delete("/{chatbot_id}", status_code=204)
async def delete_chatbot(chatbot_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete a chatbot and all its configurations, conversations, etc."""
    result = await db.execute(select(Chatbot).where(Chatbot.id == chatbot_id))
    chatbot = result.scalar_one_or_none()
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    await db.delete(chatbot)
