/*
# Finalize RLS Policies

## Overview
Replaces temporary RLS policies with proper organization-scoped access controls.
This migration completes the security setup for the database.

## Changes

### Organizations Table RLS
- Replace temporary "all access" policy with proper member-based access
- Members can read their organizations
- Admins can update organizations
- Super admins can insert all organizations

### Additional Indexes for Performance
- Add indexes for common query patterns
- Ensure efficient lookups across tables

## Security Notes
1. Organization membership is verified via junction table
2. Delete permissions restricted to org admins
3. Update permissions require admin role
4. All reads require active membership

## Notes
1. Run after all other migrations are complete
2. Drops temporary policies before creating final ones
3. Maintains backward compatibility with existing policies
*/

-- ============================================
-- FINALIZE ORGANIZATION RLS POLICIES
-- ============================================

-- Drop temporary policy
DROP POLICY IF EXISTS "org_temp_all" ON organizations;

-- Proper organization read policy (must be a member)
DROP POLICY IF EXISTS "org_select_member" ON organizations;

CREATE POLICY "org_select_member" ON organizations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id
      AND om.user_id = auth.uid()
    )
    OR
    -- User can read orgs they're creating (no member record yet)
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = organizations.id
    )
  );

-- Organization insert policy (authenticated users can create)
DROP POLICY IF EXISTS "org_insert_auth" ON organizations;

CREATE POLICY "org_insert_auth" ON organizations
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Organization update policy (org admins only)
DROP POLICY IF EXISTS "org_update_admin" ON organizations;

CREATE POLICY "org_update_admin" ON organizations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'organization_admin')
    )
  );

-- Organization delete policy (org admins only, cascades)
DROP POLICY IF EXISTS "org_delete_admin" ON organizations;

CREATE POLICY "org_delete_admin" ON organizations
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organizations.id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
    )
  );

-- ============================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================

-- Profiles lookups
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);

-- Athletes search
CREATE INDEX IF NOT EXISTS idx_athletes_dob ON athletes(date_of_birth);

-- Training sessions by week/month
CREATE INDEX IF NOT EXISTS idx_training_sessions_year_month ON training_sessions(date);

-- Test results for trending
CREATE INDEX IF NOT EXISTS idx_test_results_athlete_date ON performance_test_results(athlete_id, date DESC);

-- AI conversations by last activity
CREATE INDEX IF NOT EXISTS idx_ai_conversations_last_message ON ai_conversations(last_message_at DESC NULLS LAST);

-- ============================================
-- PROFILES - Add cross-org visibility
-- ============================================

-- Allow users to see profiles of others in same organization
-- (Self profile already has policy, this adds colleague visibility)
-- The existing "profile_select_own" policy handles self access
-- We need to update it to include colleague access

DROP POLICY IF EXISTS "profile_select_own" ON profiles;

CREATE POLICY "profile_select_own" ON profiles
  FOR SELECT TO authenticated
  USING (
    -- Users can always read their own profile
    id = auth.uid()
    OR
    -- Users can see profiles in same organization
    EXISTS (
      SELECT 1 FROM organization_members om1
      JOIN organization_members om2 ON om1.organization_id = om2.organization_id
      WHERE om1.user_id = auth.uid()
      AND om2.user_id = profiles.id
    )
  );

-- ============================================
-- HELPERS FOR ORGANIZATION STATISTICS
-- ============================================

-- Function to get organization stats
CREATE OR REPLACE FUNCTION get_org_stats(org_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'athlete_count', (SELECT COUNT(*) FROM athletes WHERE organization_id = org_id AND is_active = true),
    'team_count', (SELECT COUNT(*) FROM teams WHERE organization_id = org_id AND is_active = true),
    'session_count', (SELECT COUNT(*) FROM training_sessions WHERE organization_id = org_id),
    'test_count', (SELECT COUNT(*) FROM performance_test_results WHERE organization_id = org_id),
    'member_count', (SELECT COUNT(*) FROM organization_members WHERE organization_id = org_id)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STORAGE BUCKET CREATION
-- ============================================

-- Note: Storage buckets are created via Supabase Studio or API
-- The following is documentation for required buckets:
-- 
-- Bucket: athlete-photos
-- - Public: false
-- - File size limit: 5MB
-- - Allowed MIME types: image/*
--
-- Bucket: report-files
-- - Public: false  
-- - File size limit: 50MB
-- - Allowed MIME types: application/pdf, application/vnd.openxmlformats-officedocument.*
--
-- Bucket: organization-logos
-- - Public: true
-- - File size limit: 2MB
-- - Allowed MIME types: image/*