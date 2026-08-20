"""Application configuration — reads from .env via pydantic-settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration loaded from environment variables / .env file."""

    model_config = SettingsConfigDict(
        env_file="../../.env",  # Root-level .env
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Database (NeonDB PostgreSQL) ──
    database_url: str = "postgresql+asyncpg://localhost/ragdb"
    database_url_sync: str = "postgresql://localhost/ragdb"

    # ── Qdrant ──
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_grpc_port: int = 6334

    # ── Redis ──
    redis_url: str = "redis://localhost:6379/0"

    # ── MinIO ──
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "rag-documents"
    minio_secure: bool = False

    # ── API ──
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_debug: bool = True
    secret_key: str = "change-me-in-production"

    # ── Default Tenant ──
    default_tenant_id: str = "default"
    default_tenant_name: str = "Development"

    # ── LLM Providers (optional) ──
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    google_api_key: str | None = None


# Singleton
settings = Settings()
