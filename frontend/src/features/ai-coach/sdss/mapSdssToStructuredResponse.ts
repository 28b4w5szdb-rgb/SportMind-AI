/**
 * Maps SSDI recommendation bundle → existing AI Coach structured UI (Phase 9.0).
 */

import type { ScientificRecommendation } from '@/src/cloud/scientific/sdss/models/SdssRecommendation';
import type { SdssRecommendationBundle } from '@/src/cloud/scientific/sdss/models/SdssRecommendation';
import type { StructuredAiResponse, StructuredAiSection } from '../types';

function section(id: StructuredAiSection['id'], titleKey: string, items: string[]): StructuredAiSection | null {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return null;
  return { id, titleKey, items: filtered };
}

function formatRec(rec: ScientificRecommendation): string[] {
  return [
    `• ${rec.title}`,
    rec.summary,
    `Action: ${rec.recommended_action}`,
    `Why: ${rec.explainability.why}`,
    `Evidence: ${rec.explainability.evidence_used.join(', ') || '—'}`,
    `Missing: ${rec.explainability.evidence_missing.join(', ') || '—'}`,
    `Confidence: ${rec.confidence}`,
    rec.explainability.alternative_interpretation
      ? `Alt: ${rec.explainability.alternative_interpretation}`
      : '',
    rec.limitations.length ? `Limits: ${rec.limitations.join('; ')}` : '',
    rec.disclaimer ? `⚠ ${rec.disclaimer}` : '',
  ].filter(Boolean);
}

function confidenceToPercent(conf: ScientificRecommendation['confidence']): number {
  switch (conf) {
    case 'very_high':
      return 92;
    case 'high':
      return 82;
    case 'moderate':
      return 68;
    case 'low':
      return 48;
    default:
      return 35;
  }
}

export function mapSdssBundleToStructuredResponse(bundle: SdssRecommendationBundle): StructuredAiResponse {
  const recItems = bundle.recommendations.flatMap(formatRec);
  const sections = [
    section('summary', 'aiCoach.sections.summary', [bundle.evidence_summary]),
    section('recommendations', 'aiCoach.sections.recommendations', recItems),
    section('confidence', 'aiCoach.sections.confidence', [
      bundle.recommendations.map((r) => `${r.title}: ${r.confidence}`).join(' · '),
    ]),
    section('references', 'aiCoach.sections.references', [
      bundle.recommendations.flatMap((r) => r.citations_placeholder).join(' · ') || 'SportMind Scientific Core',
    ]),
    section('decision', 'aiCoach.sections.decision', [bundle.safety_disclaimer]),
  ].filter(Boolean) as StructuredAiSection[];

  const topConf = bundle.recommendations[0]?.confidence ?? 'moderate';

  return {
    sections,
    confidence: confidenceToPercent(topConf),
    referencePlaceholder: 'SportMind SSDI v1',
  };
}

export function mapSdssBundleToPlainText(bundle: SdssRecommendationBundle): string {
  return [
    bundle.evidence_summary,
    '',
    ...bundle.recommendations.map(
      (r) =>
        `${r.title}\n${r.summary}\n${r.recommended_action}\nWhy: ${r.explainability.why}\nConfidence: ${r.confidence}`
    ),
    '',
    bundle.safety_disclaimer,
  ].join('\n');
}
