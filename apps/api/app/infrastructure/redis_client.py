"""Redis async client singleton."""

import redis.asyncio as aioredis

from app.config import settings

# Singleton
_pool: aioredis.Redis | None = None


async def get_redis_client() -> aioredis.Redis:
    """Return the async Redis client singleton."""
    global _pool
    if _pool is None:
        _pool = aioredis.from_url(
            settings.redis_url,
            decode_responses=True,
            max_connections=20,
        )
    return _pool


async def check_redis_connection() -> bool:
    """Health check: verify Redis is reachable."""
    try:
        client = await get_redis_client()
        return await client.ping()
    except Exception:
        return False


async def close_redis_client():
    """Gracefully close the Redis connection pool."""
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
