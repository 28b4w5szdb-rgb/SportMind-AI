/**
 * Benchmark screen data — scientific session latest values with legacy norms.
 */

import { useMemo } from 'react';

import { benchmarkRating, getBenchmarkNormsFromRegistry } from '../utils/benchmark';
import { TEST_REGISTRY } from '../registry/tests';
import type { PerformanceLevel } from '../types';

import { usePerformanceLabHistory } from './usePerformanceLabHistory';

export function usePerformanceLabBenchmark() {
  const { tests, loading, readErrorKey } = usePerformanceLabHistory();
  const norms = useMemo(() => getBenchmarkNormsFromRegistry(TEST_REGISTRY), []);

  const rows = useMemo(() => {
    return norms.map((norm) => {
      const latest = tests.find((test) => test.test_type_key === norm.testKey);
      const scientificLevel = latest?.ssid?.performanceLevel ?? null;
      const rating: PerformanceLevel | null =
        scientificLevel ?? (latest ? benchmarkRating(latest.value, norm) : null);

      return {
        norm,
        latest,
        rating,
      };
    });
  }, [norms, tests]);

  return {
    rows,
    loading,
    readErrorKey,
  };
}
