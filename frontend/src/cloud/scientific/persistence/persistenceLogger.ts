/**
 * Structured persistence logger — in-memory ring buffer, no console output.
 */

import type { PersistenceAdapterKind } from '../models/persistence';

export type PersistenceLogLevel = 'info' | 'warn' | 'error';

export interface PersistenceLogEntry {
  level: PersistenceLogLevel;
  event: string;
  transaction_id: string;
  session_id?: string;
  organization_id?: string;
  adapter: PersistenceAdapterKind;
  timestamp: string;
  detail?: Record<string, unknown>;
}

const MAX_LOG_ENTRIES = 500;
const logBuffer: PersistenceLogEntry[] = [];

export function logPersistence(
  entry: Omit<PersistenceLogEntry, 'timestamp'>
): PersistenceLogEntry {
  const record: PersistenceLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };
  logBuffer.push(record);
  if (logBuffer.length > MAX_LOG_ENTRIES) {
    logBuffer.shift();
  }
  return record;
}

export function getPersistenceLogs(limit = 100): PersistenceLogEntry[] {
  return logBuffer.slice(-limit);
}

export function clearPersistenceLogs(): void {
  logBuffer.length = 0;
}

export function resetPersistenceLogger(): void {
  clearPersistenceLogs();
}
