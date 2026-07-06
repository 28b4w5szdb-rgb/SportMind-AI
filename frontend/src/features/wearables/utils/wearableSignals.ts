import type { AnalyticsRawSignals } from '@/src/analytics/types';

import { buildWearableDailySnapshot, hasWearableData } from '../engine/wearablesEngine';
import type { WearableDataRecord, WearableProviderConnection } from '../types';

function clamp(n: number, min = -15, max = 15): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function buildWearableSignals(params: {
  athleteId: string;
  dateKey: string;
  connections: WearableProviderConnection[];
  records: WearableDataRecord[];
}): NonNullable<AnalyticsRawSignals['wearables']> {
  const snapshot = buildWearableDailySnapshot(params.athleteId, params.dateKey, params.connections, params.records);
  const active = hasWearableData(snapshot);

  return {
    hasData: active,
    recoveryScore: snapshot.recoveryScore,
    hrv: snapshot.hrv,
    restingHeartRate: snapshot.restingHeartRate,
    sleepDurationHours: snapshot.sleepDurationHours,
    sleepQuality: snapshot.sleepQuality,
    steps: snapshot.steps,
    calories: snapshot.calories,
    trainingLoad: snapshot.trainingLoad,
    readinessAdjustment: active ? clamp(snapshot.readinessImpact) : 0,
    fatigueAdjustment: active ? clamp(snapshot.fatigueImpact, -5, 15) : 0,
    hydrationAdjustment: snapshot.hydrationHint === 'high' ? 4 : snapshot.hydrationHint === 'low' ? -3 : 0,
    connectedProviders: snapshot.connections.length,
    lastSyncAt: snapshot.lastSyncAt,
  };
}
