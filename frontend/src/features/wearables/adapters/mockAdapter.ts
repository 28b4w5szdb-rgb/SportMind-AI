import { getProviderById } from '../registry/providerRegistry';
import type { MockSyncType, WearableDataRecord, WearableProviderId } from '../types';
import type { WearableProviderAdapter } from './baseAdapter';

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function seeded(base: number, spread: number): number {
  return Math.round((base + Math.random() * spread) * 10) / 10;
}

function buildMockMetrics(providerId: WearableProviderId, syncType: MockSyncType): WearableDataRecord['metrics'] {
  switch (syncType) {
    case 'sleep':
      return {
        sleep_duration: seeded(6.2, 2.2),
        sleep_quality: Math.round(seeded(5.5, 3.5)),
        sleep_stages: JSON.stringify({ deep: 1.2, rem: 1.8, light: 3.1, awake: 0.4 }),
        recovery_score: Math.round(seeded(58, 28)),
      };
    case 'hr_hrv':
      return {
        resting_heart_rate: Math.round(seeded(58, 12)),
        heart_rate: Math.round(seeded(72, 18)),
        hrv: Math.round(seeded(48, 32)),
        spo2: seeded(96, 3),
        body_temperature: seeded(36.4, 0.6),
      };
    case 'activity':
      return {
        distance: seeded(4.5, 8),
        gps_summary: `${seeded(4.5, 8)} km · ${Math.round(seeded(35, 40))} min`,
        training_duration: Math.round(seeded(45, 75)),
        heart_rate: Math.round(seeded(128, 35)),
      };
    case 'calories':
      return {
        calories: Math.round(seeded(1800, 900)),
      };
    case 'steps':
      return {
        steps: Math.round(seeded(6500, 7000)),
        distance: seeded(4.2, 5.5),
      };
    case 'training_load':
      return {
        training_load: Math.round(seeded(280, 220)),
        training_duration: Math.round(seeded(55, 65)),
        heart_rate: Math.round(seeded(142, 28)),
        recovery_score: Math.round(seeded(62, 25)),
      };
    default:
      return {};
  }
}

export function generateMockSyncRecord(
  athleteId: string,
  providerId: WearableProviderId,
  syncType: MockSyncType,
  dateKey: string
): WearableDataRecord {
  return {
    id: uid('wear'),
    athlete_id: athleteId,
    provider_id: providerId,
    date: dateKey,
    recorded_at: new Date().toISOString(),
    metrics: buildMockMetrics(providerId, syncType),
    source: 'mock_sync',
  };
}

export function createMockAdapter(providerId: WearableProviderId): WearableProviderAdapter {
  const provider = getProviderById(providerId);
  return {
    id: providerId,
    labelKey: provider.labelKey,
    isAvailable: () => true,
    async connect(athleteId) {
      void athleteId;
      return {
        status: 'mock_sync',
        permissions: provider.defaultPermissions,
      };
    },
    async disconnect(athleteId) {
      void athleteId;
    },
    async mockSync(athleteId, syncType, dateKey) {
      return generateMockSyncRecord(athleteId, providerId, syncType, dateKey);
    },
  };
}
