/**
 * LLM response parser — maps provider JSON to SSDI bundle (Phase 9.3).
 */

import type { SdssDecisionContext } from '../models/DecisionContext';
import type {
  ScientificRecommendation,
  SdssRecommendationBundle,
  SdssConfidenceLevel,
  SdssRecommendationCategory,
} from '../models/SdssRecommendation';
import { SDSS_VERSION } from '../models/SdssRecommendation';
import { globalSafetyDisclaimer } from '../safety/safetyLayer';
import { evidenceSummaryText } from '../context/evidenceCollector';

const VALID_CATEGORIES = new Set<SdssRecommendationCategory>([
  'training', 'recovery', 'readiness', 'monitoring', 'testing', 'nutrition', 'hydration',
  'injury_risk', 'return_to_play', 'travel', 'sleep', 'workload', 'sports_medicine', 'research_notes',
]);

const VALID_CONFIDENCE = new Set<SdssConfidenceLevel>([
  'very_high', 'high', 'moderate', 'low', 'insufficient_evidence',
]);

interface LlmRecommendationItem {
  id?: string;
  category?: string;
  title?: string;
  summary?: string;
  scientific_reasoning?: string;
  recommended_action?: string;
  priority?: string;
  confidence?: string;
  affected_metrics?: string[];
  limitations?: string[];
  why?: string;
  evidence_used?: string[];
  evidence_missing?: string[];
}

function mapItem(item: LlmRecommendationItem, index: number, providerId: string): ScientificRecommendation {
  const category = VALID_CATEGORIES.has(item.category as SdssRecommendationCategory)
    ? (item.category as SdssRecommendationCategory)
    : 'monitoring';
  const confidence = VALID_CONFIDENCE.has(item.confidence as SdssConfidenceLevel)
    ? (item.confidence as SdssConfidenceLevel)
    : 'moderate';

  return {
    id: item.id ?? `llm_rec_${index + 1}`,
    category,
    title: item.title ?? 'Recommendation',
    summary: item.summary ?? '',
    scientific_reasoning: item.scientific_reasoning ?? item.summary ?? '',
    recommended_action: item.recommended_action ?? '',
    priority: (['critical', 'high', 'medium', 'low'].includes(item.priority ?? '') ? item.priority : 'medium') as ScientificRecommendation['priority'],
    confidence,
    evidence_level: 'field',
    affected_metrics: item.affected_metrics ?? [],
    related_assessments: [],
    limitations: item.limitations ?? [],
    citations_placeholder: ['LLM-generated — pending citation validation'],
    explainability: {
      why: item.why ?? item.summary ?? '',
      evidence_used: item.evidence_used ?? [],
      evidence_missing: item.evidence_missing ?? [],
      confidence,
      confidence_rationale: 'LLM provider response',
    },
    version_metadata: {
      sdss_version: SDSS_VERSION,
      generated_at: new Date().toISOString(),
      provider_id: providerId,
      prompt_version: '1.0.0',
    },
  };
}

/** Parse LLM JSON completion into SSDI recommendation bundle. */
export function parseLlmResponseToBundle(
  rawContent: string,
  context: SdssDecisionContext,
  providerId: string
): SdssRecommendationBundle {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error('validation: invalid JSON from LLM provider');
  }

  const obj = parsed as { recommendations?: LlmRecommendationItem[] };
  const items = obj.recommendations;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('validation: LLM response missing recommendations array');
  }

  const recommendations = items.map((item, i) => mapItem(item, i, providerId));

  return {
    recommendations,
    evidence_summary: evidenceSummaryText(context.evidence_summary, context.locale),
    safety_disclaimer: globalSafetyDisclaimer(context.locale),
    viewer_role: context.viewer_role,
    locale: context.locale,
  };
}
