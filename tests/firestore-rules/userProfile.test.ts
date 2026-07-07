/**
 * B. User profile access
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc, setDoc } from 'firebase/firestore';

import { authedDb, doc, withRulesDisabled } from './helpers';
import { cleanupRulesTestEnv, clearRulesFirestore, initRulesTestEnv } from './setup';

before(async () => {
  await initRulesTestEnv();
});

after(async () => {
  await cleanupRulesTestEnv();
});

beforeEach(async () => {
  await clearRulesFirestore();
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'users', 'user_a'), {
      uid: 'user_a',
      email: 'a@example.com',
      full_name: 'User A',
    });
    await setDoc(doc(db, 'users', 'user_b'), {
      uid: 'user_b',
      email: 'b@example.com',
      full_name: 'User B',
    });
  });
});

describe('user profile access', () => {
  it('user can read own global profile', async () => {
    const db = authedDb('user_a');
    await assertSucceeds(getDoc(doc(db, 'users', 'user_a')));
  });

  it('user cannot read another global profile', async () => {
    const db = authedDb('user_a');
    await assertFails(getDoc(doc(db, 'users', 'user_b')));
  });
});
