/**
 * Supabase hooks — session and domain data access for React components.
 */

import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { isSupabaseConfigured } from '@/src/core/config/supabase';
import * as authService from '@/src/services/supabase/auth.service';
import * as profileService from '@/src/services/supabase/profile.service';
import * as organizationService from '@/src/services/supabase/organization.service';
import type { Profile } from '@/src/types/supabase';
import type { ProfilePatch } from '@/src/services/supabase/profile.service';
import type { UserOrganizationMembership } from '@/src/types/supabase';

export interface UseSupabaseSessionResult {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
  isConfigured: boolean;
}

/** Subscribes to Supabase auth session changes. Safe when env is not configured. */
export function useSupabaseSession(): UseSupabaseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    authService
      .getSession()
      .then((currentSession) => {
        if (mounted) setSession(currentSession);
      })
      .catch((err: Error) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data } = authService.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
    error,
    isConfigured: isSupabaseConfigured,
  };
}

export interface UseAuthResult extends UseSupabaseSessionResult {
  isAuthenticated: boolean;
  signIn: typeof authService.signIn;
  signUp: typeof authService.signUp;
  signOut: typeof authService.signOut;
  refreshUser: typeof authService.getCurrentUser;
}

/** Auth session + service actions (no UI). */
export function useAuth(): UseAuthResult {
  const sessionState = useSupabaseSession();

  return {
    ...sessionState,
    isAuthenticated: Boolean(sessionState.user),
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut,
    refreshUser: authService.getCurrentUser,
  };
}

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
