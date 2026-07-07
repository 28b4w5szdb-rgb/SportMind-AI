import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  type DocumentData,
  type Firestore,
  type WhereFilterOp,
} from 'firebase/firestore';

import { getCloudFirestore } from '@/src/cloud/firebase/firestore';

import {
  ORGANIZATIONS_ROOT,
  REPORT_ROLE_VIEWS_SUBCOLLECTION,
  REPORTS_SUBCOLLECTION,
} from '../../paths/organizationPaths';
import { ASSESSMENT_SESSIONS_SUBCOLLECTION } from '../../paths/sessionPaths';
import { ScientificCloudError } from '../errors';
import { wrapFirestoreError } from '../cloudErrorDiagnostics';
import { createDocumentIfNotExists } from './firestoreWriteHelper';

export function getScientificFirestore(): Firestore | null {
  return getCloudFirestore();
}

function requireFirestore(): Firestore {
  const db = getScientificFirestore();
  if (!db) {
    throw new ScientificCloudError(
      'firestore_unavailable',
      'Firestore is not configured',
      'getCloudFirestore() returned null'
    );
  }
  return db;
}

export async function readDocument<T>(collectionId: string, documentId: string): Promise<T | null> {
  const db = requireFirestore();

  try {
    const snap = await getDoc(doc(db, collectionId, documentId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  } catch (cause) {
    throw wrapFirestoreError(`readDocument(${collectionId}/${documentId})`, cause);
  }
}

export async function readCollection<T>(
  collectionId: string,
  filters?: Array<{ field: string; op: '==' | '!='; value: unknown }>
): Promise<T[]> {
  const db = requireFirestore();

  try {
    const base = collection(db, collectionId);
    const q = filters?.length
      ? query(base, ...filters.map((f) => where(f.field, f.op, f.value)))
      : query(base);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch (cause) {
    throw wrapFirestoreError(`readCollection(${collectionId})`, cause);
  }
}

export async function readSubDocument<T>(
  parentCollectionId: string,
  parentId: string,
  subcollectionId: string,
  documentId: string
): Promise<T | null> {
  const db = requireFirestore();

  try {
    const snap = await getDoc(doc(db, parentCollectionId, parentId, subcollectionId, documentId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  } catch (cause) {
    throw wrapFirestoreError(
      `readSubDocument(${parentCollectionId}/${parentId}/${subcollectionId}/${documentId})`,
      cause
    );
  }
}

export async function readSubcollectionFiltered<T>(
  parentCollectionId: string,
  parentId: string,
  subcollectionId: string,
  filters?: Array<{ field: string; op: WhereFilterOp; value: unknown }>
): Promise<T[]> {
  const db = requireFirestore();

  try {
    const base = collection(db, parentCollectionId, parentId, subcollectionId);
    const q = filters?.length
      ? query(base, ...filters.map((f) => where(f.field, f.op, f.value)))
      : query(base);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch (cause) {
    throw wrapFirestoreError(
      `readSubcollectionFiltered(${parentCollectionId}/${parentId}/${subcollectionId})`,
      cause
    );
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
  const db = requireFirestore();

  try {
    const snap = await getDocs(
      collection(db, parentCollectionId, parentId, subcollectionId, nestedId, nestedSubcollectionId)
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch (cause) {
    throw wrapFirestoreError(
      `readNestedSubcollection(${parentCollectionId}/${parentId}/${subcollectionId}/${nestedId}/${nestedSubcollectionId})`,
      cause
    );
  }
}

export async function readReportRoleView<T>(
  orgId: string,
  reportId: string,
  role: string
): Promise<T | null> {
  const db = requireFirestore();

  try {
    const snap = await getDoc(
      doc(
        db,
        ORGANIZATIONS_ROOT,
        orgId,
        REPORTS_SUBCOLLECTION,
        reportId,
        REPORT_ROLE_VIEWS_SUBCOLLECTION,
        role
      )
    );
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  } catch (cause) {
    throw wrapFirestoreError(`readReportRoleView(${orgId}/${reportId}/${role})`, cause);
  }
}

export async function readOrgSessionSubcollection<T>(
  orgId: string,
  sessionId: string,
  subcollectionId: string
): Promise<T[]> {
  const db = requireFirestore();

  try {
    const snap = await getDocs(
      collection(
        db,
        ORGANIZATIONS_ROOT,
        orgId,
        ASSESSMENT_SESSIONS_SUBCOLLECTION,
        sessionId,
        subcollectionId
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch (cause) {
    throw wrapFirestoreError(`readOrgSessionSubcollection(${orgId}/${sessionId}/${subcollectionId})`, cause);
  }
}

export async function readOrgSessionSubDocument<T>(
  orgId: string,
  sessionId: string,
  subcollectionId: string,
  documentId: string
): Promise<T | null> {
  const db = requireFirestore();

  try {
    const snap = await getDoc(
      doc(
        db,
        ORGANIZATIONS_ROOT,
        orgId,
        ASSESSMENT_SESSIONS_SUBCOLLECTION,
        sessionId,
        subcollectionId,
        documentId
      )
    );
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  } catch (cause) {
    throw wrapFirestoreError(
      `readOrgSessionSubDocument(${orgId}/${sessionId}/${subcollectionId}/${documentId})`,
      cause
    );
  }
}

export async function createOrgSessionSubDocumentIfNotExists(
  orgId: string,
  sessionId: string,
  subcollectionId: string,
  documentId: string,
  data: DocumentData
): Promise<void> {
  await createDocumentIfNotExists(
    [
      ORGANIZATIONS_ROOT,
      orgId,
      ASSESSMENT_SESSIONS_SUBCOLLECTION,
      sessionId,
      subcollectionId,
      documentId,
    ],
    data
  );
}

export async function createOrgSessionSubcollectionDocumentsIfNotExists(
  orgId: string,
  sessionId: string,
  subcollectionId: string,
  documents: Array<{ id: string; data: DocumentData }>
): Promise<void> {
  for (const item of documents) {
    await createOrgSessionSubDocumentIfNotExists(
      orgId,
      sessionId,
      subcollectionId,
      item.id,
      item.data
    );
  }
}
