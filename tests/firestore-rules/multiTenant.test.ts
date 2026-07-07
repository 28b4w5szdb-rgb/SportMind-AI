/**
 * A. Multi-tenant isolation
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';

import {
  authedDb,
  CLAIMS,
  doc,
  ORG_A,
  ORG_B,
  seedAthlete,
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
  await seedOrganization(ORG_B, 'Org B');
  await seedAthlete(ORG_A, 'athlete_a1');
  await seedAthlete(ORG_B, 'athlete_b1');
});

describe('multi-tenant isolation', () => {
  it('user in org A cannot read org B athlete', async () => {
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertFails(getDoc(doc(db, 'organizations', ORG_B, 'athletes', 'athlete_b1')));
  });

  it('user in org A cannot write org B athlete', async () => {
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertFails(
      setDoc(doc(db, 'organizations', ORG_B, 'athletes', 'athlete_new'), {
        organization_id: ORG_B,
        first_name: 'Cross',
        last_name: 'Tenant',
        team_ids: [],
        consent_status: 'granted',
        status: 'active',
      })
    );
  });

  it('user in org A can read own org athlete', async () => {
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'athletes', 'athlete_a1')));
  });

  it('user in org A cannot update org B root document', async () => {
    const db = authedDb('coach_a', { ...CLAIMS.coachOrgA, permissions: ['manage_org'] });
    await assertFails(
      updateDoc(doc(db, 'organizations', ORG_B), { name: 'Hijacked' })
    );
  });
});
