/**
 * Report access unit tests (Phase 7.0).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildScientificReport } from '../../engine/scientificReportBuilder';
import { buildAthletePassport } from '../../engine/passportBuilder';
import {
  filterReportForViewer,
  resolveReportViewerRole,
  canGenerateScientificReport,
} from '../reportAccess';
import { buildSecurityContext } from '../accessControl';

const passport = buildAthletePassport({
  orgId: 'org_test',
  athleteId: 'a1',
  viewerRole: 'clinical',
  sources: {
    athlete: {
      id: 'a1',
      first_name: 'Test',
      last_name: 'Athlete',
      position: 'Mid',
      status: 'active',
      availability_status: 'available',
      consent_status: 'granted',
    },
    tests: [],
    analytics: {
      overall: { score: 70, maxScore: 100, percentileLabel: 'good', color: '#10B981', trend: 'stable', trendDelta: 0, modules: [] },
      kpis: [],
      recommendations: [],
      decision: { level: 'ready_to_train', titleKey: 'x', bodyKey: 'x', color: '#10B981', confidence: 0.8 },
      benchmarks: [],
      trends: [],
      strengths: [],
      weaknesses: [],
      radarAxes: [],
    },
    injuries: [
      {
        id: 'inj1',
        athlete_id: 'a1',
        injury_date: '2026-06-01',
        body_region: 'hamstring',
        tissue_type: 'muscle',
        severity_grade: 'grade_2',
        pain_level: 6,
        swelling: 4,
        rom_limitation: 3,
        status: 'rehab',
        expected_absence_days: 14,
        rtp_phase: 'phase_2',
        created_at: '2026-06-01T00:00:00Z',
      },
    ],
  },
});

const baseReport = buildScientificReport({
  context: {
    orgId: 'org_test',
    reportType: 'sports_medicine',
    athleteId: 'a1',
    dateRange: { from: '2026-06-01', to: '2026-07-07' },
    viewerRole: 'clinical',
    generatedBy: 'Test',
  },
  sources: { passport, athleteDisplayName: 'Test Athlete' },
});

describe('reportAccess', () => {
  it('resolves coach role from minimal context', () => {
    const ctx = buildSecurityContext('uid1', 'org1', { roleIds: ['coach'] }, null);
    assert.equal(resolveReportViewerRole(ctx), 'coach');
  });

  it('filters references for coach viewer', () => {
    const filtered = filterReportForViewer(baseReport, 'coach');
    assert.ok(!filtered.sections.some((s) => s.section_id === 'references'));
  });

  it('redacts athlete profile for research viewer', () => {
    const filtered = filterReportForViewer(baseReport, 'research');
    const profile = filtered.sections.find((s) => s.section_id === 'athlete_profile');
    if (profile) {
      assert.ok(profile.body.en.includes('De-identified') || profile.body.en.includes('participant'));
    }
  });

  it('allows report generation with read athletes permission', () => {
    const ctx = buildSecurityContext('uid1', 'org1', { roleIds: ['coach'], organizationIds: ['org1'] }, {
      status: 'active',
      role_ids: ['coach'],
    });
    assert.equal(canGenerateScientificReport(ctx), true);
  });
});
