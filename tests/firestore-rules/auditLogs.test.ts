/**
 * I. Audit logs
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { deleteDoc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import {
  authedDb,
  CLAIMS,
  doc,
  ORG_A,
  seedAuditLog,
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
});

describe('audit logs', () => {
  it('org member can append audit log', async () => {
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertSucceeds(
      setDoc(doc(db, 'organizations', ORG_A, 'audit_logs', 'event_new'), {
        organization_id: ORG_A,
        event_type: 'assessment_created',
        actor_uid: 'coach_a',
        occurred_at: new Date().toISOString(),
      })
    );
  });

  it('clients cannot update audit logs', async () => {
    await seedAuditLog(ORG_A, 'event_1');
    const db = authedDb('admin_a', CLAIMS.orgAdminOrgA);
    await assertFails(
      updateDoc(doc(db, 'organizations', ORG_A, 'audit_logs', 'event_1'), {
        event_type: 'permission_change',
      })
    );
  });

  it('clients cannot delete audit logs', async () => {
    await seedAuditLog(ORG_A, 'event_1');
    const db = authedDb('admin_a', CLAIMS.orgAdminOrgA);
    await assertFails(deleteDoc(doc(db, 'organizations', ORG_A, 'audit_logs', 'event_1')));
  });

  it('non-admin member cannot read audit logs', async () => {
    await seedAuditLog(ORG_A, 'event_1');
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertFails(getDoc(doc(db, 'organizations', ORG_A, 'audit_logs', 'event_1')));
  });
});
