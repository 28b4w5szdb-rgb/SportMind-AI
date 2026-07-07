/**
 * Performance Lab history cache (Phase 8.3) — single-flight merged history reads.
 */

import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';

import { loadMergedPerformanceLabHistory } from '../bridge/performanceLabReadBridge';

interface HistoryCacheEntry {
  mockSignature: string;
  athleteSignature: string;
  isRTL: boolean;
  tests: MockPerformanceTest[];
  loadedAt: number;
}

let inflight: Promise<MockPerformanceTest[]> | null = null;
let lastEntry: HistoryCacheEntry | null = null;

const TTL_MS = 30_000;

function mockSignature(tests: MockPerformanceTest[]): string {
  return `${tests.length}:${tests[0]?.id ?? ''}:${tests[tests.length - 1]?.id ?? ''}`;
}

function athleteSignature(athletes: MockAthlete[]): string {
  return `${athletes.length}:${athletes.map((a) => a.id).join(',')}`;
}

function isFresh(entry: HistoryCacheEntry, mockTests: MockPerformanceTest[], athletes: MockAthlete[], isRTL: boolean): boolean {
  return (
    Date.now() - entry.loadedAt < TTL_MS &&
    entry.mockSignature === mockSignature(mockTests) &&
    entry.athleteSignature === athleteSignature(athletes) &&
    entry.isRTL === isRTL
  );
}

/** Load merged lab history with TTL cache + single-flight deduplication. */
export async function loadCachedPerformanceLabHistory(
  mockTests: MockPerformanceTest[],
  athletes: MockAthlete[],
  isRTL: boolean
): Promise<MockPerformanceTest[]> {
  if (lastEntry && isFresh(lastEntry, mockTests, athletes, isRTL)) {
    return lastEntry.tests;
  }

  if (inflight) return inflight;

  inflight = loadMergedPerformanceLabHistory(mockTests, athletes, isRTL)
    .then((tests) => {
      lastEntry = {
        mockSignature: mockSignature(mockTests),
        athleteSignature: athleteSignature(athletes),
        isRTL,
        tests,
        loadedAt: Date.now(),
      };
      return tests;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function invalidatePerformanceLabHistoryCache(): void {
  lastEntry = null;
  inflight = null;
}
