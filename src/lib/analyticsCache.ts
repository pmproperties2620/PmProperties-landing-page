// Shared in-memory cache for admin analytics
interface CachedAnalytics<T = unknown> {
  data: T;
  timestamp: number;
}

let cache: CachedAnalytics<unknown> | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function getCachedAnalytics<T = unknown>(): T | null {
  if (!cache) return null;
  if (Date.now() - cache.timestamp > CACHE_TTL_MS) {
    cache = null;
    return null;
  }
  return cache.data as T;
}

export function setCachedAnalytics<T = unknown>(data: T): void {
  cache = {
    data,
    timestamp: Date.now(),
  };
}

export function invalidateAnalyticsCache(): void {
  cache = null;
}
