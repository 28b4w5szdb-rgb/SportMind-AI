import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_REPORT_LIST_LIMIT, DEFAULT_TIMELINE_EVENT_CAP } from '../../models/common/ListPagination';
import { reportPreviewContentKey } from '@/src/features/scientific-report/cache/reportPreviewCache';
import type { ReportBuilderConfig } from '@/src/features/report-builder/types';

describe('Phase 8.3 — Performance & Scalability', () => {
  it('report preview cache key ignores title-only changes', () => {
    const base: ReportBuilderConfig = {
      athleteId: 'a1',
      scope: 'athlete',
      title: 'Draft A',
      teamId: null,
      dateFrom: '2026-01-01',
      dateTo: '2026-06-01',
      sectionOrder: ['kpi'],
      reportType: 'performance',
      theme: 'professional',
    };
    const renamed = { ...base, title: 'Draft B' };
    assert.equal(reportPreviewContentKey(base), reportPreviewContentKey(renamed));
  });

  it('pagination defaults are defined', () => {
    assert.ok(DEFAULT_REPORT_LIST_LIMIT > 0);
    assert.ok(DEFAULT_TIMELINE_EVENT_CAP > 0);
  });
});
