/**
 * Access control unit tests — Phase 6C.10 / 6C.11.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildSecurityContext,
  hasPermission,
  isActiveOrgMember,
  resolveContextPermissions,
} from '../accessControl';
import { buildCustomClaimsPayload, validateClaimsPayload } from '../customClaimsHelpers';
import { canReadFullMedicalRecord, canReadLimitedMedicalStatus } from '../clinicalAccess';
import { resolveEffectivePermissions } from '../effectivePermissionsResolver';
import { PERMISSIONS } from '../permissions';
import { assertResearchSafeRecord, isDeIdentifiedRecord } from '../researchAccess';

describe('accessControl', () => {
  it('resolves org admin as all permissions', () => {
    const ctx = buildSecurityContext('u1', 'org_a', { isOrgAdmin: true, organizationIds: ['org_a'] });
    const perms = resolveContextPermissions(ctx);
    assert.ok(perms.includes(PERMISSIONS.MANAGE_ORG));
    assert.ok(perms.includes(PERMISSIONS.WRITE_MEDICAL));
  });

  it('resolves coach permissions from claim role ids', () => {
    const ctx = buildSecurityContext('u2', 'org_a', { organizationIds: ['org_a'], roleIds: ['coach'] });
    assert.ok(hasPermission(ctx, PERMISSIONS.READ_ATHLETES));
    assert.ok(!hasPermission(ctx, PERMISSIONS.READ_MEDICAL));
  });

  it('unions membership roles and direct permissions with claims', () => {
    const ctx = buildSecurityContext(
      'u3',
      'org_a',
      { permissions: ['read_athletes'] },
      { status: 'active', role_ids: [], permissions: ['read_assessments'] }
    );
    const perms = resolveContextPermissions(ctx);
    assert.ok(perms.includes(PERMISSIONS.READ_ATHLETES));
    assert.ok(perms.includes(PERMISSIONS.READ_ASSESSMENTS));
  });

  it('falls back to membership roles when claims empty', () => {
    const ctx = buildSecurityContext('u4', 'org_a', {}, {
      status: 'active',
      role_ids: ['physiotherapist'],
    });
    assert.ok(isActiveOrgMember(ctx));
    assert.ok(hasPermission(ctx, PERMISSIONS.READ_MEDICAL));
  });
});

describe('effectivePermissionsResolver', () => {
  it('applies membership clinical and research flags', () => {
    const perms = resolveEffectivePermissions({
      uid: 'u5',
      orgId: 'org_a',
      membership: {
        status: 'active',
        role_ids: [],
        research_access: true,
        export_research: true,
        clinical_access: true,
      },
    });
    assert.ok(perms.includes(PERMISSIONS.READ_MEDICAL));
    assert.ok(perms.includes(PERMISSIONS.READ_RESEARCH));
    assert.ok(perms.includes(PERMISSIONS.EXPORT_RESEARCH));
  });
});

describe('customClaimsHelpers', () => {
  it('builds and validates claims payload', () => {
    const claims = buildCustomClaimsPayload({
      uid: 'u6',
      orgId: 'org_a',
      roleIds: ['coach'],
    });
    const validation = validateClaimsPayload(claims);
    assert.ok(validation.valid);
    assert.ok(claims.permissions.includes(PERMISSIONS.READ_ATHLETES));
  });
});

describe('clinicalAccess', () => {
  it('grants full medical to physiotherapist', () => {
    const ctx = buildSecurityContext('u7', 'org_a', { organizationIds: ['org_a'], roleIds: ['physiotherapist'] });
    assert.ok(canReadFullMedicalRecord(ctx));
  });

  it('grants limited status to coach only', () => {
    const ctx = buildSecurityContext('u8', 'org_a', { organizationIds: ['org_a'], roleIds: ['coach'] });
    assert.ok(!canReadFullMedicalRecord(ctx));
    assert.ok(canReadLimitedMedicalStatus(ctx));
  });
});

describe('researchAccess', () => {
  it('accepts de-identified records', () => {
    const record = {
      deidentified: true,
      pseudonym_id: 'pseudo_001',
      organization_id: 'org_a',
      metric_value: 42,
    };
    assert.ok(isDeIdentifiedRecord(record));
    assert.ok(assertResearchSafeRecord(record));
  });

  it('rejects records with PII', () => {
    const record = {
      deidentified: true,
      pseudonym_id: 'pseudo_002',
      organization_id: 'org_a',
      email: 'athlete@example.com',
    };
    assert.ok(!assertResearchSafeRecord(record));
  });
});
