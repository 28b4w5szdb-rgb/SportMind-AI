import { useMemo } from 'react';

import type { MockAthlete } from '@/src/data/mock/types';
import { useMockStore } from '@/src/data/mock/store';
import { todayDateKey } from '@/src/features/daily-checkin/validation';

import { buildWearableDailySnapshot } from '../engine/wearablesEngine';
import type { WearableDailySnapshot } from '../types';

export function useWearablesSnapshot(
  athlete: MockAthlete | undefined,
  referenceDate: string = todayDateKey()
): WearableDailySnapshot | null {
  const connections = useMockStore((s) => s.wearableConnections);
  const records = useMockStore((s) => s.wearableRecords);

  return useMemo(() => {
    if (!athlete) return null;
    return buildWearableDailySnapshot(athlete.id, referenceDate, connections, records);
  }, [athlete, connections, records, referenceDate]);
}

export function useWearablesDashboardSummary() {
  const athletes = useMockStore((s) => s.athletes);
  const connections = useMockStore((s) => s.wearableConnections);
  const records = useMockStore((s) => s.wearableRecords);
  const dateKey = todayDateKey();

  return useMemo(() => {
    let connectedAthletes = 0;
    let syncedToday = 0;
    let avgHrv = 0;
    let hrvCount = 0;
    let avgSleep = 0;
    let sleepCount = 0;

    for (const athlete of athletes) {
      const snapshot = buildWearableDailySnapshot(athlete.id, dateKey, connections, records);
      if (snapshot.connections.length > 0) connectedAthletes += 1;
      if (snapshot.lastSyncAt?.startsWith(dateKey) || snapshot.hrv || snapshot.sleepDurationHours) syncedToday += 1;
      if (snapshot.hrv !== undefined) {
        avgHrv += snapshot.hrv;
        hrvCount += 1;
      }
      if (snapshot.sleepDurationHours !== undefined) {
        avgSleep += snapshot.sleepDurationHours;
        sleepCount += 1;
      }
    }

    return {
      connectedAthletes,
      syncedToday,
      avgHrv: hrvCount > 0 ? Math.round(avgHrv / hrvCount) : 0,
      avgSleep: sleepCount > 0 ? Math.round((avgSleep / sleepCount) * 10) / 10 : 0,
      totalAthletes: athletes.length,
    };
  }, [athletes, connections, records, dateKey]);
}
