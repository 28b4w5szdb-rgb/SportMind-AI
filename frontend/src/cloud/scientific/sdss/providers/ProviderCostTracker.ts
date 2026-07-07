/**
 * Provider Cost Tracker — token and USD estimation (Phase 9.3).
 */

import type { AiProviderId } from './aiProviderContract';
import type { ProviderCostRates } from './ProviderConfiguration';

export interface CostEstimate {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_usd: number;
}

export interface CostUsageSnapshot {
  daily_tokens: number;
  daily_estimated_usd: number;
  monthly_tokens: number;
  monthly_estimated_usd: number;
  by_provider: Partial<Record<AiProviderId, { tokens: number; usd: number }>>;
  by_organization: Record<string, { tokens: number; usd: number }>;
}

function estimateTokensFromText(text: string): number {
  return Math.ceil(text.length / 4);
}

export function estimateCost(
  inputText: string,
  outputText: string,
  rates: ProviderCostRates
): CostEstimate {
  const input_tokens = estimateTokensFromText(inputText);
  const output_tokens = estimateTokensFromText(outputText);
  const total_tokens = input_tokens + output_tokens;
  const estimated_usd =
    (input_tokens / 1_000_000) * rates.input_usd_per_1m_tokens +
    (output_tokens / 1_000_000) * rates.output_usd_per_1m_tokens;
  return { input_tokens, output_tokens, total_tokens, estimated_usd };
}

export class ProviderCostTracker {
  private dailyTokens = 0;
  private dailyUsd = 0;
  private monthlyTokens = 0;
  private monthlyUsd = 0;
  private dayKey = new Date().toISOString().slice(0, 10);
  private monthKey = new Date().toISOString().slice(0, 7);
  private byProvider: Partial<Record<AiProviderId, { tokens: number; usd: number }>> = {};
  private byOrganization: Record<string, { tokens: number; usd: number }> = {};

  constructor(private readonly rates: ProviderCostRates) {}

  record(
    providerId: AiProviderId,
    inputText: string,
    outputText: string,
    organizationId?: string
  ): CostEstimate {
    this.rollPeriods();
    const estimate = estimateCost(inputText, outputText, this.rates);
    this.dailyTokens += estimate.total_tokens;
    this.dailyUsd += estimate.estimated_usd;
    this.monthlyTokens += estimate.total_tokens;
    this.monthlyUsd += estimate.estimated_usd;

    const prov = this.byProvider[providerId] ?? { tokens: 0, usd: 0 };
    prov.tokens += estimate.total_tokens;
    prov.usd += estimate.estimated_usd;
    this.byProvider[providerId] = prov;

    if (organizationId) {
      const org = this.byOrganization[organizationId] ?? { tokens: 0, usd: 0 };
      org.tokens += estimate.total_tokens;
      org.usd += estimate.estimated_usd;
      this.byOrganization[organizationId] = org;
    }

    return estimate;
  }

  snapshot(): CostUsageSnapshot {
    this.rollPeriods();
    return {
      daily_tokens: this.dailyTokens,
      daily_estimated_usd: this.dailyUsd,
      monthly_tokens: this.monthlyTokens,
      monthly_estimated_usd: this.monthlyUsd,
      by_provider: { ...this.byProvider },
      by_organization: { ...this.byOrganization },
    };
  }

  reset(): void {
    this.dailyTokens = 0;
    this.dailyUsd = 0;
    this.monthlyTokens = 0;
    this.monthlyUsd = 0;
    this.byProvider = {};
    this.byOrganization = {};
  }

  private rollPeriods(): void {
    const dk = new Date().toISOString().slice(0, 10);
    const mk = new Date().toISOString().slice(0, 7);
    if (this.dayKey !== dk) {
      this.dayKey = dk;
      this.dailyTokens = 0;
      this.dailyUsd = 0;
    }
    if (this.monthKey !== mk) {
      this.monthKey = mk;
      this.monthlyTokens = 0;
      this.monthlyUsd = 0;
    }
  }
}

let costTrackerSingleton: ProviderCostTracker | null = null;

export function getProviderCostTracker(rates: ProviderCostRates): ProviderCostTracker {
  if (!costTrackerSingleton) costTrackerSingleton = new ProviderCostTracker(rates);
  return costTrackerSingleton;
}

export function resetProviderCostTracker(): void {
  costTrackerSingleton?.reset();
  costTrackerSingleton = null;
}
