/**
 * Retry policy for transient Firestore persistence errors.
 */

import { ScientificPersistenceError } from '../adapters/errors';

const TRANSIENT_ERROR_CODES = new Set([
  'unavailable',
  'deadline-exceeded',
  'resource-exhausted',
  'aborted',
  'internal',
  'firestore_unavailable',
  'transient_firestore_error',
]);

const PERMANENT_ERROR_PREFIXES = [
  'validation_failed',
  'persistence_duplicate',
  'persistence_not_found',
];

export function isTransientPersistenceError(error: unknown): boolean {
  if (error instanceof ScientificPersistenceError) {
    if (PERMANENT_ERROR_PREFIXES.some((prefix) => error.code.startsWith(prefix))) {
      return false;
    }
    return TRANSIENT_ERROR_CODES.has(error.code) || error.code.includes('transient');
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('unavailable') ||
      message.includes('deadline') ||
      message.includes('network') ||
      message.includes('aborted')
    );
  }
  return false;
}

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
}

export async function withPersistenceRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<{ result: T; retryCount: number }> {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 100;
  let retryCount = 0;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await operation();
      return { result, retryCount };
    } catch (error) {
      if (!isTransientPersistenceError(error) || attempt === maxAttempts) {
        throw error;
      }
      retryCount += 1;
      await sleep(baseDelayMs * attempt);
    }
  }

  throw new ScientificPersistenceError('transient_firestore_error', 'retry_exhausted');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
