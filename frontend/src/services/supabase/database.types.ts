/**
 * SportMind AI - Database Types
 *
 * Auto-generated TypeScript types for Supabase database schema.
 * These types provide full type safety for database operations.
 *
 * @generated from migrations 001-005
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: OrganizationType;
          settings: Json;
          branding: Json;
          max_athletes: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          type?: OrganizationType;
          settings?: Json;
          branding?: Json;
          max_athletes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          type?: OrganizationType;
          settings?: Json;
          branding?: Json;
          max_athletes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          organization_id: string | null;
          language: string;
          theme: string;
          avatar_url: string | null;
          notification_settings: Json;
          is_onboarded: boolean;
          last_active_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          organization_id?: string | null;
          language?: string;
          theme?: string;
          avatar_url?: string | null;
          notification_settings?: Json;
          is_onboarded?: boolean;
          last_active_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          organization_id?: string | null;
          language?: string;
          theme?: string;
          avatar_url?: string | null;
          notification_settings?: Json;
          is_onboarded?: boolean;
          last_active_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: UserRole;
          joined_at: string;
          is_primary: boolean;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: UserRole;
          joined_at?: string;
          is_primary?: boolean;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: UserRole;
          joined_at?: string;
          is_primary?: boolean;
        };
        Relationships: [];
      };
      athletes: {
        Row: {
          id: string;
          organization_id: string;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          gender: GenderType | null;
          nationality: string | null;
          position: string | null;
          jersey_number: number | null;
          height_cm: number | null;
          weight_kg: number | null;
          photo_url: string | null;
          medical_notes: string | null;
          is_active: boolean;
          metadata: Json;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          first_name: string;
          last_name: string;
          date_of_birth?: string | null;
          gender?: GenderType | null;
          nationality?: string | null;
          position?: string | null;
          jersey_number?: number | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          photo_url?: string | null;
          medical_notes?: string | null;
          is_active?: boolean;
          metadata?: Json;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string | null;
          gender?: GenderType | null;
          nationality?: string | null;
          position?: string | null;
          jersey_number?: number | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          photo_url?: string | null;
          medical_notes?: string | null;
          is_active?: boolean;
          metadata?: Json;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          sport: SportType;
          season: string | null;
          age_group: AgeGroupType | null;
          division: string | null;
          head_coach_id: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          sport?: SportType;
          season?: string | null;
          age_group?: AgeGroupType | null;
          division?: string | null;
          head_coach_id?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          sport?: SportType;
          season?: string | null;
          age_group?: AgeGroupType | null;
          division?: string | null;
          head_coach_id?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      team_athletes: {
        Row: {
          id: string;
          team_id: string;
          athlete_id: string;
          joined_at: string;
          left_at: string | null;
          position: string | null;
          jersey_number: number | null;
          is_captain: boolean;
        };
        Insert: {
          id?: string;
          team_id: string;
          athlete_id: string;
          joined_at?: string;
          left_at?: string | null;
          position?: string | null;
          jersey_number?: number | null;
          is_captain?: boolean;
        };
        Update: {
          id?: string;
          team_id?: string;
          athlete_id?: string;
          joined_at?: string;
          left_at?: string | null;
          position?: string | null;
          jersey_number?: number | null;
          is_captain?: boolean;
        };
        Relationships: [];
      };
      positions: {
        Row: {
          id: string;
          sport: SportType;
          code: string;
          name_en: string;
          name_ar: string | null;
          category: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          sport: SportType;
          code: string;
          name_en: string;
          name_ar?: string | null;
          category?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          sport?: SportType;
          code?: string;
          name_en?: string;
          name_ar?: string | null;
          category?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      training_sessions: {
        Row: {
          id: string;
          organization_id: string;
          team_id: string | null;
          title: string;
          session_type: SessionType;
          date: string;
          start_time: string | null;
          end_time: string | null;
          duration_minutes: number | null;
          location: string | null;
          objectives: Json;
          intensity: IntensityLevel | null;
          load_rating: number | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          team_id?: string | null;
          title: string;
          session_type?: SessionType;
          date: string;
          start_time?: string | null;
          end_time?: string | null;
          duration_minutes?: number | null;
          location?: string | null;
          objectives?: Json;
          intensity?: IntensityLevel | null;
          load_rating?: number | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          team_id?: string | null;
          title?: string;
          session_type?: SessionType;
          date?: string;
          start_time?: string | null;
          end_time?: string | null;
          duration_minutes?: number | null;
          location?: string | null;
          objectives?: Json;
          intensity?: IntensityLevel | null;
          load_rating?: number | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      session_attendees: {
        Row: {
          id: string;
          session_id: string;
          athlete_id: string;
          attendance_status: AttendanceStatus;
          participation_minutes: number | null;
          perceived_exertion: number | null;
          heart_rate_avg: number | null;
          heart_rate_max: number | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          athlete_id: string;
          attendance_status?: AttendanceStatus;
          participation_minutes?: number | null;
          perceived_exertion?: number | null;
          heart_rate_avg?: number | null;
          heart_rate_max?: number | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          athlete_id?: string;
          attendance_status?: AttendanceStatus;
          participation_minutes?: number | null;
          perceived_exertion?: number | null;
          heart_rate_avg?: number | null;
          heart_rate_max?: number | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      test_types: {
        Row: {
          id: string;
          name_en: string;
          name_ar: string | null;
          category: TestCategory;
          description_en: string | null;
          description_ar: string | null;
          unit: string;
          higher_is_better: boolean;
          protocol: string | null;
          equipment_needed: Json;
          normative_data: Json;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_en: string;
          name_ar?: string | null;
          category: TestCategory;
          description_en?: string | null;
          description_ar?: string | null;
          unit: string;
          higher_is_better?: boolean;
          protocol?: string | null;
          equipment_needed?: Json;
          normative_data?: Json;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_en?: string;
          name_ar?: string | null;
          category?: TestCategory;
          description_en?: string | null;
          description_ar?: string | null;
          unit?: string;
          higher_is_better?: boolean;
          protocol?: string | null;
          equipment_needed?: Json;
          normative_data?: Json;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      performance_test_results: {
        Row: {
          id: string;
          athlete_id: string;
          test_type_id: string;
          organization_id: string;
          date: string;
          value: number;
          unit: string;
          conditions: Json;
          percentile_rank: number | null;
          is_personal_best: boolean;
          notes: string | null;
          raw_data: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          athlete_id: string;
          test_type_id: string;
          organization_id: string;
          date: string;
          value: number;
          unit: string;
          conditions?: Json;
          percentile_rank?: number | null;
          is_personal_best?: boolean;
          notes?: string | null;
          raw_data?: Json;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          athlete_id?: string;
          test_type_id?: string;
          organization_id?: string;
          date?: string;
          value?: number;
          unit?: string;
          conditions?: Json;
          percentile_rank?: number | null;
          is_personal_best?: boolean;
          notes?: string | null;
          raw_data?: Json;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          report_type: ReportType;
          format: ReportFormat;
          scope: Json;
          filters: Json;
          date_range_start: string | null;
          date_range_end: string | null;
          status: ReportStatus;
          file_url: string | null;
          file_size: number | null;
          error_message: string | null;
          created_by: string | null;
          accessed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          report_type?: ReportType;
          format?: ReportFormat;
          scope?: Json;
          filters?: Json;
          date_range_start?: string | null;
          date_range_end?: string | null;
          status?: ReportStatus;
          file_url?: string | null;
          file_size?: number | null;
          error_message?: string | null;
          created_by?: string | null;
          accessed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          report_type?: ReportType;
          format?: ReportFormat;
          scope?: Json;
          filters?: Json;
          date_range_start?: string | null;
          date_range_end?: string | null;
          status?: ReportStatus;
          file_url?: string | null;
          file_size?: number | null;
          error_message?: string | null;
          created_by?: string | null;
          accessed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          agent_type: AiAgentType;
          title: string | null;
          context: Json;
          is_archived: boolean;
          last_message_at: string | null;
          message_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          agent_type?: AiAgentType;
          title?: string | null;
          context?: Json;
          is_archived?: boolean;
          last_message_at?: string | null;
          message_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_id?: string;
          agent_type?: AiAgentType;
          title?: string | null;
          context?: Json;
          is_archived?: boolean;
          last_message_at?: string | null;
          message_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: MessageRole;
          content: string;
          metadata: Json;
          tokens_used: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: MessageRole;
          content: string;
          metadata?: Json;
          tokens_used?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: MessageRole;
          content?: string;
          metadata?: Json;
          tokens_used?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_analyses: {
        Row: {
          id: string;
          organization_id: string;
          analysis_type: AnalysisType;
          target_type: string;
          target_id: string | null;
          input_data: Json;
          result: Json;
          explanation: string | null;
          confidence_score: number | null;
          recommendations: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          analysis_type: AnalysisType;
          target_type: string;
          target_id?: string | null;
          input_data?: Json;
          result?: Json;
          explanation?: string | null;
          confidence_score?: number | null;
          recommendations?: Json;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          analysis_type?: AnalysisType;
          target_type?: string;
          target_id?: string | null;
          input_data?: Json;
          result?: Json;
          explanation?: string | null;
          confidence_score?: number | null;
          recommendations?: Json;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      saved_calculations: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string | null;
          calculator_type: string;
          name: string | null;
          input_values: Json;
          output_values: Json;
          athlete_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id?: string | null;
          calculator_type: string;
          name?: string | null;
          input_values?: Json;
          output_values?: Json;
          athlete_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_id?: string | null;
          calculator_type?: string;
          name?: string | null;
          input_values?: Json;
          output_values?: Json;
          athlete_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          dashboard_layout: Json;
          default_view: string;
          units_system: string;
          date_format: string;
          time_format: string;
          first_day_of_week: number;
          show_animations: boolean;
          auto_sync: boolean;
          offline_mode: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dashboard_layout?: Json;
          default_view?: string;
          units_system?: string;
          date_format?: string;
          time_format?: string;
          first_day_of_week?: number;
          show_animations?: boolean;
          auto_sync?: boolean;
          offline_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          dashboard_layout?: Json;
          default_view?: string;
          units_system?: string;
          date_format?: string;
          time_format?: string;
          first_day_of_week?: number;
          show_animations?: boolean;
          auto_sync?: boolean;
          offline_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      organization_type: OrganizationType;
      gender_type: GenderType;
      sport_type: SportType;
      age_group_type: AgeGroupType;
      session_type: SessionType;
      intensity_level: IntensityLevel;
      attendance_status: AttendanceStatus;
      test_category: TestCategory;
      report_type: ReportType;
      report_status: ReportStatus;
      report_format: ReportFormat;
      ai_agent_type: AiAgentType;
      message_role: MessageRole;
      analysis_type: AnalysisType;
    };
    Functions: {
      get_org_stats: {
        Args: { org_id: string };
        Returns: Json;
      };
      handle_new_user: {
        Args: Record<string, never>;
        Returns: Database['public']['Tables']['profiles']['Row'];
      };
      handle_updated_at: {
        Args: Record<string, never>;
        Returns: Database['public']['Tables']['organizations']['Row'];
      };
    };
  };
}

// ============================================
// Enum Types
// ============================================

export type UserRole =
  | 'admin'
  | 'organization_admin'
  | 'sports_scientist'
  | 'coach'
  | 'assistant_coach'
  | 'physiotherapist'
  | 'nutritionist'
  | 'analyst'
  | 'researcher'
  | 'athlete';

export type OrganizationType =
  | 'club'
  | 'university'
  | 'clinic'
  | 'federation'
  | 'academy';

export type GenderType = 'male' | 'female' | 'other';

export type SportType =
  | 'football'
  | 'basketball'
  | 'volleyball'
  | 'handball'
  | 'tennis'
  | 'swimming'
  | 'athletics'
  | 'generic';

export type AgeGroupType =
  | 'U12'
  | 'U14'
  | 'U15'
  | 'U16'
  | 'U17'
  | 'U18'
  | 'U19'
  | 'U20'
  | 'U21'
  | 'U23'
  | 'senior'
  | 'masters'
  | 'youth'
  | 'adult';

export type SessionType =
  | 'technical'
  | 'physical'
  | 'tactical'
  | 'recovery'
  | 'match'
  | 'testing'
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'individual';

export type IntensityLevel = 'low' | 'moderate' | 'high' | 'very_high';

export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'injured'
  | 'late'
  | 'excused'
  | 'rest';

export type TestCategory =
  | 'endurance'
  | 'speed'
  | 'strength'
  | 'power'
  | 'agility'
  | 'flexibility'
  | 'body_composition'
  | 'balance'
  | 'reaction'
  | 'aerobic_capacity'
  | 'anaerobic_capacity';

export type ReportType =
  | 'athlete'
  | 'team'
  | 'session'
  | 'test'
  | 'progress'
  | 'injury'
  | 'custom';

export type ReportStatus =
  | 'draft'
  | 'generating'
  | 'ready'
  | 'failed'
  | 'expired';

export type ReportFormat = 'pdf' | 'excel' | 'word' | 'html' | 'json';

export type AiAgentType =
  | 'coach'
  | 'analyst'
  | 'medical'
  | 'researcher'
  | 'nutrition'
  | 'performance'
  | 'recovery';

export type MessageRole = 'user' | 'assistant' | 'system';

export type AnalysisType =
  | 'performance_prediction'
  | 'injury_risk'
  | 'training_recommendation'
  | 'team_selection'
  | 'fatigue_analysis'
  | 'progress_evaluation'
  | 'benchmark_comparison';

// ============================================
// Convenience Types
// ============================================

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
export type Athlete = Database['public']['Tables']['athletes']['Row'];
export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamAthlete = Database['public']['Tables']['team_athletes']['Row'];
export type Position = Database['public']['Tables']['positions']['Row'];
export type TrainingSession = Database['public']['Tables']['training_sessions']['Row'];
export type SessionAttendee = Database['public']['Tables']['session_attendees']['Row'];
export type TestType = Database['public']['Tables']['test_types']['Row'];
export type PerformanceTestResult = Database['public']['Tables']['performance_test_results']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
export type AiConversation = Database['public']['Tables']['ai_conversations']['Row'];
export type AiMessage = Database['public']['Tables']['ai_messages']['Row'];
export type AiAnalysis = Database['public']['Tables']['ai_analyses']['Row'];
export type SavedCalculation = Database['public']['Tables']['saved_calculations']['Row'];
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];

// Insert types for creating new records
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type AthleteInsert = Database['public']['Tables']['athletes']['Insert'];
export type TeamInsert = Database['public']['Tables']['teams']['Insert'];
export type TrainingSessionInsert = Database['public']['Tables']['training_sessions']['Insert'];
export type TestResultInsert = Database['public']['Tables']['performance_test_results']['Insert'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];
export type AiConversationInsert = Database['public']['Tables']['ai_conversations']['Insert'];
export type AiMessageInsert = Database['public']['Tables']['ai_messages']['Insert'];

// Update types for partial updates
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type AthleteUpdate = Database['public']['Tables']['athletes']['Update'];
export type TeamUpdate = Database['public']['Tables']['teams']['Update'];
export type TrainingSessionUpdate = Database['public']['Tables']['training_sessions']['Update'];
export type TestResultUpdate = Database['public']['Tables']['performance_test_results']['Update'];
export type ReportUpdate = Database['public']['Tables']['reports']['Update'];
