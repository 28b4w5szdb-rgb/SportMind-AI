/**
 * Scientific-backed test library — Assessment Definition Engine with legacy fallback.
 */

import { useEffect, useMemo, useState } from 'react';

import { useMockStore } from '@/src/data/mock/store';
import { useDirection } from '@/src/providers/DirectionProvider';

import type { TestDefinition, TestLibraryFilters } from '../types';
import { getMergedRegistry } from '../registry/tests';
import { extendLibraryFilters, filterLibraryDefinitions } from './catalogDefinitionMapper';
import { loadLibraryDefinitions } from './scientificCatalogCache';

export function useScientificTestLibrary(filters: TestLibraryFilters) {
  const custom = useMockStore((state) => state.customTestDefinitions);
  const favorites = useMockStore((state) => state.favoriteTestKeys);
  const recent = useMockStore((state) => state.recentTestKeys);
  const { isRTL } = useDirection();

  const [catalogDefinitions, setCatalogDefinitions] = useState<TestDefinition[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [readErrorKey, setReadErrorKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setReadErrorKey(null);

    loadLibraryDefinitions(custom)
      .then((definitions) => {
        if (!cancelled) setCatalogDefinitions(definitions);
      })
      .catch(() => {
        if (!cancelled) {
          setReadErrorKey('testingCenter.bridge.readFailed');
          setCatalogDefinitions(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [custom]);

  const all = catalogDefinitions ?? getMergedRegistry(custom);
  const resolvedFilters = extendLibraryFilters(filters);

  return useMemo(() => {
    const items = filterLibraryDefinitions(all, resolvedFilters, favorites, isRTL);
    const favoriteItems = all.filter((item) => favorites.includes(item.key));
    const recentItems = recent
      .map((key) => all.find((item) => item.key === key))
      .filter(Boolean) as TestDefinition[];

    return {
      items,
      favoriteItems,
      recentItems,
      totalCount: all.length,
      loading,
      readErrorKey,
    };
  }, [all, resolvedFilters, favorites, recent, isRTL, loading, readErrorKey]);
}
