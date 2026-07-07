/**
 * Safe Prompt Builder — PII redaction + safety + contract-compliant prompts (Phase 9.2).
 */

import type { SdssDecisionContext } from '../models/DecisionContext';
import type { SdssRecommendationCategory } from '../models/SdssRecommendation';
import { SDSS_PROMPT_VERSION } from '../prompt/promptBuilder';
import type { SafePromptBundle, SafePromptPipelineResult } from './privacyModels';
import {
  createRedactionSession,
  redactDecisionContextForOutbound,
  redactUserQuery,
} from './piiRedactionEngine';
import { buildPromptContractPayload, validatePromptContract } from './promptContract';
import { buildPromptFingerprint } from './promptFingerprint';
import { validatePromptSafety } from './promptSafetyEngine';

function roleInstructions(role: SdssDecisionContext['viewer_role'], locale: SdssDecisionContext['locale']): string {
  const en: Record<SdssDecisionContext['viewer_role'], string> = {
    coach: 'Provide practical training decisions with clear actions.',
    sports_scientist: 'Include scientific reasoning, metrics, and evidence gaps.',
    physiotherapist: 'Focus on load management, recovery, and return-to-play readiness.',
    doctor: 'Include medical disclaimer; never diagnose or prescribe medication.',
    researcher: 'Note evidence tier limitations and research-grade caveats.',
    athlete: 'Use simple language; avoid jargon.',
    org_admin: 'Summarize squad-level risk and compliance.',
  };
  if (locale === 'ar') {
    return `Viewer role: ${role}. Provide evidence-based recommendations only.`;
  }
  return `Viewer role: ${role}. ${en[role]}`;
}

function safetyInstructions(locale: SdssDecisionContext['locale']): string {
  const en =
    'NEVER diagnose disease. NEVER prescribe medication. NEVER replace a clinician. Ground every recommendation in provided scientific context only. State evidence used and missing. Include confidence level.';
  const ar =
    'Do not diagnose. Do not prescribe. Do not replace clinicians. Base all recommendations on provided scientific context.';
  if (locale === 'ar') return ar;
  if (locale === 'bilingual') return `${en}\n${ar}`;
  return en;
}

/** Build privacy-safe outbound prompt pipeline before AI provider invocation. */
export function buildSafePromptPipeline(
  context: SdssDecisionContext,
  userQuery: string,
  allowedCategories?: SdssRecommendationCategory[]
): SafePromptPipelineResult {
  const session = createRedactionSession();
  const redactedContext = redactDecisionContextForOutbound(context, session);
  const queryRedaction = redactUserQuery(userQuery, context, session);

  const contractPayload = buildPromptContractPayload(
    redactedContext,
    queryRedaction.redacted_text,
    allowedCategories
  );

  const contractCheck = validatePromptContract(contractPayload);
  const systemPrompt =
    `You are SportMind AI — a Scientific Decision Support System (SDSS), not a general chatbot.\n` +
    `${roleInstructions(redactedContext.viewer_role, redactedContext.locale)}\n` +
    `${safetyInstructions(redactedContext.locale)}\n` +
    `Evidence summary: ${contractPayload.evidence_summary}\n` +
    `Allowed categories: ${contractPayload.allowed_recommendation_categories.join(', ')}.`;

  const userPrompt =
    `Scientific context (privacy-safe, contract-compliant JSON):\n` +
    `${JSON.stringify(contractPayload, null, 2)}\n\n` +
    `Respond with structured recommendations including: why, evidence used, evidence missing, confidence, limitations, and recommended action.`;

  const safety = validatePromptSafety(userQuery, JSON.stringify(contractPayload), context.locale);
  if (!contractCheck.valid) {
    safety.safe = false;
    safety.reasons.push('contract_violation');
    safety.messages.push(`Contract violation: ${contractCheck.violations.join(', ')}`);
  }

  const fingerprint = buildPromptFingerprint(contractPayload, systemPrompt);

  const prompt: SafePromptBundle = {
    system_prompt: systemPrompt,
    user_prompt: userPrompt,
    locale: context.locale,
    prompt_version: SDSS_PROMPT_VERSION,
    context_id: redactedContext.context_id,
    contract_payload: contractPayload,
    fingerprint,
    safety,
    redaction_count: session.getEntries().length,
    outbound_safe: safety.safe && contractCheck.valid,
  };

  return {
    prompt,
    safety,
    redaction_map: session.getEntries(),
  };
}
