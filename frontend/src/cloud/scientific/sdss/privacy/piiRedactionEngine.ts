/**
 * PII Redaction Engine — deterministic placeholder masking (Phase 9.2).
 */

import { createHash } from 'node:crypto';

import type { SdssDecisionContext } from '../models/DecisionContext';
import type { PiiCategory, PiiRedactionResult, RedactionEntry } from './privacyModels';
import { PII_PATTERNS, PLACEHOLDER_PREFIX } from './privacyPolicy';

/** Per-request session ensuring same identifier → same placeholder. */
export class RedactionSession {
  private counters: Partial<Record<PiiCategory, number>> = {};
  private valueToPlaceholder = new Map<string, string>();
  private entries: RedactionEntry[] = [];

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex').slice(0, 12);
  }

  /** Redact a known value with deterministic placeholder within this session. */
  redactValue(value: string | null | undefined, category: PiiCategory): string | null {
    if (value == null || value.trim() === '') return null;
    const trimmed = value.trim();
    const existing = this.valueToPlaceholder.get(trimmed);
    if (existing) return existing;

    this.counters[category] = (this.counters[category] ?? 0) + 1;
    const prefix = PLACEHOLDER_PREFIX[category] ?? category;
    const placeholder = `${prefix}_${String(this.counters[category]).padStart(3, '0')}`;
    this.valueToPlaceholder.set(trimmed, placeholder);
    this.entries.push({
      category,
      original_hash: this.hash(trimmed),
      placeholder,
    });
    return placeholder;
  }

  getEntries(): RedactionEntry[] {
    return [...this.entries];
  }

  getPlaceholder(value: string): string | undefined {
    return this.valueToPlaceholder.get(value.trim());
  }

  /** Redact pattern-based PII in free text (emails, phones, etc.). */
  redactText(text: string): PiiRedactionResult {
    let redacted = text;
    for (const { category, pattern } of PII_PATTERNS) {
      const re = new RegExp(pattern.source, pattern.flags);
      redacted = redacted.replace(re, (match) => this.redactValue(match, category as PiiCategory) ?? match);
    }
    return {
      redacted_text: redacted,
      redaction_map: this.getEntries(),
      redaction_count: this.entries.length,
    };
  }
}

function redactContextKnownFields(ctx: SdssDecisionContext, session: RedactionSession): void {
  if (ctx.athlete_display_name) session.redactValue(ctx.athlete_display_name, 'ATHLETE');
  if (ctx.athlete_id) session.redactValue(ctx.athlete_id, 'CUSTOM_ID');
  if (ctx.organization_id) session.redactValue(ctx.organization_id, 'ORG');
}

function replaceKnownValues(text: string, ctx: SdssDecisionContext, session: RedactionSession): string {
  let out = text;
  if (ctx.athlete_display_name) {
    const ph = session.getPlaceholder(ctx.athlete_display_name) ?? session.redactValue(ctx.athlete_display_name, 'ATHLETE');
    if (ph) out = out.split(ctx.athlete_display_name).join(ph);
  }
  return out;
}

/** Redact all known context PII and pattern matches in user query. */
export function redactUserQuery(query: string, ctx: SdssDecisionContext, session: RedactionSession): PiiRedactionResult {
  redactContextKnownFields(ctx, session);
  const withNames = replaceKnownValues(query, ctx, session);
  return session.redactText(withNames);
}

/** Redact timeline/assessment identifiers and free-text fields for outbound prompts. */
export function redactDecisionContextForOutbound(
  ctx: SdssDecisionContext,
  session: RedactionSession
): SdssDecisionContext {
  redactContextKnownFields(ctx, session);

  const athletePh = ctx.athlete_display_name
    ? session.redactValue(ctx.athlete_display_name, 'ATHLETE')
    : null;

  const redactStr = (s: string) => {
    const withNames = replaceKnownValues(s, ctx, session);
    return session.redactText(withNames).redacted_text;
  };

  return {
    ...ctx,
    context_id: session.redactValue(ctx.context_id, 'CUSTOM_ID') ?? 'CTX_REDACTED',
    organization_id: session.redactValue(ctx.organization_id, 'ORG') ?? 'ORG_REDACTED',
    athlete_id: ctx.athlete_id ? session.redactValue(ctx.athlete_id, 'CUSTOM_ID') : null,
    athlete_display_name: athletePh,
    timeline_events: ctx.timeline_events.map((e) => ({
      ...e,
      event_id: session.redactValue(e.event_id, 'CUSTOM_ID') ?? 'EVENT_REDACTED',
      title: redactStr(e.title),
      summary: redactStr(e.summary),
    })),
    latest_assessments: ctx.latest_assessments.map((a) => ({
      ...a,
      session_id: session.redactValue(a.session_id, 'CUSTOM_ID') ?? 'SESSION_REDACTED',
    })),
    laboratory_notes: ctx.laboratory_notes.map(redactStr),
    wearables: ctx.wearables
      ? {
          ...ctx.wearables,
          provider: ctx.wearables.provider ? redactStr(ctx.wearables.provider) : null,
          last_sync: null,
        }
      : null,
  };
}

export function createRedactionSession(): RedactionSession {
  return new RedactionSession();
}
