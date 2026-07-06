/** Read-only cloud layer — writes deferred to future phases. */

export class ScientificReadOnlyError extends Error {
  constructor(operation: string) {
    super(`scientific_read_only:${operation}`);
    this.name = 'ScientificReadOnlyError';
  }
}
