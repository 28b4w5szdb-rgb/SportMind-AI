import type {
  WearableDailySnapshot,
  WearableDataRecord,
  WearableProviderConnection,
  WearableSleepStages,
} from '../types';

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function parseSleepStages(raw?: number | string): WearableSleepStages | undefined {
  if (typeof raw !== 'string') return undefined;
  try {
    const parsed = JSON.parse(raw) as WearableSleepStages;
    if (typeof parsed.deep === 'number') return parsed;
  } catch {
    return undefined;
  }
  return undefined;
}

function mergeRecordMetrics(records: WearableDataRecord[]) {
  const merged: WearableDataRecord['metrics'] = {};
  for (const record of records) {
    Object.assign(merged, record.metrics);
  }
  return merged;
}

export function buildWearableDailySnapshot(
  athleteId: string,
  dateKey: string,
  connections: WearableProviderConnection[],
  records: WearableDataRecord[]
): WearableDailySnapshot {
  const athleteConnections = connections.filter((c) => c.athlete_id === athleteId && c.status !== 'not_connected');
  const dayRecords = records.filter((r) => r.athlete_id === athleteId && r.date === dateKey);
  const metrics = mergeRecordMetrics(dayRecords);

  const sleepDurationHours = typeof metrics.sleep_duration === 'number' ? metrics.sleep_duration : undefined;
  const sleepQuality = typeof metrics.sleep_quality === 'number' ? metrics.sleep_quality : undefined;
  const hrv = typeof metrics.hrv === 'number' ? metrics.hrv : undefined;
  const restingHeartRate = typeof metrics.resting_heart_rate === 'number' ? metrics.resting_heart_rate : undefined;
  const steps = typeof metrics.steps === 'number' ? metrics.steps : undefined;
  const calories = typeof metrics.calories === 'number' ? metrics.calories : undefined;
  const trainingLoad = typeof metrics.training_load === 'number' ? metrics.training_load : undefined;
  const recoveryScore = typeof metrics.recovery_score === 'number' ? metrics.recovery_score : undefined;

  let readinessImpact = 0;
  let fatigueImpact = 0;

  if (sleepDurationHours !== undefined) {
    readinessImpact += clamp((sleepDurationHours - 7) * 4, -12, 10);
    if (sleepDurationHours < 6) fatigueImpact += 8;
  }
  if (sleepQuality !== undefined) {
    readinessImpact += (sleepQuality - 5) * 2;
    if (sleepQuality <= 4) fatigueImpact += 5;
  }
  if (hrv !== undefined) {
    readinessImpact += clamp((hrv - 45) * 0.35, -10, 10);
    if (hrv < 35) fatigueImpact += 6;
  }
  if (restingHeartRate !== undefined) {
    if (restingHeartRate > 68) {
      readinessImpact -= (restingHeartRate - 68) * 0.6;
      fatigueImpact += (restingHeartRate - 68) * 0.4;
    } else if (restingHeartRate < 55) {
      readinessImpact += 3;
    }
  }
  if (steps !== undefined && steps > 12000) {
    fatigueImpact += 4;
    readinessImpact -= 2;
  }
  if (trainingLoad !== undefined && trainingLoad > 450) {
    fatigueImpact += 6;
    readinessImpact -= 4;
  }
  if (recoveryScore !== undefined) {
    readinessImpact += clamp((recoveryScore - 55) * 0.25, -8, 8);
  }

  const lastSyncAt = athleteConnections
    .map((c) => c.last_sync_at)
    .filter(Boolean)
    .sort((a, b) => (b ?? '').localeCompare(a ?? ''))[0];

  const hydrationHint =
    steps !== undefined && steps > 10000 && calories !== undefined && calories > 2400
      ? 'high'
      : steps !== undefined && steps < 4000
        ? 'low'
        : 'normal';

  return {
    athleteId,
    date: dateKey,
    primaryProviderId: dayRecords[0]?.provider_id ?? athleteConnections[0]?.provider_id,
    connectedCount: athleteConnections.filter((c) => c.status === 'connected').length,
    mockSyncCount: athleteConnections.filter((c) => c.status === 'mock_sync').length,
    lastSyncAt,
    restingHeartRate,
    heartRateAvg: typeof metrics.heart_rate === 'number' ? metrics.heart_rate : undefined,
    hrv,
    sleepDurationHours,
    sleepQuality,
    sleepStages: parseSleepStages(metrics.sleep_stages),
    steps,
    calories,
    distanceKm: typeof metrics.distance === 'number' ? metrics.distance : undefined,
    trainingDurationMin: typeof metrics.training_duration === 'number' ? metrics.training_duration : undefined,
    trainingLoad,
    spo2: typeof metrics.spo2 === 'number' ? metrics.spo2 : undefined,
    bodyTemperature: typeof metrics.body_temperature === 'number' ? metrics.body_temperature : undefined,
    recoveryScore,
    readinessImpact: clamp(readinessImpact, -20, 20),
    fatigueImpact: clamp(fatigueImpact, -5, 20),
    hydrationHint,
    connections: athleteConnections,
  };
}

export function mergeWearableRecord(
  existing: WearableDataRecord | undefined,
  incoming: WearableDataRecord
): WearableDataRecord {
  if (!existing) return incoming;
  return {
    ...existing,
    recorded_at: incoming.recorded_at,
    metrics: { ...existing.metrics, ...incoming.metrics },
    source: incoming.source,
  };
}

export function hasWearableData(snapshot: WearableDailySnapshot): boolean {
  return (
    snapshot.restingHeartRate !== undefined ||
    snapshot.hrv !== undefined ||
    snapshot.sleepDurationHours !== undefined ||
    snapshot.steps !== undefined ||
    snapshot.calories !== undefined ||
    snapshot.trainingLoad !== undefined
  );
}
