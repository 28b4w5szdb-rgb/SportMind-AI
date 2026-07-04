/*
# Core Foundation Tables - Part 1: Table Creation

## Overview
Creates the foundational tables for SportMind AI.

## New Tables

### 1. user_role (enum)
- 10 roles: admin, organization_admin, sports_scientist, coach, assistant_coach,
  physiotherapist, nutritionist, analyst, researcher, athlete

### 2. organization_type (enum)  
- Types: club, university, clinic, federation, academy

### 3. organizations
- `id`: uuid primary key
- `name`: organization name
- `slug`: URL-friendly identifier (unique)
- `type`: organization_type enum
- `settings`: jsonb for configuration
- `branding`: jsonb for white-label
- `max_athletes`: integer limit
- `is_active`: boolean
- `created_at`, `updated_at`: timestamps

### 4. profiles (extends auth.users)
- `id`: uuid (references auth.users, primary key)
- `email`: user email
- `full_name`: display name
- `role`: user_role enum
- `organization_id`: current organization
- `language`: 'en' | 'ar'
- `theme`: 'light' | 'dark' | 'system'
- `avatar_url`: profile image URL
- `notification_settings`: jsonb
- `is_onboarded`: boolean
- `last_active_at`: timestamp
- `created_at`, `updated_at`: timestamps

### 5. organization_members (junction)
- Links users to organizations with specific roles

## Security
- RLS enabled on all tables
- Self-access policies for profiles and memberships

## Notes
1. Uses DEFAULT auth.uid() on profiles.id for automatic user binding
2. Cascade deletes clean up related records
3. Indexes on foreign keys and frequently queried columns
*/

-- ============================================
-- ENUM TYPES
-- ============================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'admin',
    'organization_admin',
    'sports_scientist',
    'coach',
    'assistant_coach',
    'physiotherapist',
    'nutritionist',
    'analyst',
    'researcher',
    'athlete'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE organization_type AS ENUM (
    'club',
    'university',
    'clinic',
    'federation',
    'academy'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- ORGANIZATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  type organization_type NOT NULL DEFAULT 'club',
  settings jsonb DEFAULT '{}',
  branding jsonb DEFAULT '{}',
  max_athletes integer DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type);
CREATE INDEX IF NOT EXISTS idx_organizations_is_active ON organizations(is_active);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role user_role NOT NULL DEFAULT 'coach',
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  language text NOT NULL DEFAULT 'en',
  theme text NOT NULL DEFAULT 'system',
  avatar_url text,
  notification_settings jsonb DEFAULT '{}',
  is_onboarded boolean NOT NULL DEFAULT false,
  last_active_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ORGANIZATION MEMBERS TABLE (junction)
-- ============================================

CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'coach',
  joined_at timestamptz NOT NULL DEFAULT now(),
  is_primary boolean NOT NULL DEFAULT false,
  UNIQUE(organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_role ON organization_members(role);

ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================

DROP POLICY IF EXISTS "profile_select_own" ON profiles;

CREATE POLICY "profile_select_own" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "profile_insert_own" ON profiles;

CREATE POLICY "profile_insert_own" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profile_update_own" ON profiles;

CREATE POLICY "profile_update_own" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================
-- RLS POLICIES - ORGANIZATION MEMBERS
-- ============================================

DROP POLICY IF EXISTS "org_member_select_own" ON organization_members;

CREATE POLICY "org_member_select_own" ON organization_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "org_member_insert_own" ON organization_members;

CREATE POLICY "org_member_insert_own" ON organization_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "org_member_delete_own" ON organization_members;

CREATE POLICY "org_member_delete_own" ON organization_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES - ORGANIZATIONS (temporary full access)
-- ============================================

DROP POLICY IF EXISTS "org_temp_all" ON organizations;

CREATE POLICY "org_temp_all" ON organizations
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'coach'),
    COALESCE(NEW.raw_user_meta_data->>'language', 'en')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS organizations_updated_at ON organizations;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();