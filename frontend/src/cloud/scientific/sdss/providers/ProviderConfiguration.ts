/**
 * SSDI Provider configuration — environment variables only (Phase 9.3).
 */

export type SdssProviderMode = 'auto' | 'mock' | 'openai' | 'azure_openai' | 'local_llm';

export interface ProviderRateLimitConfig {
  requests_per_minute: number;
  requests_per_hour: number;
  daily_token_budget: number;
  organization_daily_token_budget: number;
  user_daily_token_budget: number;
}

export interface ProviderRetryConfig {
  max_retries: number;
  initial_delay_ms: number;
  max_delay_ms: number;
  backoff_multiplier: number;
}

export interface ProviderCostRates {
  input_usd_per_1m_tokens: number;
  output_usd_per_1m_tokens: number;
}

export interface ProviderConfiguration {
  mode: SdssProviderMode;
  openai: {
    api_key: string;
    model: string;
    base_url: string;
    timeout_ms: number;
  };
  azure_openai: {
    api_key: string;
    endpoint: string;
    deployment: string;
    api_version: string;
    timeout_ms: number;
  };
  local_llm: {
    base_url: string;
    model: string;
  };
  priority: SdssProviderMode[];
  rate_limits: ProviderRateLimitConfig;
  retry: ProviderRetryConfig;
  cost_rates: ProviderCostRates;
}

function readEnv(key: string): string {
  return process.env[key]?.trim() ?? '';
}

function readInt(key: string, fallback: number): number {
  const raw = readEnv(key);
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

function readFloat(key: string, fallback: number): number {
  const raw = readEnv(key);
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Load provider configuration from environment — no hardcoded secrets. */
export function loadProviderConfiguration(): ProviderConfiguration {
  const mode = (readEnv('EXPO_PUBLIC_SDSS_PROVIDER') || readEnv('SDSS_PROVIDER') || 'auto') as SdssProviderMode;

  return {
    mode,
    openai: {
      api_key: readEnv('EXPO_PUBLIC_OPENAI_API_KEY') || readEnv('OPENAI_API_KEY'),
      model: readEnv('EXPO_PUBLIC_OPENAI_MODEL') || readEnv('OPENAI_MODEL') || 'gpt-4o-mini',
      base_url: readEnv('EXPO_PUBLIC_OPENAI_BASE_URL') || 'https://api.openai.com/v1',
      timeout_ms: readInt('EXPO_PUBLIC_SDSS_OPENAI_TIMEOUT_MS', 30000),
    },
    azure_openai: {
      api_key: readEnv('EXPO_PUBLIC_AZURE_OPENAI_API_KEY') || readEnv('AZURE_OPENAI_API_KEY'),
      endpoint: readEnv('EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT') || readEnv('AZURE_OPENAI_ENDPOINT'),
      deployment: readEnv('EXPO_PUBLIC_AZURE_OPENAI_DEPLOYMENT') || readEnv('AZURE_OPENAI_DEPLOYMENT'),
      api_version: readEnv('EXPO_PUBLIC_AZURE_OPENAI_API_VERSION') || '2024-02-15-preview',
      timeout_ms: readInt('EXPO_PUBLIC_SDSS_AZURE_TIMEOUT_MS', 30000),
    },
    local_llm: {
      base_url: readEnv('EXPO_PUBLIC_LOCAL_LLM_BASE_URL') || 'http://localhost:11434/v1',
      model: readEnv('EXPO_PUBLIC_LOCAL_LLM_MODEL') || 'llama3',
    },
    priority: parsePriority(readEnv('EXPO_PUBLIC_SDSS_PROVIDER_PRIORITY')),
    rate_limits: {
      requests_per_minute: readInt('EXPO_PUBLIC_SDSS_RPM', 30),
      requests_per_hour: readInt('EXPO_PUBLIC_SDSS_RPH', 500),
      daily_token_budget: readInt('EXPO_PUBLIC_SDSS_DAILY_TOKEN_BUDGET', 500_000),
      organization_daily_token_budget: readInt('EXPO_PUBLIC_SDSS_ORG_DAILY_TOKEN_BUDGET', 1_000_000),
      user_daily_token_budget: readInt('EXPO_PUBLIC_SDSS_USER_DAILY_TOKEN_BUDGET', 100_000),
    },
    retry: {
      max_retries: readInt('EXPO_PUBLIC_SDSS_MAX_RETRIES', 3),
      initial_delay_ms: readInt('EXPO_PUBLIC_SDSS_RETRY_INITIAL_MS', 500),
      max_delay_ms: readInt('EXPO_PUBLIC_SDSS_RETRY_MAX_MS', 8000),
      backoff_multiplier: readFloat('EXPO_PUBLIC_SDSS_RETRY_MULTIPLIER', 2),
    },
    cost_rates: {
      input_usd_per_1m_tokens: readFloat('EXPO_PUBLIC_SDSS_INPUT_COST_PER_1M', 0.15),
      output_usd_per_1m_tokens: readFloat('EXPO_PUBLIC_SDSS_OUTPUT_COST_PER_1M', 0.6),
    },
  };
}

function parsePriority(raw: string): SdssProviderMode[] {
  if (!raw) return ['openai', 'azure_openai', 'local_llm', 'mock'];
  return raw.split(',').map((s) => s.trim() as SdssProviderMode).filter(Boolean);
}

export function isOpenAiConfigured(config: ProviderConfiguration = loadProviderConfiguration()): boolean {
  return Boolean(config.openai.api_key);
}

export function isAzureOpenAiConfigured(config: ProviderConfiguration = loadProviderConfiguration()): boolean {
  return Boolean(config.azure_openai.api_key && config.azure_openai.endpoint && config.azure_openai.deployment);
}
