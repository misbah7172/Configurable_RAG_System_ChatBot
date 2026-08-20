"""001 - Initial schema: tenants, users, chatbots, knowledge bases, documents, conversations, evaluation

Revision ID: 001_initial_schema
Revises: None
Create Date: 2026-08-20
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Tenants ──
    op.create_table(
        "tenants",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(100), unique=True, nullable=False),
        sa.Column("is_active", sa.Boolean(), default=True, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # ── Users ──
    op.create_table(
        "users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", UUID(as_uuid=True), sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("display_name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), default="admin", nullable=False),
        sa.Column("is_active", sa.Boolean(), default=True, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("tenant_id", "email", name="uq_user_tenant_email"),
    )

    # ── Chatbots ──
    op.create_table(
        "chatbots",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", UUID(as_uuid=True), sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), default=""),
        sa.Column("avatar", sa.String(10), default="🤖"),
        sa.Column("status", sa.String(20), default="draft", nullable=False),
        sa.Column("active_config_version", sa.Integer(), default=1, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # ── Chatbot Configs (versioned) ──
    op.create_table(
        "chatbot_configs",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("chatbot_id", UUID(as_uuid=True), sa.ForeignKey("chatbots.id", ondelete="CASCADE"), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("system_prompt", sa.Text(), default="You are a helpful assistant."),
        sa.Column("llm_provider", sa.String(50), default="openai"),
        sa.Column("llm_model", sa.String(100), default="gpt-4o-mini"),
        sa.Column("temperature", sa.Float(), default=0.7),
        sa.Column("max_tokens", sa.Integer(), default=1024),
        sa.Column("top_p", sa.Float(), default=1.0),
        sa.Column("embedding_provider", sa.String(50), default="local"),
        sa.Column("embedding_model", sa.String(100), default="bge-m3"),
        sa.Column("retrieval_strategy", sa.String(20), default="hybrid"),
        sa.Column("top_k", sa.Integer(), default=10),
        sa.Column("rrf_weight", sa.Float(), default=0.5),
        sa.Column("reranking_enabled", sa.Boolean(), default=False),
        sa.Column("reranking_provider", sa.String(50), default="local"),
        sa.Column("reranking_top_n", sa.Integer(), default=5),
        sa.Column("exact_cache_enabled", sa.Boolean(), default=True),
        sa.Column("exact_cache_ttl", sa.Integer(), default=3600),
        sa.Column("semantic_cache_enabled", sa.Boolean(), default=True),
        sa.Column("semantic_cache_ttl", sa.Integer(), default=3600),
        sa.Column("semantic_cache_threshold", sa.Float(), default=0.92),
        sa.Column("embedding_cache_enabled", sa.Boolean(), default=True),
        sa.Column("embedding_cache_ttl", sa.Integer(), default=86400),
        sa.Column("memory_strategy", sa.String(30), default="short-term"),
        sa.Column("memory_window_size", sa.Integer(), default=10),
        sa.Column("knowledge_base_ids", sa.JSON(), default=list),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("chatbot_id", "version", name="uq_chatbot_config_version"),
    )

    # ── Knowledge Bases ──
    op.create_table(
        "knowledge_bases",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", UUID(as_uuid=True), sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), default=""),
        sa.Column("status", sa.String(20), default="ready", nullable=False),
        sa.Column("chunking_strategy", sa.String(30), default="recursive"),
        sa.Column("chunk_size", sa.Integer(), default=512),
        sa.Column("chunk_overlap", sa.Integer(), default=50),
        sa.Column("document_count", sa.Integer(), default=0),
        sa.Column("total_chunks", sa.Integer(), default=0),
        sa.Column("version", sa.Integer(), default=1, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # ── Documents ──
    op.create_table(
        "documents",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("knowledge_base_id", UUID(as_uuid=True), sa.ForeignKey("knowledge_bases.id", ondelete="CASCADE"), nullable=False),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(500), nullable=False),
        sa.Column("type", sa.String(20), nullable=False),
        sa.Column("size", sa.Integer(), default=0),
        sa.Column("status", sa.String(20), default="uploaded", nullable=False),
        sa.Column("object_key", sa.String(1000)),
        sa.Column("chunk_count", sa.Integer(), default=0),
        sa.Column("error_message", sa.Text()),
        sa.Column("uploaded_at", sa.DateTime(), nullable=False),
        sa.Column("processed_at", sa.DateTime()),
    )

    # ── Document Chunks ──
    op.create_table(
        "document_chunks",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("document_id", UUID(as_uuid=True), sa.ForeignKey("documents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False),
        sa.Column("knowledge_base_id", UUID(as_uuid=True), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("metadata", sa.JSON(), default=dict),
        sa.Column("token_count", sa.Integer(), default=0),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    # ── Conversations ──
    op.create_table(
        "conversations",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False),
        sa.Column("chatbot_id", UUID(as_uuid=True), sa.ForeignKey("chatbots.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(500), default="New Conversation"),
        sa.Column("message_count", sa.Integer(), default=0),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # ── Messages ──
    op.create_table(
        "messages",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("conversation_id", UUID(as_uuid=True), sa.ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False),
        sa.Column("role", sa.String(20), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("citations", sa.JSON(), default=list),
        sa.Column("metadata", sa.JSON(), default=dict),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    # ── Evaluation Datasets ──
    op.create_table(
        "evaluation_datasets",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), default=""),
        sa.Column("question_count", sa.Integer(), default=0),
        sa.Column("questions", sa.JSON(), default=list),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    # ── Evaluation Runs ──
    op.create_table(
        "evaluation_runs",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("tenant_id", UUID(as_uuid=True), nullable=False),
        sa.Column("dataset_id", UUID(as_uuid=True), sa.ForeignKey("evaluation_datasets.id"), nullable=False),
        sa.Column("chatbot_id", UUID(as_uuid=True), sa.ForeignKey("chatbots.id"), nullable=False),
        sa.Column("config_version", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(20), default="pending", nullable=False),
        sa.Column("metrics", sa.JSON(), default=dict),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("completed_at", sa.DateTime()),
    )


def downgrade() -> None:
    op.drop_table("evaluation_runs")
    op.drop_table("evaluation_datasets")
    op.drop_table("messages")
    op.drop_table("conversations")
    op.drop_table("document_chunks")
    op.drop_table("documents")
    op.drop_table("knowledge_bases")
    op.drop_table("chatbot_configs")
    op.drop_table("chatbots")
    op.drop_table("users")
    op.drop_table("tenants")
