import type { FirebaseError } from 'firebase/app';

const FIREBASE_AUTH_ERROR_MAP: Record<string, string> = {
  'auth/invalid-credential': 'auth.errors.invalidCredentials',
  'auth/wrong-password': 'auth.errors.invalidCredentials',
  'auth/invalid-email': 'auth.errors.emailInvalid',
  'auth/user-not-found': 'auth.errors.userNotFound',
  'auth/email-already-in-use': 'auth.errors.userAlreadyExists',
  'auth/weak-password': 'auth.errors.weakPassword',
  'auth/too-many-requests': 'auth.errors.rateLimited',
  'auth/user-disabled': 'auth.errors.accountDisabled',
  'auth/network-request-failed': 'auth.errors.networkFailure',
  'auth/operation-not-allowed': 'auth.errors.generic',
};

/** Maps Firebase Auth errors to i18n keys under `auth.errors.*`. */
export function getFirebaseAuthErrorKey(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'auth.errors.generic';
  }

  const fbError = error as FirebaseError;
  const code = fbError.code;

  if (code && FIREBASE_AUTH_ERROR_MAP[code]) {
    return FIREBASE_AUTH_ERROR_MAP[code];
  }

  const message = fbError.message?.toLowerCase() ?? '';

  if (message.includes('network')) return 'auth.errors.networkFailure';
  if (message.includes('password')) return 'auth.errors.weakPassword';
  if (message.includes('too many')) return 'auth.errors.rateLimited';

  return 'auth.errors.generic';
}
