import type { AuthError } from '@supabase/supabase-js';

const AUTH_ERROR_MAP: Record<string, string> = {
  invalid_credentials: 'auth.errors.invalidCredentials',
  invalid_login_credentials: 'auth.errors.invalidCredentials',
  email_not_confirmed: 'auth.errors.emailNotConfirmed',
  user_already_exists: 'auth.errors.userAlreadyExists',
  weak_password: 'auth.errors.weakPassword',
  same_password: 'auth.errors.samePassword',
  over_request_rate_limit: 'auth.errors.rateLimited',
  otp_expired: 'auth.errors.linkExpired',
  session_not_found: 'auth.errors.sessionExpired',
};

/** Maps Supabase AuthError to an i18n key under `auth.errors.*`. */
export function getAuthErrorKey(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'auth.errors.generic';
  }

  const authError = error as AuthError;
  const code = authError.code ?? authError.message?.toLowerCase().replace(/\s+/g, '_');

  if (code && AUTH_ERROR_MAP[code]) {
    return AUTH_ERROR_MAP[code];
  }

  const message = authError.message?.toLowerCase() ?? '';

  if (message.includes('invalid login credentials')) {
    return 'auth.errors.invalidCredentials';
  }
  if (message.includes('email not confirmed')) {
    return 'auth.errors.emailNotConfirmed';
  }
  if (message.includes('user already registered')) {
    return 'auth.errors.userAlreadyExists';
  }
  if (message.includes('password')) {
    return 'auth.errors.weakPassword';
  }

  return 'auth.errors.generic';
}
