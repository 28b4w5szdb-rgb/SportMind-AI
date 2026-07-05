import { useMemo } from 'react';

import { useMockStore } from '@/src/data/mock/store';
import {
  TEST_REGISTRY,
  getTestDefinition as getBaseTestDefinition,
  getMergedRegistry,
} from '../registry/tests';
import type { CustomTestInput, TestDefinition, TestLibraryFilters } from '../types';
import { matchesLibraryQuery } from '../utils/copyHelpers';

export function useCustomTestDefinitions(): TestDefinition[] {
  return useMockStore((s) => s.customTestDefinitions);
}

export function useTestDefinition(key: string | undefined): TestDefinition | undefined {
  const custom = useCustomTestDefinitions();
  return useMemo(() => {
    if (!key) return undefined;
    return getBaseTestDefinition(key, custom);
  }, [key, custom]);
}

export function useTestLibrary(filters: TestLibraryFilters) {
  const custom = useCustomTestDefinitions();
  const favorites = useMockStore((s) => s.favoriteTestKeys);
  const recent = useMockStore((s) => s.recentTestKeys);

  return useMemo(() => {
    const all = getMergedRegistry(custom);
    const isRTL = false; // filtering uses both languages via matchesLibraryQuery

    let items = all.filter((def) => {
      if (filters.categoryId !== 'all' && def.categoryId !== filters.categoryId) return false;
      if (filters.objective !== 'all' && def.objective !== filters.objective) return false;
      if (filters.favoritesOnly && !favorites.includes(def.key)) return false;
      if (!matchesLibraryQuery(def, filters.query, isRTL)) return false;
      return true;
    });

    const favoriteItems = all.filter((d) => favorites.includes(d.key));
    const recentItems = recent
      .map((key) => all.find((d) => d.key === key))
      .filter(Boolean) as TestDefinition[];

    return { items, favoriteItems, recentItems, totalCount: all.length };
  }, [custom, favorites, recent, filters]);
}

export function useTestLibraryActions() {
  const toggleFavorite = useMockStore((s) => s.toggleFavoriteTest);
  const pushRecent = useMockStore((s) => s.pushRecentTest);
  const addCustomTest = useMockStore((s) => s.addCustomTestDefinition);
  return { toggleFavorite, pushRecent, addCustomTest };
}

export type { CustomTestInput };
