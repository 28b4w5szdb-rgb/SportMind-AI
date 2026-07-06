/**
 * SportMind AI - App Configuration
 */

import { supabaseConfig, isSupabaseConfigured, SUPABASE_ENV_KEYS } from './supabase';
import { firebaseConfig, isFirebaseConfigured, FIREBASE_ENV_KEYS } from './firebase';
import { cloudConfig, USE_CLOUD_DATA, getDataMode, isCloudDataEnabled } from './cloud';
import { DEV_BYPASS_AUTH, devConfig } from './dev';

const ENV = {
  BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL?.trim() ?? '',
  SUPABASE_URL: supabaseConfig.configuredUrl,
  SUPABASE_ANON_KEY: supabaseConfig.configuredAnonKey,
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() ?? '',
  USE_CLOUD_DATA,
  DEV_BYPASS_AUTH,
};

export const config = {
  env: ENV,
  dev: devConfig,
  api: {
    baseUrl: ENV.BACKEND_URL,
    timeout: 30000,
  },
  supabase: {
    ...supabaseConfig,
    envKeys: SUPABASE_ENV_KEYS,
    isConfigured: isSupabaseConfigured,
  },
  firebase: {
    ...firebaseConfig,
    envKeys: FIREBASE_ENV_KEYS,
    isConfigured: isFirebaseConfigured,
  },
  cloud: cloudConfig,
  ai: {
    openai: {
      apiKey: ENV.OPENAI_API_KEY,
    },
  },
};

export { isSupabaseConfigured, supabaseConfig, SUPABASE_ENV_KEYS } from './supabase';
export { isFirebaseConfigured, firebaseConfig, FIREBASE_ENV_KEYS } from './firebase';
export { USE_CLOUD_DATA, getDataMode, isCloudDataEnabled, cloudConfig } from './cloud';
export { DEV_BYPASS_AUTH, devConfig } from './dev';

export default config;
