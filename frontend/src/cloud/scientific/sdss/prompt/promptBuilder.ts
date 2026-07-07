/**
 * SSDI prompt builder — constructs LLM-ready prompts without API calls (Phase 9.0).
 */

import type { SdssDecisionContext } from '../models/DecisionContext';
import { evidenceSummaryText } from '../context/evidenceCollector';

export const SDSS_PROMPT_VERSION = '1.0.0';

export interface SdssPromptBundle {
  system_prompt: string;
  user_prompt: string;
  locale: 'en' | 'ar' | 'bilingual';
  prompt_version: string;
  context_id: string;
}

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
    return `دور الم viewer: ${role}. قدم توصيات مبنية على الأدلة فقط.`;
  }
  return `Viewer role: ${role}. ${en[role]}`;
}

function safetyInstructions(locale: SdssDecisionContext['locale']): string {
  const en =
    'NEVER diagnose disease. NEVER prescribe medication. NEVER replace a clinician. Ground every recommendation in provided scientific context only. State evidence used and missing. Include confidence level.';
  const ar =
    'لا تشخّص الأمراض. لا تصف الأدوية. لا تحل محل الطبيب. كل توصية يجب أن تستند إلى السياق العلمي المقدم فقط.';
  if (locale === 'ar') return ar;
  if (locale === 'bilingual') return `${en}\n${ar}`;
  return en;
}

function serializeContext(ctx: SdssDecisionContext): string {
  return JSON.stringify(
    {
      athlete: ctx.athlete_display_name,
      passport_sections: ctx.passport_sections.filter((s) => !s.is_missing),
      timeline: ctx.timeline_events.slice(0, 10),
      assessments: ctx.latest_assessments,
      ssid: ctx.ssid_insights,
      training_load: ctx.training_load,
      recovery: ctx.recovery,
      nutrition: ctx.nutrition,
      wearables: ctx.wearables,
      trends: ctx.recent_trends,
      decision_level: ctx.analytics_decision_level,
      overall_score: ctx.analytics_overall_score,
      evidence: ctx.evidence_summary,
    },
    null,
    2
  );
}

/** Build prompt bundle for future OpenAI/Azure/local providers. */
export function buildSdssPrompt(
  context: SdssDecisionContext,
  userQuery: string,
  categories?: string[]
): SdssPromptBundle {
  const locale = context.locale;
  const categoryHint = categories?.length ? `Focus categories: ${categories.join(', ')}.` : '';

  const systemEn =
    `You are SportMind AI — a Scientific Decision Support System (SDSS), not a general chatbot.\n` +
    `${roleInstructions(context.viewer_role, locale)}\n` +
    `${safetyInstructions(locale)}\n` +
    `Evidence summary: ${evidenceSummaryText(context.evidence_summary, locale)}\n` +
    `${categoryHint}`;

  const userEn =
    `Scientific context (JSON, role-filtered):\n${serializeContext(context)}\n\n` +
    `User request: ${userQuery}\n\n` +
    `Respond with structured recommendations including: why, evidence used, evidence missing, confidence, limitations, and recommended action.`;

  return {
    system_prompt: systemEn,
    user_prompt: userEn,
    locale,
    prompt_version: SDSS_PROMPT_VERSION,
    context_id: context.context_id,
  };
}
