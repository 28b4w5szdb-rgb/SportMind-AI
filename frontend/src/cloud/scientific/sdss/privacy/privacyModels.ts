/**
 * SSDI Privacy & Prompt Safety models (Phase 9.2).
 */

import type { SdssRecommendationCategory, SdssViewerRole } from '../models/SdssRecommendation';
import type { SdssPromptBundle } from '../prompt/promptBuilder';

export const PRIVACY_VERSION = '1.0.0';

export type PiiCategory =
  | 'ATHLETE'
  | 'TEAM'
  | 'ORG'
  | 'COACH'
  | 'RESEARCHER'
  | 'PHYSICIAN'
  | 'PHYSIOTHERAPIST'
  | 'EMAIL'
  | 'PHONE'
  | 'ADDRESS'
  | 'LOCATION'
  | 'DOB'
  | 'PASSPORT'
  | 'NATIONAL_ID'
  | 'MEDICAL_RECORD'
  | 'CUSTOM_ID';

export interface RedactionEntry {
  category: PiiCategory;
  original_hash: string;
  placeholder: string;
}

export interface PiiRedactionResult {
  redacted_text: string;
  redaction_map: RedactionEntry[];
  redaction_count: number;
}

export type PromptSafetyReason =
  | 'diagnosis_request'
  | 'medication_request'
  | 'fabricated_laboratory'
  | 'fabricated_evidence'
  | 'override_scientific_core'
  | 'hidden_rbac_exposure'
  | 'confidential_medical'
  | 'governance_bypass'
  | 'evidence_requirement_bypass'
  | 'forbidden_internal_path'
  | 'forbidden_raw_document'
  | 'contract_violation';

export interface PromptSafetyResult {
  safe: boolean;
  reasons: PromptSafetyReason[];
  messages: string[];
}

/** Contract-compliant outbound prompt payload — no raw IDs or hidden fields. */
export interface SafePromptContractPayload {
  scientific_context: {
    passport_sections: Array<{ title: string; field_count: number; confidence: string }>;
    timeline_summaries: Array<{ event_type: string; title: string; summary: string; severity: string }>;
    assessments: Array<{ assessment_key: string; metric_key: string; value: number; unit: string; normative_band: string | null }>;
    ssid_insights: Array<{ metric_key: string; classification_id: string; risk_level: string }>;
    training_load: { acwr: number | null; compliance_percent: number | null } | null;
    recovery: { recovery_score: number | null; fatigue: number | null; sleep_hours: number | null } | null;
    nutrition: { calories: number | null; protein_g: number | null; hydration_liters: number | null } | null;
    wearables: { provider: string | null; recovery_score: number | null } | null;
    decision_level: string | null;
    overall_score: number | null;
  };
  evidence_summary: string;
  available_metrics: string[];
  missing_metrics: string[];
  viewer_role: SdssViewerRole;
  language: 'en' | 'ar' | 'bilingual';
  allowed_recommendation_categories: SdssRecommendationCategory[];
  user_request: string;
}

export interface PromptFingerprint {
  prompt_version: string;
  privacy_version: string;
  governance_version: string;
  fingerprint_hash: string;
  timestamp: string;
}

export interface SafePromptBundle extends SdssPromptBundle {
  contract_payload: SafePromptContractPayload;
  fingerprint: PromptFingerprint;
  safety: PromptSafetyResult;
  redaction_count: number;
  outbound_safe: boolean;
}

export interface SafePromptPipelineResult {
  prompt: SafePromptBundle;
  safety: PromptSafetyResult;
  redaction_map: RedactionEntry[];
}
