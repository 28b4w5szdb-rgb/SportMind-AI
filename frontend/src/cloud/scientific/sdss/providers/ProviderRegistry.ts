/**
 * Provider Registry — priority-ordered provider registration (Phase 9.3).
 */

import type { AiProvider, AiProviderId } from './aiProviderContract';
import type { ProviderConfiguration, SdssProviderMode } from './ProviderConfiguration';
import { loadProviderConfiguration } from './ProviderConfiguration';
import { OpenAiProvider } from './OpenAiProvider';
import { AzureOpenAiProvider } from './AzureOpenAiProvider';
import { getMockAiProvider } from './mockAiProvider';
import type { HttpFetcher } from './sharedLlmClient';

export interface ProviderRegistryOptions {
  config?: ProviderConfiguration;
  fetchImpl?: HttpFetcher;
}

export class ProviderRegistry {
  private providers = new Map<AiProviderId, AiProvider>();

  constructor(options: ProviderRegistryOptions = {}) {
    const config = options.config ?? loadProviderConfiguration();
    this.providers.set('mock', getMockAiProvider());
    this.providers.set('openai', new OpenAiProvider({ config, fetchImpl: options.fetchImpl }));
    this.providers.set('azure_openai', new AzureOpenAiProvider({ config, fetchImpl: options.fetchImpl }));
  }

  register(provider: AiProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: AiProviderId): AiProvider | undefined {
    return this.providers.get(id);
  }

  /** Resolve ordered available providers based on config mode and priority. */
  resolveOrdered(config: ProviderConfiguration = loadProviderConfiguration()): AiProvider[] {
    if (config.mode !== 'auto') {
      const single = this.providers.get(config.mode as AiProviderId);
      if (single?.isAvailable()) return [single];
      return [this.providers.get('mock')!];
    }

    const ordered: AiProvider[] = [];
    const seen = new Set<AiProviderId>();

    for (const mode of config.priority) {
      if (seen.has(mode as AiProviderId)) continue;
      const provider = this.providers.get(mode as AiProviderId);
      if (provider?.isAvailable()) {
        ordered.push(provider);
        seen.add(provider.id);
      }
    }

    const mock = this.providers.get('mock')!;
    if (!seen.has('mock')) ordered.push(mock);
    return ordered;
  }

  all(): AiProvider[] {
    return [...this.providers.values()];
  }
}

let registrySingleton: ProviderRegistry | null = null;

export function getProviderRegistry(options?: ProviderRegistryOptions): ProviderRegistry {
  if (!registrySingleton) registrySingleton = new ProviderRegistry(options);
  return registrySingleton;
}

export function resetProviderRegistry(): void {
  registrySingleton = null;
}

export function resolveProviderModes(config: ProviderConfiguration): SdssProviderMode[] {
  return config.mode === 'auto' ? config.priority : [config.mode];
}
