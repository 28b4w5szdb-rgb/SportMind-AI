/**
 * Timeline access tests (Phase 6D.2).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildAthleteScientificTimeline } from '../../engine/scientificTimelineBuilder';
import { filterTimelineForViewer, summaryContainsClinicalDetail } from '../timelineAccess';
import type { TimelineBuildContext } from '../../models/timeline/TimelineBuildInput';

const ctx: TimelineBuildContext = {
  orgId: 'org_test',
  athleteId: 'a1',
  viewerRole: 'coach',
  sources: {
    tests: [],
    injuries: [
      {
        id: 'inj1',
        athlete_id: 'a1',
        injury_date: '2026-06-01',
        body_region: 'knee',
        tissue_type: 'ligament',
        severity_grade: 'grade_1',
        pain_level: 5,
        swelling: 2,
        rom_limitation: 1,
        status: 'active',
        expected_absence_days: 7,
        rtp_phase: 'phase_1',
        created_at: '2026-06-01T00:00:00Z',
      },
    ],
  },
};

describe('timelineAccess', () => {
  it('hides pain metrics for coach injury events', () => {
    const timeline = buildAthleteScientificTimeline({ ...ctx, viewerRole: 'clinical' });
    const filtered = filterTimelineForViewer(timeline, 'coach');
    const injury = filtered.events.find((e) => e.event_type === 'injury');
    assert.ok(injury);
    assert.equal(injury.key_metrics.some((m) => m.key === 'pain'), false);
  });

  it('excludes clinical injury events from research view', () => {
    const timeline = buildAthleteScientificTimeline({ ...ctx, viewerRole: 'clinical' });
    const filtered = filterTimelineForViewer(timeline, 'research');
    const injury = filtered.events.find((e) => e.event_type === 'injury');
    assert.equal(injury, undefined);
  });

  it('detects clinical detail patterns in summaries', () => {
    assert.equal(summaryContainsClinicalDetail('pain 6/10'), true);
    assert.equal(summaryContainsClinicalDetail('RTP phase_2'), false);
  });
});
