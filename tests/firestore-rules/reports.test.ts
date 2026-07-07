/**
 * H. Reports
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc } from 'firebase/firestore';

import {
  authedDb,
  CLAIMS,
  doc,
  ORG_A,
  ORG_B,
  seedLegacyReport,
  seedOrgReport,
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
  await seedOrgReport(ORG_A, 'report_a1');
  await seedOrgReport(ORG_B, 'report_b1');
  await seedLegacyReport(ORG_A, 'legacy_report_a');
  await seedLegacyReport(ORG_B, 'legacy_report_b');
});

describe('reports', () => {
  it('authorized org user can read org-scoped report', async () => {
    const db = authedDb('analyst_a', CLAIMS.reportsOrgA);
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'reports', 'report_a1')));
  });

  it('cross-org org-scoped report read denied', async () => {
    const db = authedDb('analyst_a', CLAIMS.reportsOrgA);
    await assertFails(getDoc(doc(db, 'organizations', ORG_B, 'reports', 'report_b1')));
  });

  it('authorized user can read legacy report in own org', async () => {
    const db = authedDb('analyst_a', CLAIMS.reportsOrgA);
    await assertSucceeds(getDoc(doc(db, 'reports', 'legacy_report_a')));
  });

  it('cross-org legacy report read denied', async () => {
    const db = authedDb('analyst_a', CLAIMS.reportsOrgA);
    await assertFails(getDoc(doc(db, 'reports', 'legacy_report_b')));
  });
});
