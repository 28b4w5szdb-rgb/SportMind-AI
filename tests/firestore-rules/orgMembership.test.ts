/**
 * C. Organization membership
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc } from 'firebase/firestore';

import {
  authedDb,
  CLAIMS,
  doc,
  ORG_A,
  seedAthlete,
  seedOrgMember,
  seedOrganization,
} from './helpers';
import { cleanupRulesTestEnv, clearRulesFirestore, initRulesTestEnv } from './setup';

before(async () => {
  await initRulesTestEnv();
});

after(async () => {
  await cleanupRulesTestEnv();
});

beforeEach(async () => {
  await clearRulesFirestore();
  await seedOrganization(ORG_A, 'Org A');
  await seedAthlete(ORG_A, 'athlete_a1');
});

describe('organization membership', () => {
  it('org member via claims can read allowed org data', async () => {
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'athletes', 'athlete_a1')));
  });

  it('org member via membership doc can read org data without claims', async () => {
    await seedOrgMember(ORG_A, 'member_doc_user');
    const db = authedDb('member_doc_user', {});
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A)));
  });

  it('non-member cannot read org data', async () => {
    const db = authedDb('stranger', {});
    await assertFails(getDoc(doc(db, 'organizations', ORG_A)));
  });

  it('inactive membership doc does not grant access', async () => {
    await seedOrgMember(ORG_A, 'inactive_user', 'inactive');
    const db = authedDb('inactive_user', {});
    await assertFails(getDoc(doc(db, 'organizations', ORG_A, 'athletes', 'athlete_a1')));
  });
});
