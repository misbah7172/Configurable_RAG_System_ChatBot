"""MinIO S3-compatible object storage client."""

from minio import Minio
from minio.error import S3Error

from app.config import settings

# Singleton
_client: Minio | None = None


def get_minio_client() -> Minio:
    """Return the MinIO client singleton."""
    global _client
    if _client is None:
        _client = Minio(
            endpoint=settings.minio_endpoint,
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=settings.minio_secure,
        )
    return _client


async def ensure_bucket_exists():
    """Create the default bucket if it doesn't exist."""
    client = get_minio_client()
    try:
        if not client.bucket_exists(settings.minio_bucket):
            client.make_bucket(settings.minio_bucket)
    except S3Error as e:
        # Bucket might already exist in a race condition
        if "BucketAlreadyOwnedByYou" not in str(e):
            raise


async def check_minio_connection() -> bool:
    """Health check: verify MinIO is reachable."""
    try:
        client = get_minio_client()
        client.list_buckets()
        return True
    except Exception:
        return False
