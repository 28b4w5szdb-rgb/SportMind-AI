/**
 * Scientific Report builder unit tests (Phase 7.0).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildScientificReport, mapBuilderTypeToScientificType } from '../scientificReportBuilder';
import type { ReportBuildInput } from '../../models/report';
import { buildAthletePassport } from '../passportBuilder';
import type { PassportBuildContext } from '../../models/passport/PassportBuildInput';

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
        modules: [],
      },
      kpis: [],
      recommendations: [],
      decision: { level: 'ready_to_train', titleKey: 'x', bodyKey: 'x', color: '#10B981', confidence: 0.9 },
      benchmarks: [],
      trends: [],
      strengths: [],
      weaknesses: [],
      radarAxes: [],
    },
    injuries: [],
  },
};

function baseInput(type: import('../../models/report').ScientificReportType = 'athlete'): ReportBuildInput {
  const passport = buildAthletePassport(passportContext);
  return {
    context: {
      orgId: 'org_test',
      reportType: type,
      athleteId: 'athlete_1',
      dateRange: { from: '2026-06-01', to: '2026-07-07' },
      viewerRole: 'coach',
      generatedBy: 'Test User',
    },
    sources: {
      passport,
      athleteDisplayName: 'Sara Ali',
    },
  };
}

describe('scientificReportBuilder', () => {
  it('builds athlete report with cover and executive summary', () => {
    const report = buildScientificReport(baseInput('athlete'));
    assert.ok(report.report_id.startsWith('report_'));
    assert.equal(report.report_type, 'athlete');
    assert.ok(report.sections.some((s) => s.section_id === 'cover'));
    assert.ok(report.sections.some((s) => s.section_id === 'executive_summary'));
  });

  it('includes bilingual section titles and bodies', () => {
    const report = buildScientificReport(baseInput('performance'));
    const profile = report.sections.find((s) => s.section_id === 'athlete_profile');
    assert.ok(profile);
    assert.ok(profile.title.en.length > 0);
    assert.ok(profile.title.ar.length > 0);
    assert.ok(profile.body.en.length > 0);
    assert.ok(profile.body.ar.length > 0);
  });

  it('applies evidence summary with disclaimer', () => {
    const report = buildScientificReport(baseInput('recovery'));
    assert.ok(report.evidence_summary.disclaimer.en.includes('Field') || report.evidence_summary.disclaimer.en.includes('Screening'));
    assert.ok(report.evidence_summary.disclaimer.ar.length > 0);
  });

  it('includes source references without duplicating raw data', () => {
    const report = buildScientificReport(baseInput('sports_medicine'));
    assert.ok(report.source_references.length > 0);
    assert.ok(!('raw_measurements' in (report as unknown as Record<string, unknown>)));
  });

  it('maps builder types to scientific types', () => {
    assert.equal(mapBuilderTypeToScientificType('performance'), 'performance');
    assert.equal(mapBuilderTypeToScientificType('research'), 'research');
    assert.equal(mapBuilderTypeToScientificType('nutrition'), null);
  });

  it('builds research report with references section', () => {
    const report = buildScientificReport(baseInput('research'));
    assert.ok(report.sections.some((s) => s.section_id === 'references' || s.section_id === 'evidence_limitations'));
  });

  it('records version metadata from passport', () => {
    const report = buildScientificReport(baseInput());
    assert.equal(report.version_metadata.builder_version, '7.0');
    assert.ok(report.version_metadata.passport_builder_version);
  });
});
