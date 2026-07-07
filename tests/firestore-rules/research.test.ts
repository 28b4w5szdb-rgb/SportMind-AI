/**
 * F. Research data
 */

import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getDoc, setDoc } from 'firebase/firestore';

import {
  authedDb,
  CLAIMS,
  doc,
  ORG_A,
  seedAthlete,
  seedOrganization,
  seedResearchDataset,
  withRulesDisabled,
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
  await seedResearchDataset(ORG_A, 'dataset_1');
});

describe('research data', () => {
  it('researcher can read de-identified research datasets', async () => {
    const db = authedDb('researcher_a', CLAIMS.researcherOrgA);
    await assertSucceeds(getDoc(doc(db, 'organizations', ORG_A, 'research_datasets', 'dataset_1')));
  });

  it('researcher cannot read PII athlete fields (no read_athletes permission)', async () => {
    const db = authedDb('researcher_a', CLAIMS.researcherOrgA);
    await assertFails(getDoc(doc(db, 'organizations', ORG_A, 'athletes', 'athlete_a1')));
  });

  it('researcher without export_research cannot create dataset', async () => {
    const db = authedDb('researcher_read', CLAIMS.researcherReadOnlyOrgA);
    await assertFails(
      setDoc(doc(db, 'organizations', ORG_A, 'research_datasets', 'dataset_new'), {
        organization_id: ORG_A,
        pseudonym_id: 'pseudo_002',
        deidentified: true,
        metric_value: 10,
      })
    );
  });

  it('researcher with export_research can create de-identified dataset', async () => {
    const db = authedDb('researcher_a', CLAIMS.researcherOrgA);
    await assertSucceeds(
      setDoc(doc(db, 'organizations', ORG_A, 'research_datasets', 'dataset_new'), {
        organization_id: ORG_A,
        pseudonym_id: 'pseudo_002',
        deidentified: true,
        metric_value: 10,
      })
    );
  });

  it('researcher cannot read non-de-identified dataset', async () => {
    await withRulesDisabled(async (db) => {
      await setDoc(doc(db, 'organizations', ORG_A, 'research_datasets', 'dataset_pii'), {
        organization_id: ORG_A,
        pseudonym_id: 'pseudo_bad',
        deidentified: false,
        email: 'leak@example.com',
      });
    });
    const db = authedDb('researcher_a', CLAIMS.researcherOrgA);
    await assertFails(getDoc(doc(db, 'organizations', ORG_A, 'research_datasets', 'dataset_pii')));
  });
});
