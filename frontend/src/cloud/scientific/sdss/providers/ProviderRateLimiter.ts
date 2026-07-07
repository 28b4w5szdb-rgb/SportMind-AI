/**
 * Provider Rate Limiter — RPM/RPH/token budgets (Phase 9.3).
 */

import type { ProviderRateLimitConfig } from './ProviderConfiguration';

export interface RateLimitScope {
  organization_id?: string;
  user_id?: string;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  reason?: string;
}

interface BucketState {
  minuteRequests: number[];
  hourRequests: number[];
  dailyTokens: number;
  dayKey: string;
}

function dayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function pruneTimestamps(timestamps: number[], windowMs: number, now: number): number[] {
  return timestamps.filter((t) => now - t <= windowMs);
}

export class ProviderRateLimiter {
  private global: BucketState = { minuteRequests: [], hourRequests: [], dailyTokens: 0, dayKey: dayKey() };
  private orgBuckets = new Map<string, BucketState>();
  private userBuckets = new Map<string, BucketState>();

  constructor(private readonly config: ProviderRateLimitConfig) {}

  private bucket(map: Map<string, BucketState>, key: string | undefined): BucketState {
    if (!key) return this.global;
    const store = map === this.orgBuckets ? this.orgBuckets : this.userBuckets;
    let b = store.get(key);
    const dk = dayKey();
    if (!b || b.dayKey !== dk) {
      b = { minuteRequests: [], hourRequests: [], dailyTokens: 0, dayKey: dk };
      store.set(key, b);
    }
    return b;
  }

  check(scope: RateLimitScope = {}): RateLimitCheckResult {
    const now = Date.now();
    const buckets = [this.global, this.bucket(this.orgBuckets, scope.organization_id), this.bucket(this.userBuckets, scope.user_id)];

    for (const b of buckets) {
      b.minuteRequests = pruneTimestamps(b.minuteRequests, 60_000, now);
      b.hourRequests = pruneTimestamps(b.hourRequests, 3_600_000, now);
      if (b.minuteRequests.length >= this.config.requests_per_minute) {
        return { allowed: false, reason: 'rpm_exceeded' };
      }
      if (b.hourRequests.length >= this.config.requests_per_hour) {
        return { allowed: false, reason: 'rph_exceeded' };
      }
    }

    if (this.global.dailyTokens >= this.config.daily_token_budget) {
      return { allowed: false, reason: 'daily_token_budget_exceeded' };
    }
    const org = scope.organization_id ? this.orgBuckets.get(scope.organization_id) : null;
    if (org && org.dailyTokens >= this.config.organization_daily_token_budget) {
      return { allowed: false, reason: 'org_token_budget_exceeded' };
    }
    const user = scope.user_id ? this.userBuckets.get(scope.user_id) : null;
    if (user && user.dailyTokens >= this.config.user_daily_token_budget) {
      return { allowed: false, reason: 'user_token_budget_exceeded' };
    }

    return { allowed: true };
  }

  recordRequest(scope: RateLimitScope, tokensUsed: number): void {
    const now = Date.now();
    const targets = [
      this.global,
      this.bucket(this.orgBuckets, scope.organization_id),
      this.bucket(this.userBuckets, scope.user_id),
    ];
    for (const b of targets) {
      b.minuteRequests.push(now);
      b.hourRequests.push(now);
      b.dailyTokens += tokensUsed;
    }
  }

  reset(): void {
    this.global = { minuteRequests: [], hourRequests: [], dailyTokens: 0, dayKey: dayKey() };
    this.orgBuckets.clear();
    this.userBuckets.clear();
  }
}

let limiterSingleton: ProviderRateLimiter | null = null;

export function getProviderRateLimiter(config: ProviderRateLimitConfig): ProviderRateLimiter {
  if (!limiterSingleton) limiterSingleton = new ProviderRateLimiter(config);
  return limiterSingleton;
}

export function resetProviderRateLimiter(): void {
  limiterSingleton?.reset();
  limiterSingleton = null;
}
