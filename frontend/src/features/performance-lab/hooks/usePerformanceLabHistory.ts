/**
 * Merged Performance Lab history — scientific sessions preferred, legacy fallback.
 * Phase 8.3 — TTL cache + single-flight deduplication.
 */

import { useEffect, useState } from 'react';

import type { MockPerformanceTest } from '@/src/data/mock/types';
import { useMockStore } from '@/src/data/mock/store';
import { useDirection } from '@/src/providers/DirectionProvider';

import { loadCachedPerformanceLabHistory } from '../cache/performanceLabHistoryCache';

export interface UsePerformanceLabHistoryState {
  loading: boolean;
  readErrorKey: string | null;
  tests: MockPerformanceTest[];
}

export function usePerformanceLabHistory(): UsePerformanceLabHistoryState {
  const mockTests = useMockStore((state) => state.tests);
  const athletes = useMockStore((state) => state.athletes);
  const { isRTL } = useDirection();
  const [tests, setTests] = useState<MockPerformanceTest[]>(mockTests);
  const [loading, setLoading] = useState(true);
  const [readErrorKey, setReadErrorKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setReadErrorKey(null);

    loadCachedPerformanceLabHistory(mockTests, athletes, isRTL)
      .then((merged) => {
        if (!cancelled) {
          setTests(merged);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReadErrorKey('testingCenter.bridge.readFailed');
          setTests([...mockTests].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mockTests, athletes, isRTL]);

  return {
    loading,
    readErrorKey,
    tests,
  };
}
