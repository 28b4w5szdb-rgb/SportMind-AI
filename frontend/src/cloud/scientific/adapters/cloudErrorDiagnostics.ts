/**
 * Developer diagnostics for scientific cloud errors (Phase 8.1).
 */

import { ScientificCloudError } from './errors';

const PREFIX = '[SportMind Scientific Cloud]';

export function logScientificCloudError(error: unknown, context?: string): void {
  if (__DEV__) {
    if (error instanceof ScientificCloudError) {
      console.warn(`${PREFIX}${context ? ` ${context}:` : ''}`, error.code, error.message, error.diagnostic ?? '');
      return;
    }
    console.warn(`${PREFIX}${context ? ` ${context}:` : ''}`, error);
  }
}

export function wrapFirestoreError(operation: string, cause: unknown): ScientificCloudError {
  const diagnostic =
    cause instanceof Error ? `${operation}: ${cause.message}` : `${operation}: ${String(cause)}`;
  return new ScientificCloudError('read_failed', `Cloud read failed during ${operation}`, diagnostic);
}
