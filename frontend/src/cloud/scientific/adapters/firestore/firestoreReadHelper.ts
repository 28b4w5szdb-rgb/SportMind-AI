import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  type Firestore,
  type WhereFilterOp,
} from 'firebase/firestore';

import { getCloudFirestore } from '@/src/cloud/firebase/firestore';

export function getScientificFirestore(): Firestore | null {
  return getCloudFirestore();
}

export async function readDocument<T>(collectionId: string, documentId: string): Promise<T | null> {
  const db = getScientificFirestore();
  if (!db) return null;

  try {
    const snap = await getDoc(doc(db, collectionId, documentId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  } catch {
    return null;
  }
}

export async function readCollection<T>(
  collectionId: string,
  filters?: Array<{ field: string; op: '==' | '!='; value: unknown }>
): Promise<T[]> {
  const db = getScientificFirestore();
  if (!db) return [];

  try {
    const base = collection(db, collectionId);
    const q = filters?.length
      ? query(base, ...filters.map((f) => where(f.field, f.op, f.value)))
      : query(base);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch {
    return [];
  }
}

export async function readSubDocument<T>(
  parentCollectionId: string,
  parentId: string,
  subcollectionId: string,
  documentId: string
): Promise<T | null> {
  const db = getScientificFirestore();
  if (!db) return null;

  try {
    const snap = await getDoc(doc(db, parentCollectionId, parentId, subcollectionId, documentId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  } catch {
    return null;
  }
}

export async function readSubcollectionFiltered<T>(
  parentCollectionId: string,
  parentId: string,
  subcollectionId: string,
  filters?: Array<{ field: string; op: WhereFilterOp; value: unknown }>
): Promise<T[]> {
  const db = getScientificFirestore();
  if (!db) return [];

  try {
    const base = collection(db, parentCollectionId, parentId, subcollectionId);
    const q = filters?.length
      ? query(base, ...filters.map((f) => where(f.field, f.op, f.value)))
      : query(base);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch {
    return [];
  }
}

export async function readSubcollection<T>(
  parentCollectionId: string,
  parentId: string,
  subcollectionId: string
): Promise<T[]> {
  return readSubcollectionFiltered<T>(parentCollectionId, parentId, subcollectionId);
}

export async function readNestedSubcollection<T>(
  parentCollectionId: string,
  parentId: string,
  subcollectionId: string,
  nestedId: string,
  nestedSubcollectionId: string
): Promise<T[]> {
  const db = getScientificFirestore();
  if (!db) return [];

  try {
    const snap = await getDocs(
      collection(db, parentCollectionId, parentId, subcollectionId, nestedId, nestedSubcollectionId)
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch {
    return [];
  }
}
