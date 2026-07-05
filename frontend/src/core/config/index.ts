/**
 * SportMind AI - App Configuration
 */

import { supabaseConfig, isSupabaseConfigured, SUPABASE_ENV_KEYS } from './supabase';

const ENV = {
  BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL?.trim() ?? '',
  SUPABASE_URL: supabaseConfig.configuredUrl,
  SUPABASE_ANON_KEY: supabaseConfig.configuredAnonKey,
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() ?? '',
};

export const config = {
  env: ENV,
  api: {
    baseUrl: ENV.BACKEND_URL,
    timeout: 30000,
  },
  supabase: {
    ...supabaseConfig,
    envKeys: SUPABASE_ENV_KEYS,
    isConfigured: isSupabaseConfigured,
  },
  ai: {
    openai: {
      apiKey: ENV.OPENAI_API_KEY,
    },
  },
};

export { isSupabaseConfigured, supabaseConfig, SUPABASE_ENV_KEYS } from './supabase';

export default config;
