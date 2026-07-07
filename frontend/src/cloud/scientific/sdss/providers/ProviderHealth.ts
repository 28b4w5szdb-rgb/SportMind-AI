/**
 * Provider Health — online/offline, latency, error rates (Phase 9.3).
 */

import type { AiProviderId } from './aiProviderContract';

export type ProviderHealthStatus = 'online' | 'degraded' | 'offline';

export interface ProviderHealthRecord {
  provider_id: AiProviderId;
  status: ProviderHealthStatus;
  average_latency_ms: number;
  error_rate: number;
  timeout_rate: number;
  last_success_at: string | null;
  last_failure_at: string | null;
  consecutive_failures: number;
}

export class ProviderHealthMonitor {
  private records = new Map<AiProviderId, ProviderHealthRecord>();
  private latencies = new Map<AiProviderId, number[]>();
  private errors = new Map<AiProviderId, number>();
  private timeouts = new Map<AiProviderId, number>();
  private requests = new Map<AiProviderId, number>();
  private consecutiveFailures = new Map<AiProviderId, number>();

  recordSuccess(providerId: AiProviderId, latencyMs: number): void {
    this.requests.set(providerId, (this.requests.get(providerId) ?? 0) + 1);
    const lat = this.latencies.get(providerId) ?? [];
    lat.push(latencyMs);
    if (lat.length > 50) lat.shift();
    this.latencies.set(providerId, lat);
    this.consecutiveFailures.set(providerId, 0);
    this.records.set(providerId, this.buildRecord(providerId, 'online', new Date().toISOString(), null));
  }

  recordFailure(providerId: AiProviderId, timedOut = false): void {
    this.requests.set(providerId, (this.requests.get(providerId) ?? 0) + 1);
    this.errors.set(providerId, (this.errors.get(providerId) ?? 0) + 1);
    if (timedOut) this.timeouts.set(providerId, (this.timeouts.get(providerId) ?? 0) + 1);
    const consecutive = (this.consecutiveFailures.get(providerId) ?? 0) + 1;
    this.consecutiveFailures.set(providerId, consecutive);
    const status: ProviderHealthStatus = consecutive >= 3 ? 'offline' : consecutive >= 1 ? 'degraded' : 'online';
    this.records.set(providerId, this.buildRecord(providerId, status, null, new Date().toISOString()));
  }

  get(providerId: AiProviderId): ProviderHealthRecord {
    return this.records.get(providerId) ?? this.buildRecord(providerId, 'online', null, null);
  }

  isHealthy(providerId: AiProviderId): boolean {
    const rec = this.get(providerId);
    return rec.status !== 'offline';
  }

  snapshot(): ProviderHealthRecord[] {
    return [...this.records.values()];
  }

  reset(): void {
    this.records.clear();
    this.latencies.clear();
    this.errors.clear();
    this.timeouts.clear();
    this.requests.clear();
    this.consecutiveFailures.clear();
  }

  private buildRecord(
    providerId: AiProviderId,
    status: ProviderHealthStatus,
    lastSuccess: string | null,
    lastFailure: string | null
  ): ProviderHealthRecord {
    const lats = this.latencies.get(providerId) ?? [];
    const req = this.requests.get(providerId) ?? 0;
    const err = this.errors.get(providerId) ?? 0;
    const to = this.timeouts.get(providerId) ?? 0;
    const prev = this.records.get(providerId);
    return {
      provider_id: providerId,
      status,
      average_latency_ms: lats.length === 0 ? 0 : Math.round(lats.reduce((a, b) => a + b, 0) / lats.length),
      error_rate: req === 0 ? 0 : err / req,
      timeout_rate: req === 0 ? 0 : to / req,
      last_success_at: lastSuccess ?? prev?.last_success_at ?? null,
      last_failure_at: lastFailure ?? prev?.last_failure_at ?? null,
      consecutive_failures: this.consecutiveFailures.get(providerId) ?? 0,
    };
  }
}

let healthSingleton: ProviderHealthMonitor | null = null;

export function getProviderHealthMonitor(): ProviderHealthMonitor {
  if (!healthSingleton) healthSingleton = new ProviderHealthMonitor();
  return healthSingleton;
}

export function resetProviderHealthMonitor(): void {
  healthSingleton?.reset();
  healthSingleton = null;
}
