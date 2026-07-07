/**
 * Shared list pagination options (Phase 8.3) — memory-only; cursor pagination deferred to Cloud Functions.
 */

/** Default page sizes — document in PROJECT_STATE for Firestore cost planning. */
export const DEFAULT_REPORT_LIST_LIMIT = 50;
export const DEFAULT_SESSION_LIST_LIMIT = 100;
export const DEFAULT_LAB_HISTORY_LIMIT = 100;
export const DEFAULT_TIMELINE_EVENT_CAP = 200;

export interface ScientificListPagination {
  /** Max documents to read per query. */
  limit?: number;
}
