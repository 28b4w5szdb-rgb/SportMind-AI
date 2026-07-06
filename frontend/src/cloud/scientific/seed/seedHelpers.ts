/**
 * Shared metadata helpers for static catalog seed documents.
 */

import type { CloudDocumentMeta, VersionMeta } from '../models/common';

export const CATALOG_SEED_EPOCH = '2026-07-07T00:00:00.000Z';

export function seedDocumentMeta(id: string): Pick<CloudDocumentMeta, 'id' | 'created_at' | 'updated_at'> {
  return {
    id,
    created_at: CATALOG_SEED_EPOCH,
    updated_at: CATALOG_SEED_EPOCH,
  };
}

export function seedVersionMeta(version = '1.0.0', versionNumber = 1): VersionMeta {
  return {
    version,
    version_number: versionNumber,
    status: 'active',
    effective_from: CATALOG_SEED_EPOCH,
    superseded_by: null,
  };
}

export function bilingual(en: string, ar: string) {
  return { en, ar };
}
