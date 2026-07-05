/**
 * Additional Supabase domain services (athletes, teams, training, AI, reports).
 * Split into dedicated modules in a later phase.
 */

import type { Json } from './database.types';
import { supabase } from './client';
import { assertSupabaseConfigured } from './errors';

// ============================================
// Athletes
// ============================================

export const getAthletes = async (organizationId: string) => {
  assertSupabaseConfigured();

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
  assertSupabaseConfigured();

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
  assertSupabaseConfigured();

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
// Teams
// ============================================

export const getTeams = async (organizationId: string) => {
  assertSupabaseConfigured();

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
  assertSupabaseConfigured();

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
// Training sessions
// ============================================

export const getTrainingSessions = async (
  organizationId: string,
  options?: { teamId?: string; fromDate?: string; toDate?: string; limit?: number }
) => {
  assertSupabaseConfigured();

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

  if (options?.teamId) query = query.eq('team_id', options.teamId);
  if (options?.fromDate) query = query.gte('date', options.fromDate);
  if (options?.toDate) query = query.lte('date', options.toDate);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// ============================================
// Performance tests
// ============================================

export const getTestTypes = async () => {
  assertSupabaseConfigured();

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
  assertSupabaseConfigured();

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

  if (options?.testTypeId) query = query.eq('test_type_id', options.testTypeId);
  if (options?.limit) query = query.limit(options.limit);

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
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('performance_test_results')
    .insert({ created_by: createdBy, ...resultData })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============================================
// AI conversations
// ============================================

export const getConversations = async (userId: string) => {
  assertSupabaseConfigured();

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
  assertSupabaseConfigured();

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
  assertSupabaseConfigured();

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
  assertSupabaseConfigured();

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
// Reports & preferences
// ============================================

export const getReports = async (organizationId: string) => {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getUserPreferences = async (userId: string) => {
  assertSupabaseConfigured();

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
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('user_preferences')
    .update(preferences)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};
