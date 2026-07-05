import { useMemo } from 'react';

import type { MockAthlete, MockPerformanceTest, DailyCheckIn } from '@/src/data/mock/types';
import { buildRawSignals } from '@/src/analytics/input/buildSignals';
import { useMockStore } from '@/src/data/mock/store';
import { buildSportsMedicineSnapshot } from '../utils/sportsMedicineHelpers';

export function useSportsMedicineSnapshot(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  checkIn?: DailyCheckIn
) {
  const injuryRecords = useMockStore((s) => s.injuryRecords);

  return useMemo(() => {
    if (!athlete) return null;
    const athleteInjuries = injuryRecords.filter((i) => i.athlete_id === athlete.id);
    const athleteTests = tests.filter((t) => t.athlete_id === athlete.id);
    const signals = buildRawSignals(athlete, athleteTests, checkIn);

    return buildSportsMedicineSnapshot({
      athlete,
      injuries: athleteInjuries,
      checkIn,
      signals,
    });
  }, [athlete, tests, checkIn, injuryRecords]);
}
