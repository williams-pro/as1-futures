-- =====================================================
-- AS1 Futures Database v3.0 - Create Indexes
-- =====================================================
-- Description: Creates all performance indexes for AS1 Futures
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. TOURNAMENT MANAGEMENT INDEXES
-- =====================================================

-- Tournaments indexes
CREATE INDEX IF NOT EXISTS idx_tournaments_year ON tournaments(year);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tournaments_active ON tournaments(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_tournaments_created_by ON tournaments(created_by);

-- Tournament groups indexes
CREATE INDEX IF NOT EXISTS idx_tournament_groups_tournament ON tournament_groups(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_groups_code ON tournament_groups(tournament_id, code);
CREATE INDEX IF NOT EXISTS idx_tournament_groups_active ON tournament_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_tournament_groups_order ON tournament_groups(tournament_id, display_order);

-- =====================================================
-- 2. APPLICATION TABLE INDEXES
-- =====================================================

-- Scouts indexes
CREATE INDEX IF NOT EXISTS idx_scouts_email ON scouts(email);
CREATE INDEX IF NOT EXISTS idx_scouts_role ON scouts(role);
CREATE INDEX IF NOT EXISTS idx_scouts_active ON scouts(is_active);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_tournament ON teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_teams_group ON teams(group_id);
CREATE INDEX IF NOT EXISTS idx_teams_as1 ON teams(is_as1_team);
CREATE INDEX IF NOT EXISTS idx_teams_code ON teams(tournament_id, team_code);

-- Players indexes
CREATE INDEX IF NOT EXISTS idx_players_tournament ON players(tournament_id);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(full_name);
CREATE INDEX IF NOT EXISTS idx_players_dni ON players(dni) WHERE dni IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_players_jersey ON players(tournament_id, team_id, jersey_number);

-- Player videos indexes
CREATE INDEX IF NOT EXISTS idx_player_videos_player ON player_videos(player_id);
CREATE INDEX IF NOT EXISTS idx_player_videos_order ON player_videos(player_id, display_order);

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_group ON matches(group_id);
CREATE INDEX IF NOT EXISTS idx_matches_home_team ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_code ON matches(tournament_id, match_code);
CREATE INDEX IF NOT EXISTS idx_matches_datetime ON matches(match_date, match_time);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS idx_favorites_scout ON favorites(scout_id);
CREATE INDEX IF NOT EXISTS idx_favorites_player ON favorites(player_id);
CREATE INDEX IF NOT EXISTS idx_favorites_tournament ON favorites(tournament_id);
CREATE INDEX IF NOT EXISTS idx_favorites_scout_tournament ON favorites(scout_id, tournament_id);
CREATE INDEX IF NOT EXISTS idx_favorites_scout_favorite ON favorites(scout_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_favorites_scout_exclusive ON favorites(scout_id, is_exclusive) WHERE is_exclusive = true;
CREATE INDEX IF NOT EXISTS idx_favorites_order ON favorites(scout_id, display_order);
CREATE INDEX IF NOT EXISTS idx_favorites_player_tournament ON favorites(player_id, tournament_id);

-- =====================================================
-- 3. ANALYTICS TABLE INDEXES
-- =====================================================

-- Player views indexes (on partitioned table)
CREATE INDEX IF NOT EXISTS idx_player_views_scout ON player_views(scout_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_player_views_player ON player_views(player_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_player_views_tournament ON player_views(tournament_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_player_views_session ON player_views(session_id);
CREATE INDEX IF NOT EXISTS idx_player_views_device ON player_views(device_type);
CREATE INDEX IF NOT EXISTS idx_player_views_recent ON player_views(viewed_at DESC);

-- Player view stats indexes
CREATE INDEX IF NOT EXISTS idx_player_view_stats_player ON player_view_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_view_stats_scout ON player_view_stats(scout_id);
CREATE INDEX IF NOT EXISTS idx_player_view_stats_tournament ON player_view_stats(tournament_id);
CREATE INDEX IF NOT EXISTS idx_player_view_stats_views ON player_view_stats(total_views DESC);
CREATE INDEX IF NOT EXISTS idx_player_view_stats_last_viewed ON player_view_stats(last_viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_player_view_stats_scout_tournament ON player_view_stats(scout_id, tournament_id);

-- Player views archive indexes (same as main table)
CREATE INDEX IF NOT EXISTS idx_player_views_archive_scout ON player_views_archive(scout_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_player_views_archive_player ON player_views_archive(player_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_player_views_archive_tournament ON player_views_archive(tournament_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_player_views_archive_date ON player_views_archive(viewed_at);

-- Player interactions indexes
CREATE INDEX IF NOT EXISTS idx_player_interactions_scout ON player_interactions(scout_id);
CREATE INDEX IF NOT EXISTS idx_player_interactions_player ON player_interactions(player_id);
CREATE INDEX IF NOT EXISTS idx_player_interactions_tournament ON player_interactions(tournament_id);
CREATE INDEX IF NOT EXISTS idx_player_interactions_action ON player_interactions(action_type);
CREATE INDEX IF NOT EXISTS idx_player_interactions_timestamp ON player_interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_player_interactions_scout_tournament ON player_interactions(scout_id, tournament_id);

-- Activity log indexes
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_tournament ON activity_log(tournament_id);
CREATE INDEX IF NOT EXISTS idx_activity_date ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_user_tournament ON activity_log(user_id, tournament_id);

-- =====================================================
-- 4. COMPOSITE INDEXES FOR COMMON QUERIES
-- =====================================================

-- Common query patterns
CREATE INDEX IF NOT EXISTS idx_teams_tournament_group ON teams(tournament_id, group_id);
CREATE INDEX IF NOT EXISTS idx_players_team_position ON players(team_id, position);
CREATE INDEX IF NOT EXISTS idx_players_tournament_position ON players(tournament_id, position);
CREATE INDEX IF NOT EXISTS idx_matches_tournament_group_date ON matches(tournament_id, group_id, match_date);
CREATE INDEX IF NOT EXISTS idx_favorites_scout_tournament_favorite ON favorites(scout_id, tournament_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_favorites_scout_tournament_exclusive ON favorites(scout_id, tournament_id, is_exclusive);

-- =====================================================
-- 5. PARTIAL INDEXES FOR PERFORMANCE
-- =====================================================

-- Active records only
CREATE INDEX IF NOT EXISTS idx_tournaments_active_only ON tournaments(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_tournament_groups_active_only ON tournament_groups(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_scouts_active_only ON scouts(id) WHERE is_active = true;

-- Recent activity
-- Note: Time-based indexes with NOW() are not supported in PostgreSQL
-- These can be created dynamically when needed or use application-level filtering

-- High-value players (frequently viewed)
CREATE INDEX IF NOT EXISTS idx_player_view_stats_high_views ON player_view_stats(player_id, total_views DESC) WHERE total_views >= 10;

-- =====================================================
-- 6. TEXT SEARCH INDEXES
-- =====================================================

-- Full-text search on player names
CREATE INDEX IF NOT EXISTS idx_players_name_fts ON players USING gin(to_tsvector('english', full_name));
CREATE INDEX IF NOT EXISTS idx_players_name_trgm ON players USING gin(full_name gin_trgm_ops);

-- Full-text search on team names
CREATE INDEX IF NOT EXISTS idx_teams_name_fts ON teams USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_teams_name_trgm ON teams USING gin(name gin_trgm_ops);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ All indexes created successfully!';
  RAISE NOTICE '📊 Indexes created: 50+ performance indexes across all tables';
  RAISE NOTICE '🚀 Performance optimizations: composite indexes, partial indexes, text search indexes';
  RAISE NOTICE '🔄 Next step: Run 05-enable-rls.sql';
END $$;
