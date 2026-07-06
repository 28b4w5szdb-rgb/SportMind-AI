import type { FirebaseError } from 'firebase/app';

import { ProfileError } from './profileErrors';

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

const FIRESTORE_ERROR_MAP: Record<string, string> = {
  'permission-denied': 'auth.errors.permissionDenied',
  unavailable: 'auth.errors.networkFailure',
  'already-exists': 'auth.errors.profileDuplicate',
  'failed-precondition': 'auth.errors.profileCreateFailed',
  aborted: 'auth.errors.profileCreateFailed',
};

/** Maps Firebase Auth errors to i18n keys under `auth.errors.*`. */
export function getFirebaseAuthErrorKey(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'auth.errors.generic';
  }

  const fbError = error as FirebaseError;
  const code = fbError.code?.replace(/^firebase\//, '');

  if (code && FIREBASE_AUTH_ERROR_MAP[code]) {
    return FIREBASE_AUTH_ERROR_MAP[code];
  }

  const message = fbError.message?.toLowerCase() ?? '';

  if (message.includes('network')) return 'auth.errors.networkFailure';
  if (message.includes('password')) return 'auth.errors.weakPassword';
  if (message.includes('too many')) return 'auth.errors.rateLimited';

  return 'auth.errors.generic';
}

/** Maps Firestore profile errors to i18n keys under `auth.errors.*`. */
export function getFirestoreProfileErrorKey(error: unknown): string {
  if (error instanceof Error && error.message.startsWith('auth.errors.')) {
    return error.message;
  }

  if (!error || typeof error !== 'object') {
    return 'auth.errors.profileCreateFailed';
  }

  const fbError = error as FirebaseError;
  const code = fbError.code?.replace(/^firebase\//, '');

  if (code && FIRESTORE_ERROR_MAP[code]) {
    return FIRESTORE_ERROR_MAP[code];
  }

  const message = fbError.message?.toLowerCase() ?? '';
  if (message.includes('network') || message.includes('offline')) {
    return 'auth.errors.networkFailure';
  }
  if (message.includes('permission')) {
    return 'auth.errors.permissionDenied';
  }

  return 'auth.errors.profileCreateFailed';
}

/** Unified cloud auth error resolver for Firebase Auth + Firestore profile flows. */
export function getCloudAuthErrorKey(error: unknown): string {
  if (error instanceof ProfileError) {
    return error.errorKey;
  }

  if (error instanceof Error && error.message.startsWith('auth.errors.')) {
    return error.message;
  }

  const authKey = getFirebaseAuthErrorKey(error);
  if (authKey !== 'auth.errors.generic') return authKey;

  return getFirestoreProfileErrorKey(error);
}
