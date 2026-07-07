/**
 * Athlete comparison using merged scientific sessions + legacy fallback.
 */

import { useMemo, useState } from 'react';

import type { MockPerformanceTest } from '@/src/data/mock/types';
import { useMockStore } from '@/src/data/mock/store';

import { mapNormativeBandToPerformanceLevel } from './bridgeMappers';
import { usePerformanceLabHistory } from './usePerformanceLabHistory';

export interface PerformanceLabCompareRow {
  key: string;
  label: string;
  a: MockPerformanceTest | undefined;
  b: MockPerformanceTest | undefined;
  normativeBandA?: string | null;
  normativeBandB?: string | null;
  ssidSummaryA?: string | null;
  ssidSummaryB?: string | null;
}

function ssidLevelLabel(test: MockPerformanceTest | undefined): string | null {
  if (!test?.ssid?.performanceLevel) return null;
  return test.ssid.performanceLevel;
}

function normativeFromTest(test: MockPerformanceTest | undefined): string | null {
  if (!test?.ssid?.performanceLevel) return null;
  return mapNormativeBandToPerformanceLevel(test.ssid.performanceLevel);
}

export function usePerformanceLabCompare() {
  const athletes = useMockStore((state) => state.athletes);
  const { tests, loading, readErrorKey } = usePerformanceLabHistory();
  const [aId, setAId] = useState(athletes[0]?.id ?? '');
  const [bId, setBId] = useState(athletes[1]?.id ?? athletes[0]?.id ?? '');

  const comparison = useMemo((): PerformanceLabCompareRow[] => {
    const aTests = tests.filter((test) => test.athlete_id === aId);
    const bTests = tests.filter((test) => test.athlete_id === bId);
    const keys = [...new Set([...aTests, ...bTests].map((test) => test.test_type_key))];

    return keys.map((key) => {
      const at = aTests.find((test) => test.test_type_key === key);
      const bt = bTests.find((test) => test.test_type_key === key);
      return {
        key,
        label: at?.test_type ?? bt?.test_type ?? key,
        a: at,
        b: bt,
        normativeBandA: normativeFromTest(at),
        normativeBandB: normativeFromTest(bt),
        ssidSummaryA: ssidLevelLabel(at),
        ssidSummaryB: ssidLevelLabel(bt),
      };
    });
  }, [aId, bId, tests]);

  const athleteA = athletes.find((athlete) => athlete.id === aId);
  const athleteB = athletes.find((athlete) => athlete.id === bId);

  return {
    athletes,
    aId,
    bId,
    setAId,
    setBId,
    athleteA,
    athleteB,
    comparison,
    loading,
    readErrorKey,
  };
}
