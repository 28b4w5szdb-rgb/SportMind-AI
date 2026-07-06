import type { WearableDataRecord, WearableProviderConnection } from '../types';

export interface SyncHistoryEntry {
  id: string;
  time: string;
  labelKey: string;
}

const DEFAULT_TIMELINE: SyncHistoryEntry[] = [
  { id: 't1', time: '08:30', labelKey: 'wearables.syncHistory.heartRateSynced' },
  { id: 't2', time: '08:31', labelKey: 'wearables.syncHistory.sleepUpdated' },
  { id: 't3', time: '08:32', labelKey: 'wearables.syncHistory.recoveryRecalculated' },
  { id: 't4', time: '08:33', labelKey: 'wearables.syncHistory.trainingLoadUpdated' },
];

export function buildSyncHistoryTimeline(
  athleteId: string,
  records: WearableDataRecord[],
  connections: WearableProviderConnection[]
): SyncHistoryEntry[] {
  const athleteRecords = records
    .filter((r) => r.athlete_id === athleteId)
    .sort((a, b) => b.recorded_at.localeCompare(a.recorded_at))
    .slice(0, 6);

  const hasConnection = connections.some(
    (c) => c.athlete_id === athleteId && c.status !== 'not_connected'
  );

  if (athleteRecords.length === 0 && hasConnection) {
    return DEFAULT_TIMELINE;
  }

  if (athleteRecords.length === 0) {
    return [];
  }

  return athleteRecords.map((record) => {
    const date = new Date(record.recorded_at);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const keys = Object.keys(record.metrics);
    const labelKey =
      keys.includes('hrv') || keys.includes('heart_rate')
        ? 'wearables.syncHistory.heartRateSynced'
        : keys.includes('sleep_duration')
          ? 'wearables.syncHistory.sleepUpdated'
          : keys.includes('recovery_score')
            ? 'wearables.syncHistory.recoveryRecalculated'
            : keys.includes('training_load')
              ? 'wearables.syncHistory.trainingLoadUpdated'
              : keys.includes('steps')
                ? 'wearables.syncHistory.stepsSynced'
                : 'wearables.syncHistory.dataSynced';

    return { id: record.id, time, labelKey };
  });
}
