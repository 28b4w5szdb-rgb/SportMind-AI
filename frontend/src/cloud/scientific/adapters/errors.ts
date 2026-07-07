/**
 * Scientific persistence errors.
 */

export type ScientificCloudErrorCode =
  | 'firestore_unavailable'
  | 'read_failed'
  | 'write_failed'
  | 'permission_denied'
  | 'report_oversized'
  | 'report_size_warning'
  | 'duplicate_document';

export class ScientificPersistenceError extends Error {
  constructor(
    public readonly code: string,
    message?: string
  ) {
    super(message ?? code);
    this.name = 'ScientificPersistenceError';
  }
}

/** Unified scientific cloud error with developer diagnostics (Phase 8.1). */
export class ScientificCloudError extends ScientificPersistenceError {
  constructor(
    public readonly code: ScientificCloudErrorCode,
    message?: string,
    public readonly diagnostic?: string
  ) {
    super(code, message ?? code);
    this.name = 'ScientificCloudError';
  }
}

/** @deprecated use ScientificPersistenceError */
export class ScientificReadOnlyError extends Error {
  constructor(operation: string) {
    super(`scientific_read_only:${operation}`);
    this.name = 'ScientificReadOnlyError';
  }
}
