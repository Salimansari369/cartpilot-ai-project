import time
import threading
from typing import Any, Optional, Callable, Dict, Tuple

class TTLCache:
    """Thread-safe in-memory cache with time-to-live expiration."""
    def __init__(self, default_ttl_seconds: int = 3600):
        self.default_ttl = default_ttl_seconds
        self._store: Dict[str, Tuple[Any, float]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            if key not in self._store:
                return None
            val, expiry = self._store[key]
            if time.time() > expiry:
                del self._store[key]
                return None
            return val

    def set(self, key: str, val: Any, ttl_seconds: Optional[int] = None) -> None:
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        with self._lock:
            self._store[key] = (val, time.time() + ttl)

    def clear(self) -> None:
        with self._lock:
            self._store.clear()

class RateLimiter:
    """Sliding window rate limiter to respect external API usage quotas."""
    def __init__(self, max_calls_per_minute: int = 30):
        self.max_calls = max_calls_per_minute
        self.calls: list[float] = []
        self._lock = threading.Lock()

    def can_proceed(self) -> bool:
        with self._lock:
            now = time.time()
            cutoff = now - 60.0
            self.calls = [t for t in self.calls if t > cutoff]
            if len(self.calls) < self.max_calls:
                self.calls.append(now)
                return True
            return False

def retry_with_backoff(max_retries: int = 2, initial_delay: float = 0.5):
    """Decorator for retrying network operations with exponential backoff."""
    def decorator(func: Callable):
        def wrapper(*args, **kwargs):
            delay = initial_delay
            last_err = None
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_err = e
                    if attempt < max_retries:
                        time.sleep(delay)
                        delay *= 2.0
            raise last_err
        return wrapper
    return decorator

# Global singletons
api_cache = TTLCache(default_ttl_seconds=3600)
serpapi_rate_limiter = RateLimiter(max_calls_per_minute=20)
tavily_rate_limiter = RateLimiter(max_calls_per_minute=20)
