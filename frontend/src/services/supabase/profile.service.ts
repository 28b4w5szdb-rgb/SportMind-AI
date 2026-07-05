/**
 * Supabase profile service.
 */

import type { Json, Profile, ProfileUpdate } from './database.types';
import { supabase } from './client';
import { assertSupabaseConfigured } from './errors';

export type ProfilePatch = Pick<
  ProfileUpdate,
  | 'full_name'
  | 'language'
  | 'theme'
  | 'avatar_url'
  | 'notification_settings'
  | 'is_onboarded'
> & {
  notification_settings?: Json;
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateProfile = async (
  userId: string,
  updates: ProfilePatch
): Promise<Profile | null> => {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};
