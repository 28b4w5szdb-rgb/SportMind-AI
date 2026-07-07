/**
 * Passport access / visibility tests (Phase 6D.1).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildAthletePassport } from '../../engine/passportBuilder';
import { filterPassportForViewer, resolvePassportViewerRole } from '../passportAccess';
import { buildSecurityContext } from '../accessControl';
import type { PassportBuildContext } from '../../models/passport/PassportBuildInput';

const ctx: PassportBuildContext = {
  orgId: 'org_test',
  athleteId: 'a1',
  viewerRole: 'coach',
  sources: {
    athlete: {
      id: 'a1',
      first_name: 'Test',
      last_name: 'Athlete',
      availability_status: 'available',
      consent_status: 'granted',
      pseudonym_id: 'pseudo_a1',
    },
    tests: [],
  },
};

describe('passportAccess', () => {
  it('resolves clinical role from medical permission', () => {
    const security = buildSecurityContext('uid1', 'org_test', {
      permissions: ['read_medical', 'read_athletes'],
      activeOrganizationId: 'org_test',
    });
    assert.equal(resolvePassportViewerRole(security), 'clinical');
  });

  it('filters PII from identity in research view', () => {
    const passport = buildAthletePassport({ ...ctx, viewerRole: 'research' });
    const filtered = filterPassportForViewer(passport, 'research');
    const identity = filtered.sections.identity;
    assert.ok(!identity.summary_fields.some((f) => f.key === 'full_name'));
    assert.equal(filtered.privacy_metadata.pii_redacted, true);
  });

  it('hides medical section details for coach on restricted fields', () => {
    const passport = buildAthletePassport(ctx);
    const filtered = filterPassportForViewer(passport, 'coach');
    assert.equal(filtered.sections.medical.visibility, 'coach');
  });
});
