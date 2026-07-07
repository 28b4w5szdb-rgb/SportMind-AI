/**
 * G. Catalogs
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc, setDoc } from 'firebase/firestore';

import { authedDb, doc, seedCatalogSport, unauthedDb } from './helpers';
import { cleanupRulesTestEnv, clearRulesFirestore, initRulesTestEnv } from './setup';

before(async () => {
  await initRulesTestEnv();
});

after(async () => {
  await cleanupRulesTestEnv();
});

beforeEach(async () => {
  await clearRulesFirestore();
  await seedCatalogSport('football');
});

describe('catalogs', () => {
  it('authenticated users can read catalog', async () => {
    const db = authedDb('any_user', {});
    await assertSucceeds(getDoc(doc(db, 'catalog_sports', 'football')));
  });

  it('unauthenticated users cannot read catalog', async () => {
    const db = unauthedDb();
    await assertFails(getDoc(doc(db, 'catalog_sports', 'football')));
  });

  it('clients cannot write catalog', async () => {
    const db = authedDb('admin_attempt', { isOrgAdmin: true });
    await assertFails(
      setDoc(doc(db, 'catalog_sports', 'new_sport'), {
        key: 'new_sport',
        name: { en: 'New', ar: 'جديد' },
      })
    );
  });
});
