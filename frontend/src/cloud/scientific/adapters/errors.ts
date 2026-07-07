/**
 * Scientific persistence errors.
 */

export class ScientificPersistenceError extends Error {
  constructor(
    public readonly code: string,
    message?: string
  ) {
    super(message ?? code);
    this.name = 'ScientificPersistenceError';
  }
}

/** @deprecated use ScientificPersistenceError */
export class ScientificReadOnlyError extends Error {
  constructor(operation: string) {
    super(`scientific_read_only:${operation}`);
    this.name = 'ScientificReadOnlyError';
  }
}
