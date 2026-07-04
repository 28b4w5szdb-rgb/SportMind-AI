/*
# Training and Performance Testing Tables

## Overview
Creates tables for training sessions, performance tests, and athlete assessments.
These are core to SportMind AI's sports science functionality.

## New Tables

### 1. training_sessions
- `id`: uuid primary key
- `organization_id`: owning organization
- `team_id`: associated team (nullable for individual sessions)
- `title`: session name/title
- `session_type`: type enum (technical, physical, tactical, recovery, match, testing)
- `date`: session date
- `start_time`: start time
- `end_time`: end time
- `duration_minutes`: calculated duration
- `location`: venue/location
- `objectives`: session objectives (jsonb array)
- `intensity`: planned intensity (low, moderate, high, very_high)
- `load_rating`: RPE-based session load
- `notes`: coach notes
- `created_by`: session creator
- `created_at`, `updated_at`: timestamps

### 2. session_attendees
- `id`: uuid primary key
- `session_id`: references training_sessions
- `athlete_id`: references athletes
- `attendance_status`: present, absent, injured, late, excused
- `participation_minutes`: actual participation time
- `perceived_exertion`: athlete's RPE (6-20 scale or 1-10)
- `notes`: individual notes
- UNIQUE(session_id, athlete_id)

### 3. performance_tests (test catalog)
- `id`: uuid primary key
- `name_en`: English name
- `name_ar`: Arabic name
- `category`: test category (endurance, speed, strength, power, agility, flexibility, body_composition)
- `description_en`: English description
- `description_ar`: Arabic description
- `unit`: measurement unit (seconds, meters, kg, ml/kg/min, etc.)
- `higher_is_better`: boolean for sorting
- `protocol`: test protocol instructions
- `equipment_needed`: required equipment
- `is_active`: test availability
- `created_by`: test creator
- `created_at`: timestamp

### 4. performance_tests (test results)
- `id`: uuid primary key
- `athlete_id`: athlete tested
- `test_type_id`: type of test
- `organization_id`: organization
- `date`: test date
- `value`: test result value
- `unit`: unit of measurement
- `conditions`: environmental conditions (jsonb)
- `notes`: tester notes
- `created_by`: tester

## Security

### Row Level Security
- Training sessions: org member access
- Session attendees: same as parent session
- Performance tests: org member read, coach/scientist write

## Notes
1. Session attendance tracks individual participation
2. Performance tests use a catalog approach for standardization
3. Test results support historical tracking
4. All data is organization-scoped for multi-tenant isolation
*/

-- ============================================
-- ENUM TYPES
-- ============================================

DO $$ BEGIN
  CREATE TYPE session_type AS ENUM (
    'technical',
    'physical',
    'tactical',
    'recovery',
    'match',
    'testing',
    'strength',
    'cardio',
    'flexibility',
    'individual'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE intensity_level AS ENUM (
    'low',
    'moderate',
    'high',
    'very_high'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM (
    'present',
    'absent',
    'injured',
    'late',
    'excused',
    'rest'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE test_category AS ENUM (
    'endurance',
    'speed',
    'strength',
    'power',
    'agility',
    'flexibility',
    'body_composition',
    'balance',
    'reaction',
    'aerobic_capacity',
    'anaerobic_capacity'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- TRAINING SESSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  title text NOT NULL,
  session_type session_type NOT NULL DEFAULT 'physical',
  date date NOT NULL,
  start_time time,
  end_time time,
  duration_minutes integer,
  location text,
  objectives jsonb DEFAULT '[]',
  intensity intensity_level DEFAULT 'moderate',
  load_rating decimal(3,1),
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_training_sessions_org ON training_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_team ON training_sessions(team_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON training_sessions(date);
CREATE INDEX IF NOT EXISTS idx_training_sessions_type ON training_sessions(session_type);

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SESSION ATTENDEES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS session_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  attendance_status attendance_status NOT NULL DEFAULT 'present',
  participation_minutes integer,
  perceived_exertion integer CHECK (perceived_exertion BETWEEN 1 AND 10),
  heart_rate_avg integer,
  heart_rate_max integer,
  notes text,
  
  UNIQUE(session_id, athlete_id)
);

CREATE INDEX IF NOT EXISTS idx_session_attendees_session ON session_attendees(session_id);
CREATE INDEX IF NOT EXISTS idx_session_attendees_athlete ON session_attendees(athlete_id);
CREATE INDEX IF NOT EXISTS idx_session_attendees_status ON session_attendees(attendance_status);

ALTER TABLE session_attendees ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TEST TYPES TABLE (catalog)
-- ============================================

CREATE TABLE IF NOT EXISTS test_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text,
  category test_category NOT NULL,
  description_en text,
  description_ar text,
  unit text NOT NULL,
  higher_is_better boolean NOT NULL DEFAULT false,
  protocol text,
  equipment_needed jsonb DEFAULT '[]',
  normative_data jsonb DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_types_category ON test_types(category);
CREATE INDEX IF NOT EXISTS idx_test_types_active ON test_types(is_active);

ALTER TABLE test_types ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PERFORMANCE TEST RESULTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS performance_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  test_type_id uuid NOT NULL REFERENCES test_types(id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  date date NOT NULL,
  value decimal(10,3) NOT NULL,
  unit text NOT NULL,
  conditions jsonb DEFAULT '{}',
  percentile_rank decimal(5,2),
  is_personal_best boolean DEFAULT false,
  notes text,
  raw_data jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_results_athlete ON performance_test_results(athlete_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_type ON performance_test_results(test_type_id);
CREATE INDEX IF NOT EXISTS idx_test_results_date ON performance_test_results(date);
CREATE INDEX IF NOT EXISTS idx_test_results_org ON performance_test_results(organization_id);

ALTER TABLE performance_test_results ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - TRAINING SESSIONS
-- ============================================

DROP POLICY IF EXISTS "training_select_org" ON training_sessions;

CREATE POLICY "training_select_org" ON training_sessions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = training_sessions.organization_id
      AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "training_insert_org" ON training_sessions;

CREATE POLICY "training_insert_org" ON training_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = training_sessions.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist')
    )
  );

DROP POLICY IF EXISTS "training_update_org" ON training_sessions;

CREATE POLICY "training_update_org" ON training_sessions
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = training_sessions.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = training_sessions.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist')
    )
  );

DROP POLICY IF EXISTS "training_delete_org" ON training_sessions;

CREATE POLICY "training_delete_org" ON training_sessions
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = training_sessions.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin')
    )
  );

-- ============================================
-- RLS POLICIES - SESSION ATTENDEES
-- ============================================

DROP POLICY IF EXISTS "attendees_select_org" ON session_attendees;

CREATE POLICY "attendees_select_org" ON session_attendees
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM training_sessions ts
      JOIN organization_members om ON om.organization_id = ts.organization_id
      WHERE ts.id = session_attendees.session_id
      AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "attendees_insert_org" ON session_attendees;

CREATE POLICY "attendees_insert_org" ON session_attendees
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM training_sessions ts
      JOIN organization_members om ON om.organization_id = ts.organization_id
      WHERE ts.id = session_attendees.session_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist')
    )
  );

DROP POLICY IF EXISTS "attendees_update_org" ON session_attendees;

CREATE POLICY "attendees_update_org" ON session_attendees
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM training_sessions ts
      JOIN organization_members om ON om.organization_id = ts.organization_id
      WHERE ts.id = session_attendees.session_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM training_sessions ts
      JOIN organization_members om ON om.organization_id = ts.organization_id
      WHERE ts.id = session_attendees.session_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist')
    )
  );

DROP POLICY IF EXISTS "attendees_delete_org" ON session_attendees;

CREATE POLICY "attendees_delete_org" ON session_attendees
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM training_sessions ts
      JOIN organization_members om ON om.organization_id = ts.organization_id
      WHERE ts.id = session_attendees.session_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach')
    )
  );

-- ============================================
-- RLS POLICIES - TEST TYPES
-- ============================================

DROP POLICY IF EXISTS "test_types_select_all" ON test_types;

CREATE POLICY "test_types_select_all" ON test_types
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "test_types_insert_admin" ON test_types;

CREATE POLICY "test_types_insert_admin" ON test_types
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.role IN ('admin', 'organization_admin', 'sports_scientist')
      AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "test_types_update_admin" ON test_types;

CREATE POLICY "test_types_update_admin" ON test_types
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.role IN ('admin', 'organization_admin', 'sports_scientist')
      AND om.user_id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - PERFORMANCE TEST RESULTS
-- ============================================

DROP POLICY IF EXISTS "test_results_select_org" ON performance_test_results;

CREATE POLICY "test_results_select_org" ON performance_test_results
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = performance_test_results.organization_id
      AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "test_results_insert_org" ON performance_test_results;

CREATE POLICY "test_results_insert_org" ON performance_test_results
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = performance_test_results.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist', 'analyst')
    )
  );

DROP POLICY IF EXISTS "test_results_update_org" ON performance_test_results;

CREATE POLICY "test_results_update_org" ON performance_test_results
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = performance_test_results.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = performance_test_results.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin', 'coach', 'sports_scientist')
    )
  );

DROP POLICY IF EXISTS "test_results_delete_org" ON performance_test_results;

CREATE POLICY "test_results_delete_org" ON performance_test_results
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = performance_test_results.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin')
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS training_sessions_updated_at ON training_sessions;

CREATE TRIGGER training_sessions_updated_at
  BEFORE UPDATE ON training_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- SEED TEST TYPES
-- ============================================

INSERT INTO test_types (name_en, name_ar, category, unit, higher_is_better, description_en, protocol) VALUES
  -- Endurance
  ('VO2 Max', 'الحد الأقصى لاستهلاك الأكسجين', 'endurance', 'ml/kg/min', true, 
   'Maximum oxygen uptake during exercise', 'Incremental treadmill test to exhaustion'),
  ('Beep Test', 'اختبار البيب', 'endurance', 'level', true, 
   'Multi-stage fitness test', '20m shuttle run at increasing speeds'),
  ('Cooper Test', 'اختبار كوبر', 'endurance', 'meters', true, 
   '12-minute run for distance', 'Maximum distance covered in 12 minutes'),
  
  -- Speed
  ('10m Sprint', 'عدو 10 متر', 'speed', 'seconds', false, 
   'Accelerating sprint over 10 meters', 'Flying start electronic timing'),
  ('30m Sprint', 'عدو 30 متر', 'speed', 'seconds', false, 
   'Full sprint over 30 meters', 'Standing start electronic timing'),
  ('505 Agility', 'اختبار اللياقة 505', 'agility', 'seconds', false, 
   'Change of direction speed test', 'Sprint 5m, turn, sprint 5m back'),
  
  -- Power
  ('Vertical Jump', 'القفز العمودي', 'power', 'cm', true, 
   'Maximum vertical jump height', 'Counter movement jump on force platform'),
  ('Broad Jump', 'القفز الطويل', 'power', 'cm', true, 
   'Standing long jump distance', 'Standing jump for maximum distance'),
  ('Medicine Ball Throw', 'رمي الكرة الطبية', 'power', 'meters', true, 
   'Seated medicine ball throw', 'Seated chest pass for distance'),
  
  -- Strength
  ('1RM Back Squat', 'الحد الأقصى للسكوات', 'strength', 'kg', true, 
   'One repetition maximum back squat', 'Progressive loading to 1RM'),
  ('1RM Bench Press', 'الحد الأقصى للضغط', 'strength', 'kg', true, 
   'One repetition maximum bench press', 'Progressive loading to 1RM'),
  
  -- Body Composition
  ('Body Fat %', 'نسبة الدهون', 'body_composition', '%', false, 
   'Body fat percentage measurement', 'Skinfold calipers or DEXA'),
  ('BMI', 'مؤشر كتلة الجسم', 'body_composition', 'kg/m²', false, 
   'Body Mass Index', 'Weight (kg) / Height (m)²'),
  
  -- Flexibility
  ('Sit and Reach', 'الجلوس والوصول', 'flexibility', 'cm', true, 
   'Lower back and hamstring flexibility', 'Seated forward reach test')
ON CONFLICT DO NOTHING;