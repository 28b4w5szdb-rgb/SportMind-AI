/**
 * Mock auth user/session for DEV_BYPASS_AUTH development mode.
 * Shapes match Supabase Auth types for seamless AuthProvider wiring.
 */

import type { Session, User } from '@supabase/supabase-js';

import type { Profile } from '@/src/types/supabase';

export const MOCK_DEV_USER_ID = 'dev-user-001';

export const MOCK_DEV_USER = {
  id: MOCK_DEV_USER_ID,
  aud: 'authenticated',
  role: 'authenticated',
  email: 'dev@sportmind.local',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'dev', providers: ['dev'] },
  user_metadata: { full_name: 'Dev Coach' },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_anonymous: false,
} as User;

export const MOCK_DEV_SESSION = {
  access_token: 'dev-mock-access-token',
  refresh_token: 'dev-mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: MOCK_DEV_USER,
} as Session;

export const MOCK_DEV_PROFILE: Profile = {
  id: MOCK_DEV_USER_ID,
  email: 'dev@sportmind.local',
  full_name: 'Dev Coach',
  role: 'coach',
  organization_id: null,
  language: 'en',
  theme: 'system',
  avatar_url: null,
  notification_settings: {},
  is_onboarded: true,
  last_active_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/** Returns a fresh mock session (new expiry timestamp). */
export function createMockDevSession(): Session {
  return {
    ...MOCK_DEV_SESSION,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: MOCK_DEV_USER,
  };
}
