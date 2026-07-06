import type { SsidCoachingDecisionId, SsidInterpretation, SsidMetricContext, SsidMetricId } from '../types';

const DEFAULT_REFERENCE_KEY = 'ssid.references.placeholder';
const DEFAULT_CONFIDENCE = 82;

export function metricBandKey(metricId: SsidMetricId, section: string, band: string): string {
  return `ssid.metrics.${metricId}.${section}.${band}`;
}

export function buildInterpretation(
  metricId: SsidMetricId,
  band: string,
  decision: SsidCoachingDecisionId,
  value: number | string,
  unit: string,
  context?: SsidMetricContext,
  confidence = DEFAULT_CONFIDENCE
): SsidInterpretation {
  return {
    metricId,
    result: value,
    unit,
    classificationId: band,
    classificationKey: metricBandKey(metricId, 'classifications', band),
    scientificMeaningKey: metricBandKey(metricId, 'meanings', band),
    physiologicalInterpretationKey: metricBandKey(metricId, 'physiology', band),
    performanceImpactKey: metricBandKey(metricId, 'performance', band),
    riskAnalysisKey: metricBandKey(metricId, 'risk', band),
    referenceComparisonKey: metricBandKey(metricId, 'reference', band),
    coachingDecision: decision,
    coachingDecisionKey: `ssid.decisions.${decision}`,
    aiRecommendationKey: metricBandKey(metricId, 'ai', band),
    recommendations: {
      immediateKey: metricBandKey(metricId, 'recs', `${band}.immediate`),
      weeklyKey: metricBandKey(metricId, 'recs', `${band}.weekly`),
      longTermKey: metricBandKey(metricId, 'recs', `${band}.longTerm`),
    },
    scientificReferenceKey: DEFAULT_REFERENCE_KEY,
    confidence: context?.referenceValue !== undefined ? Math.min(95, confidence + 5) : confidence,
    referenceValue: context?.referenceValue,
    referenceLabelKey: context?.referenceValue !== undefined ? `ssid.metrics.${metricId}.referenceLabel` : undefined,
  };
}

export function classificationLabel(interp: SsidInterpretation, isRTL: boolean): string {
  void isRTL;
  return interp.classificationKey;
}
