"""Knowledge Base CRUD endpoints."""

from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.domain.models import KnowledgeBase
from app.config import settings

router = APIRouter(prefix="/knowledge-bases", tags=["knowledge-bases"])


# ── Schemas ──

class KBCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    chunking_strategy: str = "recursive"
    chunk_size: int = 512
    chunk_overlap: int = 50


class KBUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    chunking_strategy: Optional[str] = None
    chunk_size: Optional[int] = None
    chunk_overlap: Optional[int] = None


# ── Endpoints ──

@router.get("")
async def list_knowledge_bases(db: AsyncSession = Depends(get_db)):
    """List all knowledge bases for the default tenant."""
    tenant_id = settings.default_tenant_id
    result = await db.execute(
        select(KnowledgeBase)
        .where(KnowledgeBase.tenant_id == tenant_id)
        .order_by(KnowledgeBase.created_at.desc())
    )
    kbs = result.scalars().all()
    return [
        {
            "id": str(kb.id),
            "name": kb.name,
            "description": kb.description,
            "status": kb.status,
            "chunking_strategy": kb.chunking_strategy,
            "chunk_size": kb.chunk_size,
            "chunk_overlap": kb.chunk_overlap,
            "document_count": kb.document_count,
            "total_chunks": kb.total_chunks,
            "version": kb.version,
            "created_at": kb.created_at.isoformat(),
            "updated_at": kb.updated_at.isoformat(),
        }
        for kb in kbs
    ]


@router.post("", status_code=201)
async def create_knowledge_base(body: KBCreate, db: AsyncSession = Depends(get_db)):
    """Create a new knowledge base."""
    import uuid

    tenant_id = settings.default_tenant_id
    kb = KnowledgeBase(
        id=uuid.uuid4(),
        tenant_id=tenant_id,
        name=body.name,
        description=body.description,
        chunking_strategy=body.chunking_strategy,
        chunk_size=body.chunk_size,
        chunk_overlap=body.chunk_overlap,
    )
    db.add(kb)
    await db.flush()
    return {
        "id": str(kb.id),
        "name": kb.name,
        "description": kb.description,
        "status": kb.status,
        "chunking_strategy": kb.chunking_strategy,
        "chunk_size": kb.chunk_size,
        "chunk_overlap": kb.chunk_overlap,
    }


@router.get("/{kb_id}")
async def get_knowledge_base(kb_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a single knowledge base."""
    result = await db.execute(select(KnowledgeBase).where(KnowledgeBase.id == kb_id))
    kb = result.scalar_one_or_none()
    if not kb:
        raise HTTPException(status_code=404, detail="Knowledge base not found")
    return {
        "id": str(kb.id),
        "name": kb.name,
        "description": kb.description,
        "status": kb.status,
        "chunking_strategy": kb.chunking_strategy,
        "chunk_size": kb.chunk_size,
        "chunk_overlap": kb.chunk_overlap,
        "document_count": kb.document_count,
        "total_chunks": kb.total_chunks,
        "version": kb.version,
        "created_at": kb.created_at.isoformat(),
        "updated_at": kb.updated_at.isoformat(),
    }


@router.patch("/{kb_id}")
async def update_knowledge_base(kb_id: UUID, body: KBUpdate, db: AsyncSession = Depends(get_db)):
    """Update knowledge base metadata or chunking configuration."""
    result = await db.execute(select(KnowledgeBase).where(KnowledgeBase.id == kb_id))
    kb = result.scalar_one_or_none()
    if not kb:
        raise HTTPException(status_code=404, detail="Knowledge base not found")

    if body.name is not None:
        kb.name = body.name
    if body.description is not None:
        kb.description = body.description
    if body.chunking_strategy is not None:
        kb.chunking_strategy = body.chunking_strategy
    if body.chunk_size is not None:
        kb.chunk_size = body.chunk_size
    if body.chunk_overlap is not None:
        kb.chunk_overlap = body.chunk_overlap

    await db.flush()
    return {"id": str(kb.id), "name": kb.name, "status": kb.status}


@router.delete("/{kb_id}", status_code=204)
async def delete_knowledge_base(kb_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete a knowledge base and all its documents and chunks."""
    result = await db.execute(select(KnowledgeBase).where(KnowledgeBase.id == kb_id))
    kb = result.scalar_one_or_none()
    if not kb:
        raise HTTPException(status_code=404, detail="Knowledge base not found")
    await db.delete(kb)
