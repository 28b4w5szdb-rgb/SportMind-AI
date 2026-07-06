/**
 * Offline ↔ cloud sync engine placeholder (Phase 6B+).
 * Mock store remains source of truth while USE_CLOUD_DATA=false.
 */

import { getDataMode, isCloudDataEnabled } from '@/src/core/config/cloud';
import { isFirebaseConfigured } from '@/src/cloud/firebase';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

export interface SyncEngineState {
  status: SyncStatus;
  lastSyncedAt: string | null;
  pendingChanges: number;
}

export const syncEngine = {
  getState(): SyncEngineState {
    return {
      status: 'idle',
      lastSyncedAt: null,
      pendingChanges: 0,
    };
  },

  getDataMode,
  isCloudDataEnabled,
  isFirebaseConfigured,

  /** No-op until cloud repositories are wired. */
  async pushPendingChanges(): Promise<void> {
    if (!isCloudDataEnabled()) return;
    throw new Error('Cloud sync not implemented — enable in Phase 6B.');
  },

  /** No-op until cloud repositories are wired. */
  async pullRemoteChanges(): Promise<void> {
    if (!isCloudDataEnabled()) return;
    throw new Error('Cloud sync not implemented — enable in Phase 6B.');
  },
};
