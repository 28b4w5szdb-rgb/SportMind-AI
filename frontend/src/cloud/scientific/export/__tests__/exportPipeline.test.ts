/**
 * Unified export pipeline tests (Phase 7.3).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildScientificReport } from '../../engine/scientificReportBuilder';
import { buildAthletePassport } from '../../engine/passportBuilder';
import { filterReportForViewer } from '../../security/reportAccess';
import {
  ALL_EXPORT_FORMATS,
  buildExportRequest,
  previewExportDocument,
  runExportPipeline,
} from '../index';
import { EXPORT_TEMPLATES } from '../templates/exportTemplates';
import { formatReportForExport } from '../formatting/reportFormatter';
import { createMockExportAdapterRegistry } from '../adapters/mock/mockExportAdapters';
import { applyExportRoleFilter } from '../pipeline/roleFilter';
import { applyExportEvidenceFilter } from '../pipeline/evidenceFilter';
import { mapReportThemeToTemplate } from '../pipeline/templateResolver';

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
    injuries: [],
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

describe('exportPipeline', () => {
  it('registers all export format adapters', () => {
    const registry = createMockExportAdapterRegistry();
    assert.deepEqual(registry.listFormats().sort(), [...ALL_EXPORT_FORMATS].sort());
  });

  it('defines five export templates', () => {
    assert.equal(Object.keys(EXPORT_TEMPLATES).length, 5);
    assert.ok(EXPORT_TEMPLATES.club_standard);
    assert.ok(EXPORT_TEMPLATES.executive_summary);
  });

  it('maps report themes to export templates', () => {
    assert.equal(mapReportThemeToTemplate('medical'), 'sports_medicine');
    assert.equal(mapReportThemeToTemplate('research'), 'research');
    assert.equal(mapReportThemeToTemplate('professional'), 'club_standard');
  });

  it('formats report with bilingual blocks', () => {
    const doc = formatReportForExport(clinicalReport, 'bilingual');
    assert.ok(doc.blocks.length > 0);
    assert.equal(doc.locale_mode, 'bilingual');
    assert.ok(doc.disclaimer.length > 0);
  });

  it('role filter never exposes more than viewer role allows', () => {
    const request = buildExportRequest(clinicalReport, {
      format: 'pdf',
      requestedBy: 'coach1',
    });
    request.viewer_role = 'coach';
    const filtered = applyExportRoleFilter(clinicalReport, request);
    const direct = filterReportForViewer(clinicalReport, 'coach');
    assert.equal(filtered.sections.length, direct.sections.length);
  });

  it('evidence filter redacts athlete profile for research dataset', () => {
    const filtered = applyExportEvidenceFilter(clinicalReport, 'research_dataset');
    const profile = filtered.sections.find((s) => s.section_id === 'athlete_profile');
    assert.ok(profile);
    assert.match(profile!.body.en, /De-identified/);
  });

  it('runs full pipeline and returns prepared artifact metadata', async () => {
    const request = buildExportRequest(clinicalReport, {
      format: 'pdf',
      templateId: 'sports_medicine',
      localeMode: 'bilingual',
      requestedBy: 'user1',
    });

    const result = await runExportPipeline({ report: clinicalReport, request });

    assert.equal(result.job.status, 'prepared');
    assert.ok(result.artifact);
    assert.equal(result.artifact!.format, 'pdf');
    assert.equal(result.artifact!.file_url, null);
    assert.equal(result.format_coming_soon, true);
    assert.match(result.status_message.en, /Export prepared/i);
  });

  it('prepares all export formats without binary output', async () => {
    for (const format of ALL_EXPORT_FORMATS) {
      const request = buildExportRequest(clinicalReport, { format, requestedBy: 'test' });
      const result = await runExportPipeline({ report: clinicalReport, request });
      assert.equal(result.job.status, 'prepared', `format ${format} should prepare`);
      assert.ok(result.artifact?.file_name_placeholder);
      assert.equal(result.artifact?.file_url, null);
    }
  });

  it('previewExportDocument applies role and evidence filters', () => {
    const request = buildExportRequest(clinicalReport, {
      format: 'json_archive',
      requestedBy: 'researcher',
    });
    request.viewer_role = 'research';
    const doc = previewExportDocument(clinicalReport, request);
    assert.ok(doc.blocks.length > 0);
  });
});
