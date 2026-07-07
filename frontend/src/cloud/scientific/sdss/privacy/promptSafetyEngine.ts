/**
 * Prompt Safety Engine — deterministic outbound prompt validation (Phase 9.2).
 */

import type { PromptSafetyResult } from './privacyModels';
import { PROMPT_SAFETY_RULES } from './privacyPolicy';

/** Validate user query and contract payload for forbidden content (excludes system boilerplate). */
export function validatePromptSafety(
  userQuery: string,
  contractPayloadJson: string,
  locale: 'en' | 'ar' | 'bilingual' = 'en'
): PromptSafetyResult {
  const combined = `${userQuery}\n${contractPayloadJson}`;
  const reasons: PromptSafetyResult['reasons'] = [];
  const messages: string[] = [];

  for (const rule of PROMPT_SAFETY_RULES) {
    if (rule.pattern.test(combined)) {
      reasons.push(rule.reason);
      messages.push(locale === 'ar' ? rule.message_ar : rule.message_en);
    }
  }

  return {
    safe: reasons.length === 0,
    reasons,
    messages,
  };
}

/** Quick check for user query only (pre-pipeline). */
export function validateUserQuerySafety(
  userQuery: string,
  locale: 'en' | 'ar' | 'bilingual' = 'en'
): PromptSafetyResult {
  return validatePromptSafety(userQuery, '', locale);
}
