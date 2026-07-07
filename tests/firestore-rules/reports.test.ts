/**
 * H. Reports
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

  it('authorized user can create org-scoped scientific report', async () => {
    const db = authedDb('writer_a', CLAIMS.reportsOrgA);
    await assertSucceeds(
      setDoc(doc(db, 'organizations', ORG_A, 'reports', 'new_report'), {
        organization_id: ORG_A,
        report_id: 'new_report',
        report_type: 'athlete',
        athlete_id: 'athlete_1',
        title: { en: 'Test', ar: 'Test' },
        status: 'draft',
        summary: 'Test summary',
        sections: [],
        visibility_profile: 'coach',
        evidence_summary: {
          primary_tier: 'field',
          tier_label: { en: 'Field', ar: 'Field' },
          disclaimer: { en: 'd', ar: 'd' },
          source_count: 0,
          protocol_refs: [],
        },
        source_references: [],
        generated_at: new Date().toISOString(),
        generated_by: 'test',
        version_metadata: {
          report_schema_version: '1.0.0',
          builder_version: '7.0',
          sections_included: 0,
          sections_empty: 0,
        },
        viewer_role: 'coach',
        date_range: { from: '2026-06-01', to: '2026-07-07' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );
  });

  it('authorized user can archive org-scoped report via update', async () => {
    const db = authedDb('writer_a', CLAIMS.reportsOrgA);
    await assertSucceeds(
      updateDoc(doc(db, 'organizations', ORG_A, 'reports', 'report_a1'), {
        status: 'archived',
        updated_at: new Date().toISOString(),
      })
    );
  });

  it('user without write_reports cannot create org-scoped report', async () => {
    const db = authedDb('reader_a', {
      organizationIds: [ORG_A],
      activeOrganizationId: ORG_A,
      permissions: ['read_reports'],
    });
    await assertFails(
      setDoc(doc(db, 'organizations', ORG_A, 'reports', 'blocked_report'), {
        organization_id: ORG_A,
        title: 'Blocked',
        status: 'draft',
      })
    );
  });
});
