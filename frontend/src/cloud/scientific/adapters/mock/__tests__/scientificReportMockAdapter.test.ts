/**
 * Scientific report mock repository unit tests (Phase 7.2).
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { buildScientificReport } from '@/src/cloud/scientific/engine/scientificReportBuilder';
import { buildAthletePassport } from '@/src/cloud/scientific/engine/passportBuilder';
import {
  clearScientificReportMockStore,
  createScientificReportMockRepository,
} from '@/src/cloud/scientific/adapters/mock/scientificReportMockAdapter';

const ORG = 'org_test';

function sampleReport() {
  const passport = buildAthletePassport({
    orgId: ORG,
    athleteId: 'a1',
    viewerRole: 'coach',
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
      injuries: [],
    },
  });

  return buildScientificReport({
    context: {
      orgId: ORG,
      reportType: 'athlete',
      athleteId: 'a1',
      dateRange: { from: '2026-06-01', to: '2026-07-07' },
      viewerRole: 'coach',
      generatedBy: 'Test',
    },
    sources: { passport, athleteDisplayName: 'Test Athlete' },
  });
}

describe('scientificReportMockRepository', () => {
  beforeEach(() => {
    clearScientificReportMockStore();
  });

  it('creates and retrieves report by id', async () => {
    const repo = createScientificReportMockRepository();
    const report = sampleReport();
    report.report_id = 'rep_1';

    await repo.createScientificReport({
      organizationId: ORG,
      report,
      summary: 'Summary',
      mockType: 'athlete',
    });

    const loaded = await repo.getScientificReportById(ORG, 'rep_1');
    assert.ok(loaded);
    assert.equal(loaded?.report_id, 'rep_1');
    assert.equal(loaded?.organization_id, ORG);
    assert.equal(loaded?.persistence_schema_version, '8.1');
  });

  it('lists reports by athlete', async () => {
    const repo = createScientificReportMockRepository();
    const report = sampleReport();
    report.report_id = 'rep_2';
    report.athlete_id = 'a1';

    await repo.createScientificReport({ organizationId: ORG, report, summary: 'S', mockType: 'athlete' });

    const rows = await repo.listReportsByAthlete(ORG, 'a1');
    assert.equal(rows.length, 1);
  });

  it('archives report with soft-delete status', async () => {
    const repo = createScientificReportMockRepository();
    const report = sampleReport();
    report.report_id = 'rep_3';

    await repo.createScientificReport({ organizationId: ORG, report, summary: 'S', mockType: 'athlete' });
    const archived = await repo.archiveScientificReport(ORG, 'rep_3');

    assert.equal(archived?.status, 'archived');
    const listed = await repo.listScientificReports(ORG);
    assert.equal(listed.length, 0);
  });
});
