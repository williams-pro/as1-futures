-- =====================================================
-- AS1 Futures Database v3.0 - Create RLS Policies
-- =====================================================
-- Description: Creates Row Level Security policies for AS1 Futures
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. TOURNAMENT MANAGEMENT POLICIES
-- =====================================================

-- Tournaments policies
DROP POLICY IF EXISTS "Tournaments viewable by authenticated users" ON tournaments;
CREATE POLICY "Tournaments viewable by authenticated users"
  ON tournaments FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage tournaments" ON tournaments;
CREATE POLICY "Admins can manage tournaments"
  ON tournaments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tournament groups policies
DROP POLICY IF EXISTS "Groups viewable by authenticated users" ON tournament_groups;
CREATE POLICY "Groups viewable by authenticated users"
  ON tournament_groups FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage groups" ON tournament_groups;
CREATE POLICY "Admins can manage groups"
  ON tournament_groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 2. APPLICATION TABLE POLICIES
-- =====================================================

-- Scouts policies
DROP POLICY IF EXISTS "Scouts can view own profile" ON scouts;
CREATE POLICY "Scouts can view own profile"
  ON scouts FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Scouts can update own profile" ON scouts;
CREATE POLICY "Scouts can update own profile"
  ON scouts FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM scouts WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can view all scouts" ON scouts;
CREATE POLICY "Admins can view all scouts"
  ON scouts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage scouts" ON scouts;
CREATE POLICY "Admins can manage scouts"
  ON scouts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Teams policies
DROP POLICY IF EXISTS "Teams viewable by authenticated users" ON teams;
CREATE POLICY "Teams viewable by authenticated users"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage teams" ON teams;
CREATE POLICY "Admins can manage teams"
  ON teams FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Players policies
DROP POLICY IF EXISTS "Players viewable by authenticated users" ON players;
CREATE POLICY "Players viewable by authenticated users"
  ON players FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage players" ON players;
CREATE POLICY "Admins can manage players"
  ON players FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Player videos policies
DROP POLICY IF EXISTS "Videos viewable by authenticated users" ON player_videos;
CREATE POLICY "Videos viewable by authenticated users"
  ON player_videos FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage videos" ON player_videos;
CREATE POLICY "Admins can manage videos"
  ON player_videos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Matches policies
DROP POLICY IF EXISTS "Matches viewable by authenticated users" ON matches;
CREATE POLICY "Matches viewable by authenticated users"
  ON matches FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage matches" ON matches;
CREATE POLICY "Admins can manage matches"
  ON matches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Favorites policies
DROP POLICY IF EXISTS "Scouts can view own favorites" ON favorites;
CREATE POLICY "Scouts can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = scout_id);

DROP POLICY IF EXISTS "Scouts can insert own favorites" ON favorites;
CREATE POLICY "Scouts can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = scout_id);

DROP POLICY IF EXISTS "Scouts can update own favorites" ON favorites;
CREATE POLICY "Scouts can update own favorites"
  ON favorites FOR UPDATE
  USING (auth.uid() = scout_id)
  WITH CHECK (auth.uid() = scout_id);

DROP POLICY IF EXISTS "Scouts can delete own favorites" ON favorites;
CREATE POLICY "Scouts can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = scout_id);

DROP POLICY IF EXISTS "Admins can view all favorites" ON favorites;
CREATE POLICY "Admins can view all favorites"
  ON favorites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 3. ANALYTICS TABLE POLICIES
-- =====================================================

-- Player views policies
DROP POLICY IF EXISTS "Scouts can create own views" ON player_views;
CREATE POLICY "Scouts can create own views"
  ON player_views FOR INSERT
  WITH CHECK (auth.uid() = scout_id);

DROP POLICY IF EXISTS "Admins can view all analytics" ON player_views;
CREATE POLICY "Admins can view all analytics"
  ON player_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Player view stats policies
DROP POLICY IF EXISTS "Scouts can view own stats" ON player_view_stats;
CREATE POLICY "Scouts can view own stats"
  ON player_view_stats FOR SELECT
  USING (auth.uid() = scout_id);

DROP POLICY IF EXISTS "Admins can view all stats" ON player_view_stats;
CREATE POLICY "Admins can view all stats"
  ON player_view_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Player views archive policies
DROP POLICY IF EXISTS "Admins can view archive" ON player_views_archive;
CREATE POLICY "Admins can view archive"
  ON player_views_archive FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Player interactions policies
DROP POLICY IF EXISTS "Scouts can create own interactions" ON player_interactions;
CREATE POLICY "Scouts can create own interactions"
  ON player_interactions FOR INSERT
  WITH CHECK (auth.uid() = scout_id);

DROP POLICY IF EXISTS "Admins can view all interactions" ON player_interactions;
CREATE POLICY "Admins can view all interactions"
  ON player_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Activity log policies
DROP POLICY IF EXISTS "Admins can view activity log" ON activity_log;
CREATE POLICY "Admins can view activity log"
  ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scouts
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 4. GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant select on all tables for authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant all permissions for service_role (for admin operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ All RLS policies created successfully!';
  RAISE NOTICE '🔒 Policies created: 25+ security policies across all tables';
  RAISE NOTICE '👥 Access control: Scouts can only access their own data, Admins can access all data';
  RAISE NOTICE '🔄 Next step: Run 07-seed-data.sql';
END $$;
