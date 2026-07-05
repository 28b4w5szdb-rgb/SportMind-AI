/**
 * Supabase organization service.
 */

import type { Organization, OrganizationType } from './database.types';
import { supabase } from './client';
import { assertSupabaseConfigured } from './errors';
import type { UserOrganizationMembership } from '@/src/types/supabase';

export const getUserOrganizations = async (
  userId: string
): Promise<UserOrganizationMembership[]> => {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('organization_members')
    .select(
      `
      id,
      role,
      joined_at,
      is_primary,
      organization:organizations(
        id,
        name,
        slug,
        type,
        settings,
        is_active
      )
    `
    )
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []) as unknown as UserOrganizationMembership[];
};

export const createOrganization = async (
  name: string,
  slug: string,
  type: OrganizationType,
  userId: string
): Promise<Organization> => {
  assertSupabaseConfigured();

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name, slug, type })
    .select()
    .single();

  if (orgError) throw orgError;

  const { error: memberError } = await supabase.from('organization_members').insert({
    organization_id: org.id,
    user_id: userId,
    role: 'organization_admin',
    is_primary: true,
  });

  if (memberError) throw memberError;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ organization_id: org.id })
    .eq('id', userId);

  if (profileError) throw profileError;

  return org;
};

export const getOrganizationStats = async (orgId: string) => {
  assertSupabaseConfigured();

  const { data, error } = await supabase.rpc('get_org_stats', { org_id: orgId });
  if (error) throw error;
  return data;
};
