/**
 * E. Clinical data
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc } from 'firebase/firestore';

import {
  authedDb,
  CLAIMS,
  doc,
  ORG_A,
  seedMedicalRecord,
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
  await seedMedicalRecord(ORG_A, 'med_1');
});

describe('clinical data', () => {
  it('coach cannot read medical_records', async () => {
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertFails(getDoc(doc(db, 'organizations', ORG_A, 'medical_records', 'med_1')));
  });

  it('physiotherapist can read medical_records', async () => {
    const db = authedDb('physio_a', CLAIMS.physiotherapistOrgA);
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'medical_records', 'med_1')));
  });

  it('team_doctor can read medical_records', async () => {
    const db = authedDb('doctor_a', CLAIMS.teamDoctorOrgA);
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'medical_records', 'med_1')));
  });

  it('viewer cannot read medical_records', async () => {
    const db = authedDb('viewer_a', CLAIMS.viewerOrgA);
    await assertFails(getDoc(doc(db, 'organizations', ORG_A, 'medical_records', 'med_1')));
  });
});
