/**
 * Phase 6C.11 — membership document permission resolution rules tests.
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc, setDoc } from 'firebase/firestore';

import {
  authedDb,
  CLAIMS,
  doc,
  ORG_A,
  ORG_B,
  seedAthlete,
  seedMedicalRecord,
  seedOrgMember,
  seedOrganization,
  seedResearchDataset,
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
  await seedMedicalRecord(ORG_A, 'med_1');
  await seedResearchDataset(ORG_A, 'dataset_1');
});

describe('membership document permissions', () => {
  it('membership doc role_ids grant read_athletes', async () => {
    await seedOrgMember(ORG_A, 'coach_member', { role_ids: ['coach'] });
    const db = authedDb('coach_member', {});
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'athletes', 'athlete_a1')));
  });

  it('membership doc direct permissions grant read_assessments', async () => {
    await seedOrgMember(ORG_A, 'assessment_member', { permissions: ['read_assessments'] });
    const db = authedDb('assessment_member', {});
    await assertSucceeds(
      getDoc(doc(db, 'organizations', ORG_A, 'assessment_sessions', 'session_missing'))
    );
  });

  it('coach role via membership cannot read medical_records', async () => {
    await seedOrgMember(ORG_A, 'coach_member', { role_ids: ['coach'] });
    const db = authedDb('coach_member', {});
    await assertFails(getDoc(doc(db, 'organizations', ORG_A, 'medical_records', 'med_1')));
  });

  it('team_doctor role via membership can read medical_records', async () => {
    await seedOrgMember(ORG_A, 'doctor_member', { role_ids: ['team_doctor'] });
    const db = authedDb('doctor_member', {});
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'medical_records', 'med_1')));
  });

  it('researcher role via membership can read de-identified research data', async () => {
    await seedOrgMember(ORG_A, 'researcher_member', { role_ids: ['researcher'] });
    const db = authedDb('researcher_member', {});
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'research_datasets', 'dataset_1')));
  });

  it('export_research permission required for research export', async () => {
    await seedOrgMember(ORG_A, 'research_read', {
      permissions: ['read_research'],
      research_access: true,
      export_research: false,
    });
    const db = authedDb('research_read', {});
    await assertFails(
      setDoc(doc(db, 'organizations', ORG_A, 'research_datasets', 'dataset_new'), {
        organization_id: ORG_A,
        pseudonym_id: 'pseudo_export',
        deidentified: true,
        metric_value: 11,
      })
    );
  });

  it('cross-org access denied even with role_ids', async () => {
    await seedOrgMember(ORG_A, 'coach_a', { role_ids: ['coach'] });
    const db = authedDb('coach_a', {});
    await assertFails(getDoc(doc(db, 'organizations', ORG_B, 'athletes', 'athlete_b1')));
  });

  it('custom claims still work for read_athletes', async () => {
    const db = authedDb('claims_coach', CLAIMS.coachOrgA);
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'athletes', 'athlete_a1')));
  });

  it('missing claims + valid membership doc works for org root read', async () => {
    await seedOrgMember(ORG_A, 'member_doc_user');
    const db = authedDb('member_doc_user', {});
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A)));
  });
});
