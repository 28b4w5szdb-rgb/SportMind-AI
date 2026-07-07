/**
 * SSDI v1 — Scientific Decision Support recommendation models (Phase 9.0).
 * AI consumes Scientific Core outputs; never replaces calculations or SSID.
 */

import type { EvidenceTier } from '../../models/common';

export const SDSS_VERSION = '1.0.0';

export type SdssRecommendationCategory =
  | 'training'
  | 'recovery'
  | 'readiness'
  | 'monitoring'
  | 'testing'
  | 'nutrition'
  | 'hydration'
  | 'injury_risk'
  | 'return_to_play'
  | 'travel'
  | 'sleep'
  | 'workload'
  | 'sports_medicine'
  | 'research_notes';

export type SdssConfidenceLevel =
  | 'very_high'
  | 'high'
  | 'moderate'
  | 'low'
  | 'insufficient_evidence';

export type SdssPriority = 'critical' | 'high' | 'medium' | 'low';

export type SdssViewerRole =
  | 'coach'
  | 'sports_scientist'
  | 'physiotherapist'
  | 'doctor'
  | 'researcher'
  | 'athlete'
  | 'org_admin';

export interface SdssExplainability {
  why: string;
  evidence_used: string[];
  evidence_missing: string[];
  confidence: SdssConfidenceLevel;
  confidence_rationale: string;
  alternative_interpretation?: string | null;
}

export interface SdssVersionMetadata {
  sdss_version: string;
  generated_at: string;
  provider_id: string;
  prompt_version: string;
}

/** Canonical SSDI recommendation — grounded in Scientific Core context. */
export interface ScientificRecommendation {
  id: string;
  category: SdssRecommendationCategory;
  title: string;
  summary: string;
  scientific_reasoning: string;
  recommended_action: string;
  priority: SdssPriority;
  confidence: SdssConfidenceLevel;
  evidence_level: EvidenceTier;
  affected_metrics: string[];
  related_assessments: string[];
  limitations: string[];
  citations_placeholder: string[];
  explainability: SdssExplainability;
  version_metadata: SdssVersionMetadata;
  disclaimer?: string | null;
}

export interface SdssRecommendationBundle {
  recommendations: ScientificRecommendation[];
  evidence_summary: string;
  safety_disclaimer: string;
  viewer_role: SdssViewerRole;
  locale: 'en' | 'ar' | 'bilingual';
}
