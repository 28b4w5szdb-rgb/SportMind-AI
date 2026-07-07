/**
 * Firestore scientific report adapter stub (Phase 7.1).
 *
 * ReportRepository interface exists but has no implementation yet.
 * Safe fallback to mock store when cloud write is unavailable.
 */

import type { ScientificReport } from '@/src/cloud/scientific/models/report';

export type FirestorePersistResult =
  | { ok: true; reportId: string }
  | { ok: false; reason: 'repository_unavailable' | 'cloud_disabled' | 'write_failed' };

/** Attempt cloud persistence — returns unavailable until ReportRepository is implemented. */
export async function tryPersistScientificReportToFirestore(
  _report: ScientificReport
): Promise<FirestorePersistResult> {
  // ReportRepository.create is not wired — defer to mock store
  return { ok: false, reason: 'repository_unavailable' };
}

/** Attempt cloud load — not available yet. */
export async function tryLoadScientificReportFromFirestore(
  _reportId: string
): Promise<ScientificReport | null> {
  return null;
}
