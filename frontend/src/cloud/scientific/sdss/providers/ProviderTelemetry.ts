/**
 * Provider Telemetry — latency, tokens, failures, governance metrics (Phase 9.3).
 */

import type { AiProviderId } from './aiProviderContract';

export interface ProviderTelemetryEvent {
  provider_id: AiProviderId;
  latency_ms: number;
  input_tokens: number;
  output_tokens: number;
  success: boolean;
  retry_count: number;
  error_class?: string;
  validation_failures: number;
  safety_blocks: number;
  governance_rejections: number;
  failover_from?: AiProviderId | null;
  timestamp: string;
}

export interface ProviderTelemetrySnapshot {
  total_requests: number;
  success_count: number;
  failure_count: number;
  average_latency_ms: number;
  total_retries: number;
  validation_failures: number;
  safety_blocks: number;
  governance_rejections: number;
  by_provider: Partial<Record<AiProviderId, { requests: number; failures: number; avg_latency_ms: number }>>;
  recent_events: ProviderTelemetryEvent[];
}

export class ProviderTelemetry {
  private events: ProviderTelemetryEvent[] = [];
  private maxEvents = 256;

  record(event: Omit<ProviderTelemetryEvent, 'timestamp'>): void {
    this.events.push({ ...event, timestamp: new Date().toISOString() });
    if (this.events.length > this.maxEvents) {
      this.events.splice(0, this.events.length - this.maxEvents);
    }
  }

  snapshot(): ProviderTelemetrySnapshot {
    const total = this.events.length;
    const success = this.events.filter((e) => e.success);
    const failures = this.events.filter((e) => !e.success);
    const avgLatency = total === 0 ? 0 : Math.round(this.events.reduce((s, e) => s + e.latency_ms, 0) / total);

    const byProvider: ProviderTelemetrySnapshot['by_provider'] = {};
    for (const e of this.events) {
      const cur = byProvider[e.provider_id] ?? { requests: 0, failures: 0, avg_latency_ms: 0 };
      cur.requests += 1;
      if (!e.success) cur.failures += 1;
      cur.avg_latency_ms = Math.round((cur.avg_latency_ms * (cur.requests - 1) + e.latency_ms) / cur.requests);
      byProvider[e.provider_id] = cur;
    }

    return {
      total_requests: total,
      success_count: success.length,
      failure_count: failures.length,
      average_latency_ms: avgLatency,
      total_retries: this.events.reduce((s, e) => s + e.retry_count, 0),
      validation_failures: this.events.reduce((s, e) => s + e.validation_failures, 0),
      safety_blocks: this.events.reduce((s, e) => s + e.safety_blocks, 0),
      governance_rejections: this.events.reduce((s, e) => s + e.governance_rejections, 0),
      by_provider: byProvider,
      recent_events: [...this.events].slice(-20),
    };
  }

  reset(): void {
    this.events = [];
  }
}

let telemetrySingleton: ProviderTelemetry | null = null;

export function getProviderTelemetry(): ProviderTelemetry {
  if (!telemetrySingleton) telemetrySingleton = new ProviderTelemetry();
  return telemetrySingleton;
}

export function resetProviderTelemetry(): void {
  telemetrySingleton?.reset();
  telemetrySingleton = null;
}
