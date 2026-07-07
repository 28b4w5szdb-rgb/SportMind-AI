/**
 * Evidence collector — summarizes available/missing scientific evidence (Phase 9.0).
 */

import type { EvidenceTier } from '../../models/common';
import type {
  DecisionContextEvidenceSummary,
  SdssDecisionContext,
} from '../models/DecisionContext';

const SOURCE_CHECKS: Array<{ key: string; present: (ctx: SdssDecisionContext) => boolean; tier: EvidenceTier }> = [
  { key: 'passport', present: (c) => c.passport_sections.some((s) => !s.is_missing), tier: 'screening' },
  { key: 'timeline', present: (c) => c.timeline_events.length > 0, tier: 'professional' },
  { key: 'assessments', present: (c) => c.latest_assessments.length > 0, tier: 'field' },
  { key: 'ssid', present: (c) => c.ssid_insights.length > 0, tier: 'professional' },
  { key: 'training_load', present: (c) => c.training_load?.acwr != null, tier: 'professional' },
  { key: 'recovery', present: (c) => c.recovery?.recovery_score != null, tier: 'field' },
  { key: 'nutrition', present: (c) => c.nutrition?.calories != null, tier: 'field' },
  { key: 'wearables', present: (c) => c.wearables?.last_sync != null, tier: 'field' },
  { key: 'laboratory', present: (c) => c.laboratory_notes.length > 0, tier: 'research' },
];

export function collectEvidenceSummary(context: SdssDecisionContext): DecisionContextEvidenceSummary {
  const available: string[] = [];
  const missing: string[] = [];
  const tierCounts: Partial<Record<EvidenceTier, number>> = {};

  for (const check of SOURCE_CHECKS) {
    if (check.present(context)) {
      available.push(check.key);
      tierCounts[check.tier] = (tierCounts[check.tier] ?? 0) + 1;
    } else {
      missing.push(check.key);
    }
  }

  const total = SOURCE_CHECKS.length;
  const completeness = Math.round((available.length / total) * 100);

  return {
    tier_counts: tierCounts,
    available_sources: available,
    missing_sources: missing,
    overall_completeness_pct: completeness,
  };
}

export function evidenceSummaryText(summary: DecisionContextEvidenceSummary, locale: 'en' | 'ar' | 'bilingual'): string {
  const en = `Evidence completeness ${summary.overall_completeness_pct}%. Available: ${summary.available_sources.join(', ') || 'none'}. Missing: ${summary.missing_sources.join(', ') || 'none'}.`;
  const ar = `اكتمال الأدلة ${summary.overall_completeness_pct}%. متوفر: ${summary.available_sources.join('، ') || 'لا شيء'}. مفقود: ${summary.missing_sources.join('، ') || 'لا شيء'}.`;
  if (locale === 'ar') return ar;
  if (locale === 'bilingual') return `${en}\n${ar}`;
  return en;
}
