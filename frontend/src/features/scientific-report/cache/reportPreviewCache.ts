/**
 * Report preview cache (Phase 8.3) — avoids rebuilding passport/timeline on title keystrokes.
 */

import type { ReportBuilderConfig } from '@/src/features/report-builder/types';
import type { AthletePassport } from '@/src/cloud/scientific/models/passport';
import type { AthleteScientificTimeline } from '@/src/cloud/scientific/models/timeline';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';

export interface ReportPreviewBundle {
  analytics: AthleteAnalyticsSnapshot;
  passport: AthletePassport;
  timeline: AthleteScientificTimeline;
}

const cache = new Map<string, ReportPreviewBundle>();
const MAX_ENTRIES = 8;

/** Content-only key — excludes title and cosmetic config fields. */
export function reportPreviewContentKey(config: ReportBuilderConfig): string {
  return [
    config.athleteId,
    config.scope,
    config.dateFrom ?? '',
    config.dateTo ?? '',
    config.sectionOrder.join(','),
    config.reportType ?? '',
    config.theme ?? '',
  ].join('|');
}

export function getCachedReportPreview(key: string): ReportPreviewBundle | undefined {
  return cache.get(key);
}

export function setCachedReportPreview(key: string, bundle: ReportPreviewBundle): void {
  cache.set(key, bundle);
  if (cache.size > MAX_ENTRIES) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
}

export function invalidateReportPreviewCache(): void {
  cache.clear();
}
