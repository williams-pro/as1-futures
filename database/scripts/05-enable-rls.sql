-- =====================================================
-- AS1 Futures Database v3.0 - Enable Row Level Security
-- =====================================================
-- Description: Enables Row Level Security on all tables
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Tournament management tables
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_groups ENABLE ROW LEVEL SECURITY;

-- Application tables
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Analytics tables
ALTER TABLE player_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_view_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_views_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Row Level Security enabled on all tables!';
  RAISE NOTICE '🔒 RLS enabled on: tournaments, tournament_groups, scouts, teams, players, player_videos, matches, favorites, player_views, player_view_stats, player_views_archive, player_interactions, activity_log';
  RAISE NOTICE '🔄 Next step: Run 06-create-policies.sql';
END $$;

