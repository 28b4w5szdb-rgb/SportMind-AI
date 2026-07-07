/**
 * Nested organization path rules (Phase 8.1).
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc, setDoc } from 'firebase/firestore';

import { authedDb, CLAIMS, doc, ORG_A, seedOrganization } from './helpers';
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
});

describe('nestedOrgPaths', () => {
  it('coach can read team memberships subcollection', async () => {
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertSucceeds(
      getDoc(doc(db, 'organizations', ORG_A, 'teams', 'team_1', 'memberships', 'athlete_1'))
    );
  });

  it('member can read equipment maintenance logs', async () => {
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertSucceeds(
      getDoc(doc(db, 'organizations', ORG_A, 'equipment', 'eq_1', 'maintenance_logs', 'log_1'))
    );
  });

  it('report analyst can read coach role view', async () => {
    const db = authedDb('analyst_a', CLAIMS.reportsOrgA);
    await assertSucceeds(
      getDoc(doc(db, 'organizations', ORG_A, 'reports', 'report_a1', 'role_views', 'coach'))
    );
  });

  it('report analyst cannot read clinical role view without medical permission', async () => {
    const db = authedDb('analyst_a', CLAIMS.reportsOrgA);
    await assertFails(
      getDoc(doc(db, 'organizations', ORG_A, 'reports', 'report_a1', 'role_views', 'clinical'))
    );
  });

  it('clinical user can read clinical role view', async () => {
    const db = authedDb('physio_a', CLAIMS.physiotherapistOrgA);
    await assertSucceeds(
      getDoc(doc(db, 'organizations', ORG_A, 'reports', 'report_a1', 'role_views', 'clinical'))
    );
  });

  it('report writer can create role view subdocument', async () => {
    const db = authedDb('writer_a', CLAIMS.reportsOrgA);
    await assertSucceeds(
      setDoc(doc(db, 'organizations', ORG_A, 'reports', 'report_a1', 'role_views', 'coach'), {
        viewer_role: 'coach',
        sections: [],
        updated_at: new Date().toISOString(),
      })
    );
  });
});
