/**
 * Maps Firebase AuthUser to Supabase-compatible shapes for existing UI.
 * Does not expose tokens or raw UIDs in UI — used internally by AuthProvider.
 */

import type { Session, User } from '@supabase/supabase-js';

import type { Profile } from '@/src/types/supabase';
import type { AuthUser } from './types';

export function authUserToCompatUser(authUser: AuthUser): User {
  const now = new Date().toISOString();
  return {
    id: authUser.uid,
    aud: 'authenticated',
    role: 'authenticated',
    email: authUser.email ?? undefined,
    email_confirmed_at: authUser.isEmailVerified ? now : undefined,
    phone: '',
    confirmed_at: authUser.isEmailVerified ? now : undefined,
    last_sign_in_at: now,
    app_metadata: { provider: 'firebase', providers: ['firebase'] },
    user_metadata: { full_name: authUser.displayName ?? '' },
    identities: [],
    created_at: now,
    updated_at: now,
    is_anonymous: false,
  } as User;
}

export function authUserToCompatSession(authUser: AuthUser): Session {
  return {
    access_token: '',
    refresh_token: '',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: authUserToCompatUser(authUser),
  } as Session;
}

export function authUserToCompatProfile(authUser: AuthUser): Profile {
  const p = authUser.profile;
  const now = new Date().toISOString();
  return {
    id: authUser.uid,
    email: authUser.email ?? '',
    full_name: p?.displayName ?? authUser.displayName ?? '',
    role: (p?.role === 'head_coach' ? 'coach' : p?.role ?? 'coach') as Profile['role'],
    organization_id: p?.organizationId ?? null,
    language: p?.language ?? 'en',
    theme: 'system',
    avatar_url: p?.photoURL ?? authUser.photoURL,
    notification_settings: {},
    is_onboarded: true,
    last_active_at: p?.lastLogin ?? now,
    created_at: p?.createdAt ?? now,
    updated_at: p?.updatedAt ?? now,
  };
}
