/**
 * Access control unit tests — Phase 6C.10.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildSecurityContext,
  hasPermission,
  isActiveOrgMember,
  resolveEffectivePermissions,
} from '../accessControl';
import { canReadFullMedicalRecord, canReadLimitedMedicalStatus } from '../clinicalAccess';
import { PERMISSIONS } from '../permissions';
import { assertResearchSafeRecord, isDeIdentifiedRecord } from '../researchAccess';

describe('accessControl', () => {
  it('resolves org admin as all permissions', () => {
    const ctx = buildSecurityContext('u1', 'org_a', { isOrgAdmin: true, organizationIds: ['org_a'] });
    const perms = resolveEffectivePermissions(ctx);
    assert.ok(perms.includes(PERMISSIONS.MANAGE_ORG));
    assert.ok(perms.includes(PERMISSIONS.WRITE_MEDICAL));
  });

  it('resolves coach permissions from role ids', () => {
    const ctx = buildSecurityContext('u2', 'org_a', { organizationIds: ['org_a'], roleIds: ['coach'] });
    assert.ok(hasPermission(ctx, PERMISSIONS.READ_ATHLETES));
    assert.ok(!hasPermission(ctx, PERMISSIONS.READ_MEDICAL));
  });

  it('falls back to membership roles when claims empty', () => {
    const ctx = buildSecurityContext('u3', 'org_a', {}, ['physiotherapist']);
    assert.ok(isActiveOrgMember(ctx));
    assert.ok(hasPermission(ctx, PERMISSIONS.READ_MEDICAL));
  });
});

describe('clinicalAccess', () => {
  it('grants full medical to physiotherapist', () => {
    const ctx = buildSecurityContext('u4', 'org_a', { organizationIds: ['org_a'], roleIds: ['physiotherapist'] });
    assert.ok(canReadFullMedicalRecord(ctx));
  });

  it('grants limited status to coach only', () => {
    const ctx = buildSecurityContext('u5', 'org_a', { organizationIds: ['org_a'], roleIds: ['coach'] });
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
