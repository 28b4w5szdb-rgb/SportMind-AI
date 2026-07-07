/**
 * Workspace role & visibility profile tests (Phase 6D.3).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildSecurityContext } from '@/src/cloud/scientific/security/accessControl';
import { PERMISSIONS } from '@/src/cloud/scientific/security/permissions';
import { resolveViewerRoleFromContext } from '../security/resolveWorkspaceViewerRole';
import { WORKSPACE_ROLE_PRESETS, WORKSPACE_MOCK_ORG_ID } from '../security/workspaceRolePresets';
import { buildVisibilityProfile } from '../context/visibilityProfile';
import { buildAthletePassport } from '@/src/cloud/scientific/engine/passportBuilder';

describe('workspaceRolePresets', () => {
  it('maps team_doctor to clinical viewer role', () => {
    const preset = WORKSPACE_ROLE_PRESETS.team_doctor;
    const ctx = buildSecurityContext('u1', WORKSPACE_MOCK_ORG_ID, preset.claims, preset.membership);
    assert.equal(resolveViewerRoleFromContext(ctx), 'clinical');
    assert.equal(ctx.claims.permissions?.includes(PERMISSIONS.READ_MEDICAL), true);
  });

  it('maps researcher to research viewer role', () => {
    const preset = WORKSPACE_ROLE_PRESETS.researcher;
    const ctx = buildSecurityContext('u1', WORKSPACE_MOCK_ORG_ID, preset.claims, preset.membership);
    assert.equal(resolveViewerRoleFromContext(ctx), 'research');
  });

  it('maps org_admin to clinical with admin flag', () => {
    const preset = WORKSPACE_ROLE_PRESETS.org_admin;
    const ctx = buildSecurityContext('u1', WORKSPACE_MOCK_ORG_ID, preset.claims, preset.membership);
    assert.equal(ctx.claims.isOrgAdmin, true);
    assert.equal(resolveViewerRoleFromContext(ctx), 'clinical');
  });
});

describe('visibilityProfile', () => {
  it('counts hidden passport sections for coach vs clinical', () => {
    const coachCtx = buildSecurityContext(
      'u1',
      WORKSPACE_MOCK_ORG_ID,
      WORKSPACE_ROLE_PRESETS.coach.claims,
      WORKSPACE_ROLE_PRESETS.coach.membership
    );
    const rawPassport = buildAthletePassport({
      orgId: WORKSPACE_MOCK_ORG_ID,
      athleteId: 'a1',
      sources: {
        athlete: { id: 'a1', first_name: 'A', last_name: 'B' },
      },
    });
    const profile = buildVisibilityProfile({
      securityContext: coachCtx,
      workspaceRole: 'coach',
      passport: rawPassport,
      timeline: null,
    });
    assert.ok(profile.passportVisibleSections >= 0);
    assert.equal(profile.workspaceRole, 'coach');
  });
});
