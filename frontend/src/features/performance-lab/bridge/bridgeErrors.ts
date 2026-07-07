/**
 * Friendly Performance Lab bridge errors — no Firebase IDs or stack traces.
 */

import { ScientificPersistenceError } from '@/src/cloud/scientific/adapters/errors';

const VALIDATION_PREFIXES = [
  'validation_failed',
  'session_metadata_invalid',
  'assessment_definition_not_found',
  'invalid_source_type',
  'protocol_version_not_found',
];

export function isScientificValidationError(error: unknown): boolean {
  if (error instanceof ScientificPersistenceError) {
    return VALIDATION_PREFIXES.some((prefix) => error.code.startsWith(prefix));
  }
  if (error instanceof Error) {
    return VALIDATION_PREFIXES.some((prefix) => error.message.startsWith(prefix));
  }
  return false;
}

export function toFriendlyBridgeError(error: unknown): string {
  if (isScientificValidationError(error)) {
    return 'testingCenter.bridge.validation';
  }
  if (error instanceof ScientificPersistenceError) {
    if (error.code.startsWith('persistence_duplicate')) {
      return 'testingCenter.bridge.duplicate';
    }
    return 'testingCenter.bridge.saveFailed';
  }
  if (error instanceof Error) {
    if (error.message.includes('assessment_definition_not_found')) {
      return 'testingCenter.bridge.unsupportedTest';
    }
  }
  return 'testingCenter.bridge.saveFailed';
}
