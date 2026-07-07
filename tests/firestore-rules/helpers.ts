/**
 * Firestore rules test helpers — seed data and auth contexts (Phase 6C.10.1).
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';

import { getRulesTestEnv } from './setup';

export const ORG_A = 'org_sportmind_a';
export const ORG_B = 'org_sportmind_b';

export const CLAIMS = {
  coachOrgA: {
    organizationIds: [ORG_A],
    activeOrganizationId: ORG_A,
    permissions: [
      'read_athletes',
      'write_athletes',
      'read_assessments',
      'write_assessments',
    ],
  },
  coachOrgB: {
    organizationIds: [ORG_B],
    activeOrganizationId: ORG_B,
    permissions: [
      'read_athletes',
      'write_athletes',
      'read_assessments',
      'write_assessments',
    ],
  },
  physiotherapistOrgA: {
    organizationIds: [ORG_A],
    activeOrganizationId: ORG_A,
    permissions: ['read_athletes', 'read_assessments', 'read_medical', 'write_medical'],
  },
  teamDoctorOrgA: {
    organizationIds: [ORG_A],
    activeOrganizationId: ORG_A,
    permissions: ['read_athletes', 'read_assessments', 'read_medical', 'write_medical'],
  },
  viewerOrgA: {
    organizationIds: [ORG_A],
    activeOrganizationId: ORG_A,
    permissions: ['read_athletes', 'read_assessments'],
  },
  researcherOrgA: {
    organizationIds: [ORG_A],
    activeOrganizationId: ORG_A,
    permissions: ['read_research', 'export_research'],
  },
  researcherReadOnlyOrgA: {
    organizationIds: [ORG_A],
    activeOrganizationId: ORG_A,
    permissions: ['read_research'],
  },
  reportsOrgA: {
    organizationIds: [ORG_A],
    activeOrganizationId: ORG_A,
    permissions: ['read_reports', 'write_reports'],
  },
  orgAdminOrgA: {
    organizationIds: [ORG_A],
    activeOrganizationId: ORG_A,
    isOrgAdmin: true,
    permissions: ['manage_org'],
  },
} as const;

export function authedDb(uid: string, claims: Record<string, unknown> = {}): Firestore {
  return getRulesTestEnv().authenticatedContext(uid, claims).firestore();
}

export function unauthedDb(): Firestore {
  return getRulesTestEnv().unauthenticatedContext().firestore();
}

export async function withRulesDisabled(run: (db: Firestore) => Promise<void>): Promise<void> {
  await getRulesTestEnv().withSecurityRulesDisabled(async (context) => {
    await run(context.firestore());
  });
}

export async function seedOrganization(orgId: string, name: string): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'organizations', orgId), {
      organization_id: orgId,
      name,
      created_at: new Date().toISOString(),
    });
  });
}

export async function seedOrgMember(
  orgId: string,
  uid: string,
  status: 'active' | 'inactive' | 'invited' = 'active'
): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'organizations', orgId, 'users', uid), {
      uid,
      organization_id: orgId,
      email: `${uid}@example.com`,
      display_name: uid,
      role_ids: [],
      team_ids: [],
      language: 'en',
      status,
    });
  });
}

export async function seedAthlete(orgId: string, athleteId: string): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'organizations', orgId, 'athletes', athleteId), {
      organization_id: orgId,
      first_name: 'Test',
      last_name: 'Athlete',
      team_ids: [],
      consent_status: 'granted',
      status: 'active',
    });
  });
}

export async function seedMedicalRecord(orgId: string, recordId: string): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'organizations', orgId, 'medical_records', recordId), {
      organization_id: orgId,
      athlete_id: 'athlete_1',
      diagnosis: 'Hamstring strain',
      created_at: new Date().toISOString(),
    });
  });
}

export async function seedResearchDataset(orgId: string, datasetId: string): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'organizations', orgId, 'research_datasets', datasetId), {
      organization_id: orgId,
      pseudonym_id: 'pseudo_001',
      deidentified: true,
      metric_value: 42,
    });
  });
}

export async function seedAssessmentSession(orgId: string, sessionId: string): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'organizations', orgId, 'assessment_sessions', sessionId), {
      organization_id: orgId,
      session_id: sessionId,
      athlete_id: 'athlete_1',
      assessment_definition_key: 'sprint30',
      created_at: new Date().toISOString(),
    });
  });
}

export async function seedOrgReport(orgId: string, reportId: string): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'organizations', orgId, 'reports', reportId), {
      organization_id: orgId,
      title: 'Team Report',
      status: 'ready',
    });
  });
}

export async function seedLegacyReport(orgId: string, reportId: string): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'reports', reportId), {
      organization_id: orgId,
      title: 'Legacy Report',
      status: 'ready',
    });
  });
}

export async function seedAuditLog(orgId: string, eventId: string): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'organizations', orgId, 'audit_logs', eventId), {
      organization_id: orgId,
      event_type: 'user_login',
      actor_uid: 'admin_a',
      occurred_at: new Date().toISOString(),
    });
  });
}

export async function seedCatalogSport(docId: string): Promise<void> {
  await withRulesDisabled(async (db) => {
    await setDoc(doc(db, 'catalog_sports', docId), {
      key: docId,
      name: { en: 'Football', ar: 'كرة القدم' },
    });
  });
}

export { doc, getDoc, setDoc, updateDoc };
