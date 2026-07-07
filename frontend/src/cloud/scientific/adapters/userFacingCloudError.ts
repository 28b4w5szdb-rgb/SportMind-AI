/**
 * User-facing cloud error messages (Phase 8.1).
 */

import type { TFunction } from 'i18next';

import { ScientificCloudError, type ScientificCloudErrorCode } from './errors';

const MESSAGE_KEYS: Record<ScientificCloudErrorCode, string> = {
  firestore_unavailable: 'scientificCloud.errors.firestoreUnavailable',
  read_failed: 'scientificCloud.errors.readFailed',
  write_failed: 'scientificCloud.errors.writeFailed',
  permission_denied: 'scientificCloud.errors.permissionDenied',
  report_oversized: 'scientificCloud.errors.reportOversized',
  report_size_warning: 'scientificCloud.errors.reportSizeWarning',
  duplicate_document: 'scientificCloud.errors.duplicateDocument',
};

export function resolveUserFacingCloudError(error: unknown, t: TFunction): string {
  if (error instanceof ScientificCloudError) {
    const key = MESSAGE_KEYS[error.code] ?? 'scientificCloud.errors.generic';
    return t(key);
  }
  return t('scientificCloud.errors.generic');
}

export function resolveCloudErrorReasonCode(error: unknown): string {
  if (error instanceof ScientificCloudError) return error.code;
  return 'unknown';
}
