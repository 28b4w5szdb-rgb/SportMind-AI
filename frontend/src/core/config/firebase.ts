/**
 * Firebase environment configuration (no secrets committed).
 */

export const FIREBASE_ENV_KEYS = {
  apiKey: 'EXPO_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'EXPO_PUBLIC_FIREBASE_APP_ID',
  measurementId: 'EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID',
} as const;

export type FirebaseEnvKey = (typeof FIREBASE_ENV_KEYS)[keyof typeof FIREBASE_ENV_KEYS];

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const read = (key: FirebaseEnvKey): string => process.env[key]?.trim() ?? '';

export const firebaseEnv = {
  apiKey: read(FIREBASE_ENV_KEYS.apiKey),
  authDomain: read(FIREBASE_ENV_KEYS.authDomain),
  projectId: read(FIREBASE_ENV_KEYS.projectId),
  storageBucket: read(FIREBASE_ENV_KEYS.storageBucket),
  messagingSenderId: read(FIREBASE_ENV_KEYS.messagingSenderId),
  appId: read(FIREBASE_ENV_KEYS.appId),
  measurementId: read(FIREBASE_ENV_KEYS.measurementId),
};

/** Required Firebase keys for a minimal client bootstrap. */
const REQUIRED_KEYS: (keyof FirebaseClientConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

export function isFirebaseConfigured(): boolean {
  return REQUIRED_KEYS.every((key) => Boolean(firebaseEnv[key]));
}

export function getFirebaseClientConfig(): FirebaseClientConfig | null {
  if (!isFirebaseConfigured()) return null;
  return {
    apiKey: firebaseEnv.apiKey,
    authDomain: firebaseEnv.authDomain,
    projectId: firebaseEnv.projectId,
    storageBucket: firebaseEnv.storageBucket,
    messagingSenderId: firebaseEnv.messagingSenderId,
    appId: firebaseEnv.appId,
    measurementId: firebaseEnv.measurementId || undefined,
  };
}

export const firebaseConfig = {
  env: firebaseEnv,
  envKeys: FIREBASE_ENV_KEYS,
  isConfigured: isFirebaseConfigured,
  getClientConfig: getFirebaseClientConfig,
};
