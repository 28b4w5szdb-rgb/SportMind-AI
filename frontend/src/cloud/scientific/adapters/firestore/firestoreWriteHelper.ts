/**
 * Firestore write helpers — append-only create semantics.
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore';

import { getCloudFirestore } from '@/src/cloud/firebase/firestore';

import { ScientificPersistenceError } from '../errors';

export function getScientificFirestoreForWrite(): Firestore | null {
  return getCloudFirestore();
}

export async function documentExists(pathSegments: string[]): Promise<boolean> {
  const db = getScientificFirestoreForWrite();
  if (!db) return false;
  const snap = await getDoc(doc(db, ...(pathSegments as [string, ...string[]])));
  return snap.exists();
}

export async function createDocumentIfNotExists(
  pathSegments: string[],
  data: DocumentData
): Promise<void> {
  const db = getScientificFirestoreForWrite();
  if (!db) {
    throw new ScientificPersistenceError('firestore_unavailable');
  }

  const ref = doc(db, ...(pathSegments as [string, ...string[]]));
  const existing = await getDoc(ref);
  if (existing.exists()) {
    throw new ScientificPersistenceError(`persistence_duplicate:${pathSegments.join('/')}`);
  }

  await setDoc(ref, data);
}

export async function updateDocumentFields(
  pathSegments: string[],
  patch: DocumentData
): Promise<void> {
  const db = getScientificFirestoreForWrite();
  if (!db) {
    throw new ScientificPersistenceError('firestore_unavailable');
  }

  const { updateDoc } = await import('firebase/firestore');
  const ref = doc(db, ...(pathSegments as [string, ...string[]]));
  await updateDoc(ref, { ...patch, updated_at: new Date().toISOString() });
}

export async function setDocument(
  pathSegments: string[],
  data: DocumentData,
  options?: { merge?: boolean }
): Promise<void> {
  const db = getScientificFirestoreForWrite();
  if (!db) {
    throw new ScientificPersistenceError('firestore_unavailable');
  }

  const ref = doc(db, ...(pathSegments as [string, ...string[]]));
  await setDoc(ref, data, { merge: options?.merge ?? false });
}

export async function createSubcollectionDocumentsIfNotExists(
  parentPathSegments: string[],
  subcollectionId: string,
  documents: Array<{ id: string; data: DocumentData }>
): Promise<void> {
  const db = getScientificFirestoreForWrite();
  if (!db) {
    throw new ScientificPersistenceError('firestore_unavailable');
  }

  for (const item of documents) {
    const segments = [...parentPathSegments, subcollectionId, item.id];
    await createDocumentIfNotExists(segments, item.data);
  }
}

export function firestoreCollectionRef(pathSegments: string[]) {
  const db = getScientificFirestoreForWrite();
  if (!db) return null;
  return collection(db, ...(pathSegments as [string, ...string[]]));
}
