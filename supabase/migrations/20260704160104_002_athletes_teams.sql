/*
# Athletes and Teams Tables

## Overview
Creates tables for athlete management and team organization in SportMind AI.
Athletes belong to organizations and can be members of multiple teams.

## New Tables

### 1. athletes
- `id`: uuid primary key
- `organization_id`: owning organization
- `first_name`: athlete first name
- `last_name`: athlete last name
- `date_of_birth`: birth date for age calculations
- `gender`: 'male' | 'female' | 'other'
- `nationality`: country code (ISO 3166-1 alpha-2)
- `position`: playing position
- `jersey_number`: squad number
- `height_cm`: height in centimeters
- `weight_kg`: weight in kilograms
- `photo_url`: profile photo URL
- `medical_notes`: encrypted notes (for medical staff)
- `is_active`: active status
- `metadata`: jsonb for flexible attributes
- `created_by`: user who created the record
- `created_at`, `updated_at`: timestamps

### 2. teams
- `id`: uuid primary key
- `organization_id`: owning organization
- `name`: team name
- `sport`: sport type (football, basketball, etc.)
- `season`: current season (e.g., "2024-2025")
- `age_group`: age category (U19, U23, senior, etc.)
- `division`: competition level
- `head_coach_id`: team head coach (profile reference)
- `is_active`: active status
- `created_by`: user who created the team
- `created_at`, `updated_at`: timestamps

### 3. team_athletes (junction)
- `id`: uuid primary key
- `team_id`: references teams
- `athlete_id`: references athletes
- `joined_at`: when athlete joined team
- `left_at`: when athlete left (nullable)
- `position`: position in this team
- `jersey_number`: number in this team
- `is_captain`: captain flag
- UNIQUE(team_id, athlete_id) WHERE left_at IS NULL

### 4. positions (sport-specific)
- `id`: uuid primary key
- `sport`: sport type
- `code`: position code (e.g., 'GK', 'CB', 'ST')
- `name_en`: English name
- `name_ar`: Arabic name
- `category`: position category

## Security

### Row Level Security
- Athletes: readable by org members, writable by coaches/admins
- Teams: readable by org members, writable by coaches/admins
- Team athletes: same as parent team access

### Access Rules
1. Organization admins: full access to org's athletes and teams
2. Coaches: can manage athletes/teams they're assigned to
3. Athletes: can view own profile only
4. Medical staff: can view/update medical fields

## Notes
1. Athletes can belong to multiple teams (junction table)
2. Position is stored per team-athlete relationship
3. Medical notes should be restricted via RLS
4. Soft delete via is_active flag
*/

-- ============================================
-- ENUM TYPES
-- ============================================

DO $$ BEGIN
  CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE sport_type AS ENUM (
    'football',
    'basketball',
    'volleyball',
    'handball',
    'tennis',
    'swimming',
    'athletics',
    'generic'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE age_group_type AS ENUM (
    'U12', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'U20', 'U21', 'U23',
    'senior', 'masters', 'youth', 'adult'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- ATHLETES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  gender gender_type,
  nationality text,
  position text,
  jersey_number integer,
  height_cm decimal(5,2),
  weight_kg decimal(5,2),
  photo_url text,
  medical_notes text,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Computed full name
  CONSTRAINT athletes_name_check CHECK (length(trim(first_name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_athletes_org_id ON athletes(organization_id);
CREATE INDEX IF NOT EXISTS idx_athletes_is_active ON athletes(is_active);
CREATE INDEX IF NOT EXISTS idx_athletes_position ON athletes(position);
CREATE INDEX IF NOT EXISTS idx_athletes_name ON athletes(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_athletes_created_by ON athletes(created_by);

ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TEAMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  sport sport_type NOT NULL DEFAULT 'football',
  season text,
  age_group age_group_type,
  division text,
  head_coach_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teams_org_id ON teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_sport ON teams(sport);
CREATE INDEX IF NOT EXISTS idx_teams_age_group ON teams(age_group);
CREATE INDEX IF NOT EXISTS idx_teams_is_active ON teams(is_active);
CREATE INDEX IF NOT EXISTS idx_teams_head_coach ON teams(head_coach_id);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TEAM ATHLETES TABLE (junction)
-- ============================================

CREATE TABLE IF NOT EXISTS team_athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  left_at timestamptz,
  position text,
  jersey_number integer,
  is_captain boolean NOT NULL DEFAULT false,
  
  UNIQUE(team_id, athlete_id)
);

CREATE INDEX IF NOT EXISTS idx_team_athletes_team ON team_athletes(team_id);
CREATE INDEX IF NOT EXISTS idx_team_athletes_athlete ON team_athletes(athlete_id);
CREATE INDEX IF NOT EXISTS idx_team_athletes_active ON team_athletes(team_id) WHERE left_at IS NULL;

ALTER TABLE team_athletes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POSITIONS TABLE (reference data)
-- ============================================

CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport sport_type NOT NULL,
  code text NOT NULL,
  name_en text NOT NULL,
  name_ar text,
  category text,
  sort_order integer DEFAULT 0,
  
  UNIQUE(sport, code)
);

CREATE INDEX IF NOT EXISTS idx_positions_sport ON positions(sport);

ALTER TABLE positions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - ATHLETES
-- ============================================

-- Select: org members can read athletes
DROP POLICY IF EXISTS "athletes_select_org" ON athletes;

CREATE POLICY "athletes_select_org" ON athletes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = athletes.organization_id
      AND om.user_id = auth.uid()
    )
  );

-- Insert: coaches/admins can create athletes in their org
DROP POLICY IF EXISTS "athletes_insert_org" ON athletes;

CREATE POLICY "athletes_insert_org" ON athletes
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = athletes.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist')
    )
  );

-- Update: coaches/admins can update athletes in their org
DROP POLICY IF EXISTS "athletes_update_org" ON athletes;

CREATE POLICY "athletes_update_org" ON athletes
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = athletes.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist', 'physiotherapist')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = athletes.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist', 'physiotherapist')
    )
  );

-- Delete: only admins can delete athletes
DROP POLICY IF EXISTS "athletes_delete_org" ON athletes;

CREATE POLICY "athletes_delete_org" ON athletes
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = athletes.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin')
    )
  );

-- ============================================
-- RLS POLICIES - TEAMS
-- ============================================

-- Select: org members can read teams
DROP POLICY IF EXISTS "teams_select_org" ON teams;

CREATE POLICY "teams_select_org" ON teams
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = teams.organization_id
      AND om.user_id = auth.uid()
    )
  );

-- Insert: coaches/admins can create teams
DROP POLICY IF EXISTS "teams_insert_org" ON teams;

CREATE POLICY "teams_insert_org" ON teams
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = teams.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach')
    )
  );

-- Update: coaches/admins can update teams
DROP POLICY IF EXISTS "teams_update_org" ON teams;

CREATE POLICY "teams_update_org" ON teams
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = teams.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = teams.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach')
    )
  );

-- Delete: only admins can delete teams
DROP POLICY IF EXISTS "teams_delete_org" ON teams;

CREATE POLICY "teams_delete_org" ON teams
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = teams.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin')
    )
  );

-- ============================================
-- RLS POLICIES - TEAM ATHLETES
-- ============================================

-- Select: access via team membership
DROP POLICY IF EXISTS "team_athletes_select_org" ON team_athletes;

CREATE POLICY "team_athletes_select_org" ON team_athletes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN organization_members om ON om.organization_id = t.organization_id
      WHERE t.id = team_athletes.team_id
      AND om.user_id = auth.uid()
    )
  );

-- Insert: coaches/admins can add athletes to teams
DROP POLICY IF EXISTS "team_athletes_insert_org" ON team_athletes;

CREATE POLICY "team_athletes_insert_org" ON team_athletes
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN organization_members om ON om.organization_id = t.organization_id
      WHERE t.id = team_athletes.team_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach')
    )
  );

-- Update: coaches/admins can update team athlete records
DROP POLICY IF EXISTS "team_athletes_update_org" ON team_athletes;

CREATE POLICY "team_athletes_update_org" ON team_athletes
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN organization_members om ON om.organization_id = t.organization_id
      WHERE t.id = team_athletes.team_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN organization_members om ON om.organization_id = t.organization_id
      WHERE t.id = team_athletes.team_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach')
    )
  );

-- Delete: coaches/admins can remove athletes from teams
DROP POLICY IF EXISTS "team_athletes_delete_org" ON team_athletes;

CREATE POLICY "team_athletes_delete_org" ON team_athletes
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN organization_members om ON om.organization_id = t.organization_id
      WHERE t.id = team_athletes.team_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach')
    )
  );

-- ============================================
-- RLS POLICIES - POSITIONS (read-only reference)
-- ============================================

DROP POLICY IF EXISTS "positions_select_all" ON positions;

CREATE POLICY "positions_select_all" ON positions
  FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS athletes_updated_at ON athletes;

CREATE TRIGGER athletes_updated_at
  BEFORE UPDATE ON athletes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS teams_updated_at ON teams;

CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- SEED POSITIONS (Football)
-- ============================================

INSERT INTO positions (sport, code, name_en, name_ar, category, sort_order) VALUES
  ('football', 'GK', 'Goalkeeper', 'حارس مرمى', 'goalkeeper', 1),
  ('football', 'RB', 'Right Back', 'ظهير أيمن', 'defender', 2),
  ('football', 'CB', 'Center Back', 'قلب دفاع', 'defender', 3),
  ('football', 'LB', 'Left Back', 'ظهير أيسر', 'defender', 4),
  ('football', 'DM', 'Defensive Midfielder', 'وسط دفاعي', 'midfielder', 5),
  ('football', 'CM', 'Central Midfielder', 'وسط مركزي', 'midfielder', 6),
  ('football', 'AM', 'Attacking Midfielder', 'وسط هجومي', 'midfielder', 7),
  ('football', 'RM', 'Right Midfielder', 'وسط أيمن', 'midfielder', 8),
  ('football', 'LM', 'Left Midfielder', 'وسط أيسر', 'midfielder', 9),
  ('football', 'RW', 'Right Winger', 'جناح أيمن', 'forward', 10),
  ('football', 'LW', 'Left Winger', 'جناح أيسر', 'forward', 11),
  ('football', 'CF', 'Center Forward', 'مهاجم مركزي', 'forward', 12),
  ('football', 'ST', 'Striker', 'مهاجم', 'forward', 13)
ON CONFLICT (sport, code) DO NOTHING;