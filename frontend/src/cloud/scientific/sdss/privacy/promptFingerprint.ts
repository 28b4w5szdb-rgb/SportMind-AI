/**
 * Prompt Fingerprint — immutable outbound prompt metadata (Phase 9.2).
 */

import { createHash } from 'node:crypto';

import { VALIDATOR_VERSION } from '../models/Governance';
import { SDSS_PROMPT_VERSION } from '../prompt/promptBuilder';
import type { PromptFingerprint, SafePromptContractPayload } from './privacyModels';
import { PRIVACY_VERSION } from './privacyModels';

/** Generate deterministic fingerprint hash from contract payload and versions. */
export function computeFingerprintHash(payload: SafePromptContractPayload, systemPrompt: string): string {
  const canonical = JSON.stringify({
    payload,
    system_prompt: systemPrompt,
    prompt_version: SDSS_PROMPT_VERSION,
    privacy_version: PRIVACY_VERSION,
    governance_version: VALIDATOR_VERSION,
  });
  return createHash('sha256').update(canonical).digest('hex');
}

export function buildPromptFingerprint(
  payload: SafePromptContractPayload,
  systemPrompt: string
): PromptFingerprint {
  return Object.freeze({
    prompt_version: SDSS_PROMPT_VERSION,
    privacy_version: PRIVACY_VERSION,
    governance_version: VALIDATOR_VERSION,
    fingerprint_hash: computeFingerprintHash(payload, systemPrompt),
    timestamp: new Date().toISOString(),
  });
}
