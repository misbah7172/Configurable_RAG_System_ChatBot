"""Qdrant vector database client singleton."""

from qdrant_client import QdrantClient
from qdrant_client.http.exceptions import UnexpectedResponse

from app.config import settings

# Singleton client
_client: QdrantClient | None = None


def get_qdrant_client() -> QdrantClient:
    """Return the Qdrant client singleton."""
    global _client
    if _client is None:
        _client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
            grpc_port=settings.qdrant_grpc_port,
            prefer_grpc=False,
        )
    return _client


async def check_qdrant_connection() -> bool:
    """Health check: verify Qdrant is reachable."""
    try:
        client = get_qdrant_client()
        # collections() is a synchronous call in the HTTP client
        client.get_collections()
        return True
    except Exception:
        return False


async def close_qdrant_client():
    """Gracefully close the Qdrant client."""
    global _client
    if _client is not None:
        _client.close()
        _client = None
