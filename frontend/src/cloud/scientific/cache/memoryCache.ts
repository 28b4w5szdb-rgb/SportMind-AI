/**
 * Lightweight in-memory cache — no persistence.
 */

interface CacheEntry<T> {
  value: T;
}

export class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    return entry?.value as T | undefined;
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, { value });
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

let catalogCache: MemoryCache | undefined;

export function getCatalogMemoryCache(): MemoryCache {
  if (!catalogCache) catalogCache = new MemoryCache();
  return catalogCache;
}

export function resetCatalogMemoryCache(): void {
  catalogCache?.clear();
  catalogCache = undefined;
}
