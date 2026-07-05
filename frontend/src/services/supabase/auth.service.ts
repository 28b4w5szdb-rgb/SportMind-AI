/**
 * Supabase authentication service.
 */

import * as Linking from 'expo-linking';
import type { AuthResponse, Session, User } from '@supabase/supabase-js';

import { supabase } from './client';
import { assertSupabaseConfigured } from './errors';

export interface SignUpMetadata {
  full_name?: string;
  role?: string;
  language?: string;
}

/** Deep-link / web URL for Supabase auth email redirects. */
export const getAuthRedirectUrl = (path: string): string => Linking.createURL(path);

export const signUp = async (
  email: string,
  password: string,
  metadata?: SignUpMetadata
): Promise<AuthResponse['data']> => {
  assertSupabaseConfigured();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: getAuthRedirectUrl('/verify-email'),
    },
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string): Promise<AuthResponse['data']> => {
  assertSupabaseConfigured();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async (): Promise<void> => {
  assertSupabaseConfigured();

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPasswordForEmail = async (email: string): Promise<void> => {
  assertSupabaseConfigured();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getAuthRedirectUrl('/reset-password'),
  });

  if (error) throw error;
};

export const updatePassword = async (password: string): Promise<void> => {
  assertSupabaseConfigured();

  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  assertSupabaseConfigured();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: getAuthRedirectUrl('/verify-email') },
  });

  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  assertSupabaseConfigured();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
};

export const getSession = async (): Promise<Session | null> => {
  assertSupabaseConfigured();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  return session;
};

export const onAuthStateChange = (
  callback: (event: string, session: Session | null) => void
) => supabase.auth.onAuthStateChange(callback);
