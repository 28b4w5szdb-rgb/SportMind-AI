/*
# Reports, AI Integration, and Settings Tables

## Overview
Creates tables for report generation, AI coach conversations, and application settings.
These enable the advanced features of SportMind AI.

## New Tables

### 1. reports
- `id`: uuid primary key
- `organization_id`: owning organization
- `title`: report title
- `report_type`: type enum (athlete, team, session, test, custom)
- `format`: output format (pdf, excel, word)
- `scope`: what the report covers (jsonb)
- `filters`: applied filters (jsonb)
- `date_range_start`: reporting period start
- `date_range_end`: reporting period end
- `status`: draft, generating, ready, failed
- `file_url`: generated file URL
- `file_size`: file size in bytes
- `created_by`: report creator
- `accessed_at`: last access timestamp
- `created_at`, `updated_at`: timestamps

### 2. ai_conversations
- `id`: uuid primary key
- `user_id`: conversation owner
- `organization_id`: organization context
- `agent_type`: AI agent type (coach, analyst, medical, researcher, nutrition, performance)
- `title`: conversation title (auto-generated or user-set)
- `context`: conversation context data (jsonb)
- `is_archived`: archived status
- `last_message_at`: last message timestamp
- `created_at`, `updated_at`: timestamps

### 3. ai_messages
- `id`: uuid primary key
- `conversation_id`: parent conversation
- `role`: message sender (user, assistant, system)
- `content`: message content
- `metadata`: additional data (jsonb)
- `tokens_used`: token count for billing
- `created_at`: timestamp

### 4. ai_analyses
- `id`: uuid primary key
- `organization_id`: organization
- `analysis_type`: type of analysis performed
- `target_type`: what was analyzed (athlete, team, session)
- `target_id`: specific entity ID
- `input_data`: input parameters (jsonb)
- `result`: analysis output (jsonb)
- `explanation`: XAI explanation
- `confidence_score`: AI confidence level
- `created_by`: analysis requester
- `created_at`: timestamp

### 5. saved_calculations
- `id`: uuid primary key
- `user_id`: calculation owner
- `organization_id`: organization context
- `calculator_type`: type of calculator
- `input_values`: input parameters (jsonb)
- `output_values`: results (jsonb)
- `athlete_id`: related athlete (optional)
- `notes`: user notes
- `created_at`: timestamp

## Security

### Row Level Security
- Reports: org member read, creator write
- AI conversations: user owns their conversations
- AI messages: via conversation ownership
- AI analyses: org member access
- Saved calculations: user ownership

## Notes
1. AI conversations are user-private by default
2. Reports can be shared within organization
3. AI analyses are stored for audit/regeneration
4. Calculations are saved per user
*/

-- ============================================
-- ENUM TYPES
-- ============================================

DO $$ BEGIN
  CREATE TYPE report_type AS ENUM (
    'athlete',
    'team',
    'session',
    'test',
    'progress',
    'injury',
    'custom'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM (
    'draft',
    'generating',
    'ready',
    'failed',
    'expired'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_format AS ENUM (
    'pdf',
    'excel',
    'word',
    'html',
    'json'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ai_agent_type AS ENUM (
    'coach',
    'analyst',
    'medical',
    'researcher',
    'nutrition',
    'performance',
    'recovery'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE message_role AS ENUM (
    'user',
    'assistant',
    'system'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE analysis_type AS ENUM (
    'performance_prediction',
    'injury_risk',
    'training_recommendation',
    'team_selection',
    'fatigue_analysis',
    'progress_evaluation',
    'benchmark_comparison'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- REPORTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  report_type report_type NOT NULL DEFAULT 'custom',
  format report_format NOT NULL DEFAULT 'pdf',
  scope jsonb DEFAULT '{}',
  filters jsonb DEFAULT '{}',
  date_range_start date,
  date_range_end date,
  status report_status NOT NULL DEFAULT 'draft',
  file_url text,
  file_size bigint,
  error_message text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accessed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_org ON reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(created_at);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- AI CONVERSATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_type ai_agent_type NOT NULL DEFAULT 'coach',
  title text,
  context jsonb DEFAULT '{}',
  is_archived boolean NOT NULL DEFAULT false,
  last_message_at timestamptz,
  message_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_org ON ai_conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_agent ON ai_conversations(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_archived ON ai_conversations(is_archived);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- AI MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  tokens_used integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_role ON ai_messages(role);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created ON ai_messages(created_at);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- AI ANALYSES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ai_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  analysis_type analysis_type NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  input_data jsonb NOT NULL DEFAULT '{}',
  result jsonb DEFAULT '{}',
  explanation text,
  confidence_score decimal(5,2),
  recommendations jsonb DEFAULT '[]',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_analyses_org ON ai_analyses(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_type ON ai_analyses(analysis_type);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_target ON ai_analyses(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_created_by ON ai_analyses(created_by);

ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SAVED CALCULATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS saved_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  calculator_type text NOT NULL,
  name text,
  input_values jsonb NOT NULL DEFAULT '{}',
  output_values jsonb NOT NULL DEFAULT '{}',
  athlete_id uuid REFERENCES athletes(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_calculations_user ON saved_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_type ON saved_calculations(calculator_type);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_athlete ON saved_calculations(athlete_id);

ALTER TABLE saved_calculations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER PREFERENCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  dashboard_layout jsonb DEFAULT '{}',
  default_view text DEFAULT 'dashboard',
  units_system text DEFAULT 'metric',
  date_format text DEFAULT 'DD/MM/YYYY',
  time_format text DEFAULT '24h',
  first_day_of_week integer DEFAULT 0,
  show_animations boolean DEFAULT true,
  auto_sync boolean DEFAULT true,
  offline_mode boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - REPORTS
-- ============================================

DROP POLICY IF EXISTS "reports_select_org" ON reports;

CREATE POLICY "reports_select_org" ON reports
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = reports.organization_id
      AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "reports_insert_org" ON reports;

CREATE POLICY "reports_insert_org" ON reports
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = reports.organization_id
      AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "reports_update_own" ON reports;

CREATE POLICY "reports_update_own" ON reports
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "reports_delete_own" ON reports;

CREATE POLICY "reports_delete_own" ON reports
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- ============================================
-- RLS POLICIES - AI CONVERSATIONS
-- ============================================

DROP POLICY IF EXISTS "ai_conv_select_own" ON ai_conversations;

CREATE POLICY "ai_conv_select_own" ON ai_conversations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "ai_conv_insert_own" ON ai_conversations;

CREATE POLICY "ai_conv_insert_own" ON ai_conversations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "ai_conv_update_own" ON ai_conversations;

CREATE POLICY "ai_conv_update_own" ON ai_conversations
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "ai_conv_delete_own" ON ai_conversations;

CREATE POLICY "ai_conv_delete_own" ON ai_conversations
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES - AI MESSAGES
-- ============================================

DROP POLICY IF EXISTS "ai_msg_select_own" ON ai_messages;

CREATE POLICY "ai_msg_select_own" ON ai_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations ac
      WHERE ac.id = ai_messages.conversation_id
      AND ac.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "ai_msg_insert_own" ON ai_messages;

CREATE POLICY "ai_msg_insert_own" ON ai_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations ac
      WHERE ac.id = ai_messages.conversation_id
      AND ac.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "ai_msg_delete_own" ON ai_messages;

CREATE POLICY "ai_msg_delete_own" ON ai_messages
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations ac
      WHERE ac.id = ai_messages.conversation_id
      AND ac.user_id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - AI ANALYSES
-- ============================================

DROP POLICY IF EXISTS "ai_analyses_select_org" ON ai_analyses;

CREATE POLICY "ai_analyses_select_org" ON ai_analyses
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = ai_analyses.organization_id
      AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "ai_analyses_insert_org" ON ai_analyses;

CREATE POLICY "ai_analyses_insert_org" ON ai_analyses
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = ai_analyses.organization_id
      AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "ai_analyses_update_own" ON ai_analyses;

CREATE POLICY "ai_analyses_update_own" ON ai_analyses
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- ============================================
-- RLS POLICIES - SAVED CALCULATIONS
-- ============================================

DROP POLICY IF EXISTS "calc_select_own" ON saved_calculations;

CREATE POLICY "calc_select_own" ON saved_calculations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "calc_insert_own" ON saved_calculations;

CREATE POLICY "calc_insert_own" ON saved_calculations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "calc_update_own" ON saved_calculations;

CREATE POLICY "calc_update_own" ON saved_calculations
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "calc_delete_own" ON saved_calculations;

CREATE POLICY "calc_delete_own" ON saved_calculations
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES - USER PREFERENCES
-- ============================================

DROP POLICY IF EXISTS "prefs_select_own" ON user_preferences;

CREATE POLICY "prefs_select_own" ON user_preferences
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "prefs_insert_own" ON user_preferences;

CREATE POLICY "prefs_insert_own" ON user_preferences
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "prefs_update_own" ON user_preferences;

CREATE POLICY "prefs_update_own" ON user_preferences
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS reports_updated_at ON reports;

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS ai_conversations_updated_at ON ai_conversations;

CREATE TRIGGER ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS user_preferences_updated_at ON user_preferences;

CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update conversation message count
CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ai_conversations
    SET message_count = message_count + 1,
        last_message_at = NEW.created_at,
        updated_at = now()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ai_conversations
    SET message_count = GREATEST(message_count - 1, 0),
        updated_at = now()
    WHERE id = OLD.conversation_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ai_message_count_trigger ON ai_messages;

CREATE TRIGGER ai_message_count_trigger
  AFTER INSERT OR DELETE ON ai_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_stats();

-- Auto-create user preferences on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_prefs ON auth.users;

CREATE TRIGGER on_auth_user_created_prefs
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_preferences();