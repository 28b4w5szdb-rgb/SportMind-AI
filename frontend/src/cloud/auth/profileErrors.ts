/** Typed profile errors mapped to i18n keys — never expose internal Firebase details. */

export class ProfileError extends Error {
  readonly errorKey: string;

  constructor(errorKey: string, cause?: unknown) {
    super(errorKey);
    this.name = 'ProfileError';
    this.errorKey = errorKey;
    void cause;
  }
}
