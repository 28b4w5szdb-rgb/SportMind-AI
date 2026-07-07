/**
 * D. Assessment sessions
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';

import {
  authedDb,
  CLAIMS,
  doc,
  ORG_A,
  seedAssessmentSession,
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

describe('assessment sessions', () => {
  it('authorized user can create assessment session', async () => {
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertSucceeds(
      setDoc(doc(db, 'organizations', ORG_A, 'assessment_sessions', 'session_new'), {
        organization_id: ORG_A,
        session_id: 'session_new',
        athlete_id: 'athlete_1',
        assessment_definition_key: 'sprint30',
        created_at: new Date().toISOString(),
      })
    );
  });

  it('assessment sessions are append-only — update denied', async () => {
    await seedAssessmentSession(ORG_A, 'session_1');
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertFails(
      updateDoc(doc(db, 'organizations', ORG_A, 'assessment_sessions', 'session_1'), {
        athlete_id: 'athlete_2',
      })
    );
  });

  it('user without write_assessments cannot create session', async () => {
    const db = authedDb('viewer_a', CLAIMS.viewerOrgA);
    await assertFails(
      setDoc(doc(db, 'organizations', ORG_A, 'assessment_sessions', 'session_denied'), {
        organization_id: ORG_A,
        session_id: 'session_denied',
        athlete_id: 'athlete_1',
        assessment_definition_key: 'sprint30',
      })
    );
  });

  it('authorized user can create raw measurement under session', async () => {
    await seedAssessmentSession(ORG_A, 'session_1');
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertSucceeds(
      setDoc(
        doc(db, 'organizations', ORG_A, 'assessment_sessions', 'session_1', 'raw_measurements', 'raw_1'),
        {
          measurement_id: 'raw_1',
          value: 4.2,
          unit: 's',
        }
      )
    );
  });

  it('non-member cannot read raw measurements', async () => {
    await seedAssessmentSession(ORG_A, 'session_1');
    const db = authedDb('stranger', {});
    await assertFails(
      getDoc(
        doc(db, 'organizations', ORG_A, 'assessment_sessions', 'session_1', 'raw_measurements', 'raw_1')
      )
    );
  });

  it('raw measurement update is denied', async () => {
    await seedAssessmentSession(ORG_A, 'session_1');
    const db = authedDb('coach_a', CLAIMS.coachOrgA);
    await assertSucceeds(
      setDoc(
        doc(db, 'organizations', ORG_A, 'assessment_sessions', 'session_1', 'raw_measurements', 'raw_1'),
        { measurement_id: 'raw_1', value: 4.2, unit: 's' }
      )
    );
    await assertFails(
      updateDoc(
        doc(db, 'organizations', ORG_A, 'assessment_sessions', 'session_1', 'raw_measurements', 'raw_1'),
        { value: 4.0 }
      )
    );
  });
});
