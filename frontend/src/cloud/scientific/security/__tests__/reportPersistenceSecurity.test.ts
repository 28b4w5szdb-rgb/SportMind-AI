/**
 * Report persistence security tests (Phase 8.1).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildScientificReport } from '../../engine/scientificReportBuilder';
import { buildAthletePassport } from '../../engine/passportBuilder';
import {
  PERSISTENCE_SCHEMA_VERSION,
  prepareReportForPersistence,
  resolvePersistedReportForViewer,
  validateReportPayloadSize,
} from '../reportPersistenceSecurity';

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

const clinicalReport = buildScientificReport({
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

describe('reportPersistenceSecurity', () => {
  it('stores coach-safe sections on main payload', () => {
    const prepared = prepareReportForPersistence(clinicalReport);
    const coachMedical = prepared.safeReport.sections.find((s) => s.section_id === 'injury_medical_summary');
    const clinicalMedical = prepared.roleViews.clinical.sections.find((s) => s.section_id === 'injury_medical_summary');

    assert.ok(coachMedical);
    assert.ok(clinicalMedical);
    assert.notEqual(coachMedical!.body.en, clinicalMedical!.body.en);
    assert.ok(coachMedical!.body.en.split('\n').length <= 4);
  });

  it('builds role views for all persisted roles', () => {
    const prepared = prepareReportForPersistence(clinicalReport);
    assert.ok(prepared.roleViews.coach);
    assert.ok(prepared.roleViews.clinical);
    assert.ok(prepared.roleViews.research);
    assert.ok(prepared.roleViews.sports_scientist);
  });

  it('resolves persisted record using role view subdocument', () => {
    const prepared = prepareReportForPersistence(clinicalReport);
    const base = {
      ...prepared.safeReport,
      persistence_schema_version: PERSISTENCE_SCHEMA_VERSION,
    };
    const resolved = resolvePersistedReportForViewer(base, 'clinical', prepared.roleViews.clinical);
    const section = resolved.sections.find((s) => s.section_id === 'injury_medical_summary');
    assert.ok(section);
    assert.match(section!.body.en, /hamstring|Injury|إصابة/i);
  });

  it('rejects oversized payload estimates', () => {
    const result = validateReportPayloadSize(960_000);
    assert.equal(result.ok, false);
    assert.equal(result.code, 'report_oversized');
  });
});
