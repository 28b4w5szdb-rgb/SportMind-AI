/**
 * Scientific Timeline builder tests (Phase 6D.2).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildAthleteScientificTimeline } from '../scientificTimelineBuilder';
import { filterTimelineForViewer } from '../../security/timelineAccess';
import type { TimelineBuildContext } from '../../models/timeline/TimelineBuildInput';

const baseContext: TimelineBuildContext = {
  orgId: 'org_test',
  athleteId: 'athlete_1',
  viewerRole: 'coach',
  sources: {
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
    checkIns: [
      {
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
    ],
    injuries: [],
    recommendations: [],
  },
};

describe('scientificTimelineBuilder', () => {
  it('builds chronological timeline with assessment and recovery events', () => {
    const timeline = buildAthleteScientificTimeline(baseContext);
    assert.ok(timeline.events.length >= 2);
    assert.ok(timeline.events.some((e) => e.event_type === 'assessment'));
    assert.ok(timeline.events.some((e) => e.event_type === 'recovery'));
  });

  it('includes source references without raw payloads', () => {
    const timeline = buildAthleteScientificTimeline(baseContext);
    const assessment = timeline.events.find((e) => e.event_type === 'assessment');
    assert.ok(assessment?.source_reference.collection);
    assert.ok(!('raw_measurements' in (assessment as unknown as Record<string, unknown>)));
  });

  it('sorts events by occurred_at descending', () => {
    const timeline = buildAthleteScientificTimeline(baseContext);
    for (let i = 1; i < timeline.events.length; i += 1) {
      assert.ok(timeline.events[i - 1].occurred_at >= timeline.events[i].occurred_at);
    }
  });

  it('redacts injury pain details for coach view via access layer', () => {
    const ctx: TimelineBuildContext = {
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
    const timeline = buildAthleteScientificTimeline(ctx);
    const filtered = filterTimelineForViewer(timeline, 'coach');
    const injury = filtered.events.find((e) => e.event_type === 'injury');
    assert.ok(injury);
    assert.ok(!injury.key_metrics.some((m) => m.key === 'pain'));
  });
});
