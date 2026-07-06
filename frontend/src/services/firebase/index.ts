/**
 * SportMind AI - Firebase Service (legacy re-export)
 * Prefer importing from `@/src/cloud/firebase`.
 */

export {
  getFirebaseApp,
  getFirebaseAuth,
  getCloudFirestore as getFirestore,
  getCloudStorage as getStorage,
  getCloudMessaging,
  isFirebaseConfigured,
  isFirebaseAppReady,
  messagingStatus,
} from '@/src/cloud/firebase';

import { getFirebaseAuth } from '@/src/cloud/firebase';
import { getCloudFirestore } from '@/src/cloud/firebase';
import { getCloudStorage } from '@/src/cloud/firebase';

/** @deprecated Use getFirebaseAuth() */
export const auth = getFirebaseAuth();

/** @deprecated Use getCloudFirestore() */
export const db = getCloudFirestore();

/** @deprecated Use getCloudStorage() */
export const storage = getCloudStorage();

export default {
  auth,
  db,
  storage,
};
