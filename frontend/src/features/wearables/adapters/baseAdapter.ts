import type {
  MockSyncType,
  WearableConnectionStatus,
  WearableDataRecord,
  WearableMetricType,
  WearableProviderConnection,
  WearableProviderId,
} from '../types';

/** Future-ready provider adapter contract — no OAuth/SDK in Phase 4A. */
export interface WearableProviderAdapter {
  readonly id: WearableProviderId;
  readonly labelKey: string;
  isAvailable(): boolean;
  connect(athleteId: string): Promise<{
    status: WearableConnectionStatus;
    permissions: WearableMetricType[];
  }>;
  disconnect(athleteId: string): Promise<void>;
  mockSync(athleteId: string, syncType: MockSyncType, dateKey: string): Promise<WearableDataRecord>;
}

export interface WearableAdapterContext {
  athleteId: string;
  providerId: WearableProviderId;
  connection?: WearableProviderConnection;
}
