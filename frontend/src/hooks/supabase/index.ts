/**
 * Supabase hooks — session and domain data access for React components.
 */

import { useCallback, useEffect, useState } from 'react';

import { isSupabaseConfigured } from '@/src/core/config/supabase';
import { useAuth as useAuthContext } from '@/src/providers/AuthProvider';
import * as profileService from '@/src/services/supabase/profile.service';
import * as organizationService from '@/src/services/supabase/organization.service';
import type { Profile } from '@/src/types/supabase';
import type { ProfilePatch } from '@/src/services/supabase/profile.service';
import type { UserOrganizationMembership } from '@/src/types/supabase';

/** @deprecated Prefer useAuth from AuthProvider for session-aware auth state. */
export function useSupabaseSession() {
  const auth = useAuthContext();
  return {
    session: auth.session,
    user: auth.user,
    loading: auth.initializing,
    error: auth.errorKey ? new Error(auth.errorKey) : null,
    isConfigured: auth.isConfigured,
  };
}

/** Global auth context — session, profile, and auth actions. */
export { useAuth } from '@/src/providers/AuthProvider';

export interface UseProfileResult {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  isConfigured: boolean;
  refresh: () => Promise<void>;
  updateProfile: (updates: ProfilePatch) => Promise<Profile | null>;
}

/** Loads the signed-in user's profile when `userId` is provided. */
export function useProfile(userId?: string | null): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!userId || !isSupabaseConfigured) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await profileService.getProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateProfile = useCallback(
    async (updates: ProfilePatch) => {
      if (!userId) throw new Error('Cannot update profile without a user id.');
      const updated = await profileService.updateProfile(userId, updates);
      setProfile(updated);
      return updated;
    },
    [userId]
  );

  return {
    profile,
    loading,
    error,
    isConfigured: isSupabaseConfigured,
    refresh,
    updateProfile,
  };
}

export interface UseOrganizationsResult {
  organizations: UserOrganizationMembership[];
  primaryOrganization: UserOrganizationMembership | null;
  loading: boolean;
  error: Error | null;
  isConfigured: boolean;
  refresh: () => Promise<void>;
  createOrganization: typeof organizationService.createOrganization;
}

/** Loads organizations for the signed-in user when `userId` is provided. */
export function useOrganizations(userId?: string | null): UseOrganizationsResult {
  const [organizations, setOrganizations] = useState<UserOrganizationMembership[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!userId || !isSupabaseConfigured) {
      setOrganizations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await organizationService.getUserOrganizations(userId);
      setOrganizations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const primaryOrganization =
    organizations.find((membership) => membership.is_primary) ?? organizations[0] ?? null;

  return {
    organizations,
    primaryOrganization,
    loading,
    error,
    isConfigured: isSupabaseConfigured,
    refresh,
    createOrganization: organizationService.createOrganization,
  };
}
