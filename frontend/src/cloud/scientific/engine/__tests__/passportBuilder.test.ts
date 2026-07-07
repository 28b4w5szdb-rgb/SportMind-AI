/**
 * Passport builder unit tests (Phase 6D.1).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildAthletePassport } from '../passportBuilder';
import type { PassportBuildContext } from '../../models/passport/PassportBuildInput';

const baseContext: PassportBuildContext = {
  orgId: 'org_test',
  athleteId: 'athlete_1',
  viewerRole: 'coach',
  sources: {
    athlete: {
      id: 'athlete_1',
      first_name: 'Sara',
      last_name: 'Ali',
      position: 'Forward',
      status: 'active',
      height_cm: 170,
      weight_kg: 62,
      availability_status: 'available',
      consent_status: 'granted',
    },
    tests: [
      {
        id: 't1',
        athlete_id: 'athlete_1',
        athlete_name: 'Sara Ali',
        test_type: '30m Sprint',
        test_type_key: 'sprint30',
        value: 4.2,
        unit: 's',
        date: '2026-07-01',
      },
    ],
    analytics: {
      overall: {
        score: 78,
        maxScore: 100,
        percentileLabel: 'good',
        color: '#10B981',
        trend: 'up',
        trendDelta: 3,
        modules: [
          { id: 'readiness', labelKey: 'x', score: 82, maxScore: 100, status: 'good', trend: 'stable', trendDelta: 0, color: '#10B981', weight: 1 },
          { id: 'injury_risk', labelKey: 'x', score: 25, maxScore: 100, status: 'good', trend: 'stable', trendDelta: 0, color: '#10B981', weight: 1 },
        ],
      },
      kpis: [
        { id: 'readiness', labelKey: 'x', value: 82, displayValue: '82', status: 'good', trend: 'stable', trendDelta: 0, color: '#10B981', icon: 'pulse' },
      ],
      recommendations: [],
      decision: { level: 'ready_to_train', titleKey: 'x', bodyKey: 'x', color: '#10B981', confidence: 0.9 },
      benchmarks: [],
      trends: [],
      strengths: [],
      weaknesses: [],
      radarAxes: [],
    },
    checkIn: {
      id: 'c1',
      athlete_id: 'athlete_1',
      date: '2026-07-07',
      created_at: '2026-07-07T08:00:00Z',
      sleep_duration_hours: 8,
      sleep_quality: 7,
      fatigue: 3,
      muscle_soreness: 2,
      mood: 8,
      stress: 3,
      pain_level: 1,
      hydration_liters: 2.5,
      morning_heart_rate: 52,
      rpe: 4,
    },
    injuries: [],
  },
};

describe('passportBuilder', () => {
  it('builds passport with identity and performance sections', () => {
    const passport = buildAthletePassport(baseContext);
    assert.equal(passport.athlete_id, 'athlete_1');
    assert.equal(passport.sections.identity.is_missing, false);
    assert.equal(passport.sections.performance.is_missing, false);
    assert.ok(passport.sections.identity.summary_fields.some((f) => f.key === 'full_name'));
  });

  it('marks laboratory as missing when no data', () => {
    const passport = buildAthletePassport(baseContext);
    assert.equal(passport.sections.laboratory.is_missing, true);
  });

  it('includes source references without duplicating raw payloads', () => {
    const passport = buildAthletePassport(baseContext);
    const perf = passport.sections.performance;
    assert.ok(perf.source_references.length > 0);
    assert.ok(!('raw_measurements' in (perf as unknown as Record<string, unknown>)));
  });

  it('redacts clinical injury details for coach view', () => {
    const ctx: PassportBuildContext = {
      ...baseContext,
      sources: {
        ...baseContext.sources,
        injuries: [
          {
            id: 'inj1',
            athlete_id: 'athlete_1',
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
    };
    const passport = buildAthletePassport(ctx);
    const injury = passport.sections.injury;
    assert.ok(!injury.summary_fields.some((f) => f.key === 'pain_level'));
    assert.ok(injury.summary_fields.some((f) => f.key === 'rtp_phase' || f.key === 'active_injuries'));
  });
});
