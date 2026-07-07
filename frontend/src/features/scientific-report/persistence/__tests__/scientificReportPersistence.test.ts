/**
 * Scientific report persistence unit tests (Phase 7.1).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildScientificReport } from '@/src/cloud/scientific/engine/scientificReportBuilder';
import { buildAthletePassport } from '@/src/cloud/scientific/engine/passportBuilder';
import type { PassportBuildContext } from '@/src/cloud/scientific/models/passport/PassportBuildInput';
import type { MockReport } from '@/src/data/mock/types';
import {
  isPersistedScientificReport,
  loadPersistedScientificReport,
  saveScientificReport,
} from '../scientificReportPersistence';
import { scientificReportToMockSections } from '../../utils/mapScientificToLegacy';
import { ATHLETE_SCIENTIFIC_SECTION_ORDER } from '../../constants/prefill';

const passportContext: PassportBuildContext = {
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
};

describe('scientificReportPersistence', () => {
  it('saves structured scientific report to mock store', async () => {
    const passport = buildAthletePassport(passportContext);
    const scientificReport = buildScientificReport({
      context: {
        orgId: 'org_test',
        reportType: 'athlete',
        athleteId: 'athlete_1',
        dateRange: { from: '2026-06-01', to: '2026-07-07' },
        viewerRole: 'coach',
        generatedBy: 'Test',
        sectionOrder: ATHLETE_SCIENTIFIC_SECTION_ORDER,
      },
      sources: { passport, athleteDisplayName: 'Sara Ali' },
    });

    const reports: MockReport[] = [];
    const addReport = (input: Omit<MockReport, 'id' | 'created_at' | 'status'>) => {
      const report: MockReport = {
        ...input,
        id: 'rep_test_1',
        status: 'draft',
        created_at: '2026-07-07T12:00:00Z',
      };
      reports.push(report);
      return report;
    };
    const updateReport = (id: string, patch: Partial<MockReport>) => {
      const idx = reports.findIndex((r) => r.id === id);
      if (idx >= 0) reports[idx] = { ...reports[idx], ...patch };
    };

    const saved = await saveScientificReport({
      config: {
        title: 'Test Report',
        reportType: 'athlete',
        scope: 'athlete',
        athleteId: 'athlete_1',
        teamId: null,
        dateFrom: '2026-06-01',
        dateTo: '2026-07-07',
        sectionOrder: ['athlete_profile', 'kpi', 'recommendations'],
        theme: 'professional',
        scientificSectionOrder: ATHLETE_SCIENTIFIC_SECTION_ORDER,
      },
      scientificReport,
      legacySections: scientificReportToMockSections(scientificReport),
      mockType: 'athlete',
      organizationId: 'org_test',
      addReport,
      updateReport,
    });

    assert.equal(saved.report.id, 'rep_test_1');
    assert.ok(isPersistedScientificReport(saved.report));
    assert.ok(saved.report.scientific_report);
    assert.equal(saved.report.scientific_report?.report_id, 'rep_test_1');
    assert.equal(saved.report.builder_meta?.isScientific, true);
    assert.equal(saved.report.builder_meta?.organizationId, 'org_test');
  });

  it('loads persisted scientific report by id', () => {
    const mock: MockReport = {
      id: 'rep_1',
      title: 'Saved',
      type: 'athlete',
      status: 'draft',
      created_at: '2026-07-07T12:00:00Z',
      summary: 'Summary',
      athlete_id: 'a1',
      sections: { athlete_summary: 'x', performance_tests: '', ai_insights: '', recommendations: '' },
      builder_meta: { isScientific: true, reportType: 'athlete', theme: 'professional', sectionOrder: [], dateFrom: '2026-06-01', dateTo: '2026-07-07', scope: 'athlete' },
      scientific_report: {
        report_id: 'rep_1',
        report_type: 'athlete',
        organization_id: 'org_test',
        athlete_id: 'a1',
        date_range: { from: '2026-06-01', to: '2026-07-07' },
        title: { en: 'Saved', ar: 'Saved' },
        sections: [],
        visibility_profile: 'coach',
        evidence_summary: {
          primary_tier: 'field',
          tier_label: { en: 'Field', ar: 'Field' },
          disclaimer: { en: 'd', ar: 'd' },
          source_count: 0,
          protocol_refs: [],
        },
        source_references: [],
        generated_at: '2026-07-07T12:00:00Z',
        generated_by: 'Test',
        version_metadata: {
          report_schema_version: '1.0.0',
          builder_version: '7.0',
          sections_included: 0,
          sections_empty: 0,
        },
        viewer_role: 'coach',
      },
    };

    const loaded = loadPersistedScientificReport(mock);
    assert.ok(loaded);
    assert.equal(loaded?.report_id, 'rep_1');
  });
});
