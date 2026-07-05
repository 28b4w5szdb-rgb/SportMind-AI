/**
 * SportMind AI - Supabase Client
 *
 * Primary backend service for database, authentication, and storage.
 * Uses anon key for client-side operations with RLS policies.
 *
 * @see bolt-database skill for patterns
 */

import { createClient } from '@supabase/supabase-js';
import { Database, Json } from './database.types';

// Environment variables (pre-populated in .env)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  );
}

// Create Supabase client with TypeScript types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// ============================================
// Auth Helpers
// ============================================

export const signUp = async (
  email: string,
  password: string,
  metadata?: { full_name?: string; role?: string; language?: string }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) throw error;

  // Profile is auto-created via database trigger
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
};

export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  return session;
};

// ============================================
// Profile Helpers
// ============================================

export const getProfile = async (userId: string) => {
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
  updates: Partial<{
    full_name: string;
    language: string;
    theme: string;
    avatar_url: string;
    notification_settings: Json;
    is_onboarded: boolean;
  }>
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============================================
// Organization Helpers
// ============================================

export const getUserOrganizations = async (userId: string) => {
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
  return data;
};

export const createOrganization = async (
  name: string,
  slug: string,
  type: string,
  userId: string
) => {
  // Create organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name,
      slug,
      type: type as 'club' | 'university' | 'clinic' | 'federation' | 'academy',
    })
    .select()
    .single();

  if (orgError) throw orgError;

  // Add user as organization admin
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: org.id,
      user_id: userId,
      role: 'organization_admin',
      is_primary: true,
    });

  if (memberError) throw memberError;

  // Update user's profile with organization
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ organization_id: org.id })
    .eq('id', userId);

  if (profileError) throw profileError;

  return org;
};

// ============================================
// Athlete Helpers
// ============================================

export const getAthletes = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('last_name', { ascending: true });

  if (error) throw error;
  return data;
};

export const getAthlete = async (athleteId: string) => {
  const { data, error } = await supabase
    .from('athletes')
    .select(
      `
      *,
      team_athletes(
        team_id,
        position,
        jersey_number,
        is_captain,
        team:teams(id, name, sport)
      ),
      performance_test_results(
        id,
        test_type_id,
        date,
        value,
        unit,
        is_personal_best,
        test_types(name_en, name_ar, category)
      )
    `
    )
    .eq('id', athleteId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createAthlete = async (
  organizationId: string,
  athleteData: {
    first_name: string;
    last_name: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    nationality?: string;
    position?: string;
    jersey_number?: number;
    height_cm?: number;
    weight_kg?: number;
  },
  createdBy: string
) => {
  const { data, error } = await supabase
    .from('athletes')
    .insert({
      organization_id: organizationId,
      created_by: createdBy,
      ...athleteData,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============================================
// Team Helpers
// ============================================

export const getTeams = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('teams')
    .select(
      `
      *,
      head_coach:profiles(id, full_name),
      athlete_count:team_athletes(count)
    `
    )
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

export const getTeam = async (teamId: string) => {
  const { data, error } = await supabase
    .from('teams')
    .select(
      `
      *,
      head_coach:profiles(id, full_name),
      team_athletes(
        id,
        position,
        jersey_number,
        is_captain,
        athlete:athletes(id, first_name, last_name, position)
      )
    `
    )
    .eq('id', teamId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============================================
// Training Session Helpers
// ============================================

export const getTrainingSessions = async (
  organizationId: string,
  options?: { teamId?: string; fromDate?: string; toDate?: string; limit?: number }
) => {
  let query = supabase
    .from('training_sessions')
    .select(
      `
      *,
      team:teams(id, name, sport),
      attendees:session_attendees(count)
    `
    )
    .eq('organization_id', organizationId)
    .order('date', { ascending: false });

  if (options?.teamId) {
    query = query.eq('team_id', options.teamId);
  }
  if (options?.fromDate) {
    query = query.gte('date', options.fromDate);
  }
  if (options?.toDate) {
    query = query.lte('date', options.toDate);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// ============================================
// Performance Test Helpers
// ============================================

export const getTestTypes = async () => {
  const { data, error } = await supabase
    .from('test_types')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name_en', { ascending: true });

  if (error) throw error;
  return data;
};

export const getAthleteTestResults = async (
  athleteId: string,
  options?: { testTypeId?: string; limit?: number }
) => {
  let query = supabase
    .from('performance_test_results')
    .select(
      `
      *,
      test_type:test_types(id, name_en, name_ar, category, unit)
    `
    )
    .eq('athlete_id', athleteId)
    .order('date', { ascending: false });

  if (options?.testTypeId) {
    query = query.eq('test_type_id', options.testTypeId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const createTestResult = async (
  resultData: {
    athlete_id: string;
    test_type_id: string;
    organization_id: string;
    date: string;
    value: number;
    unit: string;
    conditions?: Json;
    notes?: string;
  },
  createdBy: string
) => {
  const { data, error } = await supabase
    .from('performance_test_results')
    .insert({
      created_by: createdBy,
      ...resultData,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============================================
// AI Conversation Helpers
// ============================================

export const getConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('last_message_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createConversation = async (
  userId: string,
  organizationId: string,
  agentType: string,
  title?: string,
  context?: Json
) => {
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      organization_id: organizationId,
      agent_type: agentType as
        | 'coach'
        | 'analyst'
        | 'medical'
        | 'researcher'
        | 'nutrition'
        | 'performance'
        | 'recovery',
      title,
      context,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('ai_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const addMessage = async (
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: Json,
  tokensUsed?: number
) => {
  const { data, error } = await supabase
    .from('ai_messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      metadata,
      tokens_used: tokensUsed,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============================================
// Report Helpers
// ============================================

export const getReports = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// ============================================
// User Preferences Helpers
// ============================================

export const getUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateUserPreferences = async (
  userId: string,
  preferences: Partial<{
    dashboard_layout: Json;
    default_view: string;
    units_system: string;
    date_format: string;
    time_format: string;
    show_animations: boolean;
    auto_sync: boolean;
  }>
) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(preferences)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============================================
// Statistics Helper
// ============================================

export const getOrganizationStats = async (orgId: string) => {
  const { data, error } = await supabase.rpc('get_org_stats', { org_id: orgId });

  if (error) throw error;
  return data;
};

export default supabase;
