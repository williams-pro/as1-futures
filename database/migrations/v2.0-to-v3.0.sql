-- =====================================================
-- AS1 Futures Database Migration: v2.0 to v3.0
-- =====================================================
-- Description: Migrates from single-tournament to multi-tournament architecture
-- Version: 3.0
-- Last Updated: January 2025
-- WARNING: This is a major architectural change. Backup your database first!
-- =====================================================

-- =====================================================
-- STEP 1: CREATE TOURNAMENTS TABLE
-- =====================================================

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  season TEXT CHECK (season IN ('Spring', 'Summer', 'Fall', 'Winter', 'Annual')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'active', 'completed', 'archived')
  ),
  description TEXT,
  max_groups INTEGER NOT NULL DEFAULT 2 CHECK (max_groups BETWEEN 1 AND 10),
  teams_per_group INTEGER NOT NULL DEFAULT 5 CHECK (teams_per_group BETWEEN 3 AND 10),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_date_range CHECK (end_date > start_date),
  CONSTRAINT unique_tournament_name_year UNIQUE (name, year)
);

-- Create default tournament for existing data
INSERT INTO tournaments (id, name, year, start_date, end_date, status, description)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  'AS1 Futures Tournament 2025',
  2025,
  '2025-01-01',
  '2025-12-31',
  'active',
  'Migrated from v2.0 - contains all existing data'
) ON CONFLICT (name, year) DO NOTHING;

-- =====================================================
-- STEP 2: ADD TOURNAMENT_ID TO ALL TABLES
-- =====================================================

-- Add nullable tournament_id columns
ALTER TABLE tournament_groups ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id);
ALTER TABLE players ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id);
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id);
ALTER TABLE player_views ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id);
ALTER TABLE player_view_stats ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id);
ALTER TABLE player_interactions ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id);
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id);

-- =====================================================
-- STEP 3: MIGRATE EXISTING DATA
-- =====================================================

-- Set all existing data to default tournament
UPDATE tournament_groups SET tournament_id = '00000000-0000-0000-0000-000000000010' WHERE tournament_id IS NULL;
UPDATE teams SET tournament_id = '00000000-0000-0000-0000-000000000010' WHERE tournament_id IS NULL;
UPDATE players SET tournament_id = '00000000-0000-0000-0000-000000000010' WHERE tournament_id IS NULL;
UPDATE matches SET tournament_id = '00000000-0000-0000-0000-000000000010' WHERE tournament_id IS NULL;
UPDATE favorites SET tournament_id = '00000000-0000-0000-0000-000000000010' WHERE tournament_id IS NULL;
UPDATE player_views SET tournament_id = '00000000-0000-0000-0000-000000000010' WHERE tournament_id IS NULL;
UPDATE player_view_stats SET tournament_id = '00000000-0000-0000-0000-000000000010' WHERE tournament_id IS NULL;
UPDATE player_interactions SET tournament_id = '00000000-0000-0000-0000-000000000010' WHERE tournament_id IS NULL;
-- activity_log.tournament_id remains nullable

-- =====================================================
-- STEP 4: MAKE TOURNAMENT_ID NOT NULL
-- =====================================================

-- Make tournament_id NOT NULL for all tables
ALTER TABLE tournament_groups ALTER COLUMN tournament_id SET NOT NULL;
ALTER TABLE teams ALTER COLUMN tournament_id SET NOT NULL;
ALTER TABLE players ALTER COLUMN tournament_id SET NOT NULL;
ALTER TABLE matches ALTER COLUMN tournament_id SET NOT NULL;
ALTER TABLE favorites ALTER COLUMN tournament_id SET NOT NULL;
ALTER TABLE player_views ALTER COLUMN tournament_id SET NOT NULL;
ALTER TABLE player_view_stats ALTER COLUMN tournament_id SET NOT NULL;
ALTER TABLE player_interactions ALTER COLUMN tournament_id SET NOT NULL;
-- activity_log.tournament_id remains nullable

-- =====================================================
-- STEP 5: UPDATE UNIQUE CONSTRAINTS
-- =====================================================

-- Drop old constraints
ALTER TABLE tournament_groups DROP CONSTRAINT IF EXISTS tournament_groups_code_key;
ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_team_code_key;
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_match_code_key;
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS unique_scout_player;
ALTER TABLE players DROP CONSTRAINT IF EXISTS unique_team_jersey;

-- Add new tournament-scoped constraints
ALTER TABLE tournament_groups ADD CONSTRAINT unique_tournament_group_code 
  UNIQUE (tournament_id, code);
ALTER TABLE teams ADD CONSTRAINT unique_tournament_team_code 
  UNIQUE (tournament_id, team_code);
ALTER TABLE matches ADD CONSTRAINT unique_tournament_match_code 
  UNIQUE (tournament_id, match_code);
ALTER TABLE favorites ADD CONSTRAINT unique_scout_player_tournament 
  UNIQUE (scout_id, player_id, tournament_id);
ALTER TABLE players ADD CONSTRAINT unique_tournament_team_jersey 
  UNIQUE (tournament_id, team_id, jersey_number);

-- =====================================================
-- STEP 6: UPDATE PRIMARY KEYS
-- =====================================================

-- Update player_view_stats primary key
ALTER TABLE player_view_stats DROP CONSTRAINT IF EXISTS player_view_stats_pkey;
ALTER TABLE player_view_stats ADD PRIMARY KEY (player_id, scout_id, tournament_id);

-- =====================================================
-- STEP 7: CREATE NEW INDEXES
-- =====================================================

-- Add tournament_id to existing indexes
CREATE INDEX IF NOT EXISTS idx_teams_tournament ON teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_players_tournament ON players(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_favorites_tournament ON favorites(tournament_id);
CREATE INDEX IF NOT EXISTS idx_player_views_tournament ON player_views(tournament_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_player_view_stats_tournament ON player_view_stats(tournament_id);
CREATE INDEX IF NOT EXISTS idx_player_interactions_tournament ON player_interactions(tournament_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_tournament ON activity_log(tournament_id);

-- =====================================================
-- STEP 8: VERIFY MIGRATION
-- =====================================================

-- Check all records have tournament_id
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM tournament_groups WHERE tournament_id IS NULL;
  IF null_count > 0 THEN
    RAISE EXCEPTION 'tournament_groups has % records with NULL tournament_id', null_count;
  END IF;

  SELECT COUNT(*) INTO null_count FROM teams WHERE tournament_id IS NULL;
  IF null_count > 0 THEN
    RAISE EXCEPTION 'teams has % records with NULL tournament_id', null_count;
  END IF;

  SELECT COUNT(*) INTO null_count FROM players WHERE tournament_id IS NULL;
  IF null_count > 0 THEN
    RAISE EXCEPTION 'players has % records with NULL tournament_id', null_count;
  END IF;

  SELECT COUNT(*) INTO null_count FROM matches WHERE tournament_id IS NULL;
  IF null_count > 0 THEN
    RAISE EXCEPTION 'matches has % records with NULL tournament_id', null_count;
  END IF;

  SELECT COUNT(*) INTO null_count FROM favorites WHERE tournament_id IS NULL;
  IF null_count > 0 THEN
    RAISE EXCEPTION 'favorites has % records with NULL tournament_id', null_count;
  END IF;

  RAISE NOTICE '✅ Migration verification passed! All records have tournament_id assigned.';
END $$;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '🎉 Migration from v2.0 to v3.0 completed successfully!';
  RAISE NOTICE '📊 All existing data has been assigned to default tournament: AS1 Futures Tournament 2025';
  RAISE NOTICE '🔒 New constraints and indexes created for tournament-scoped data';
  RAISE NOTICE '⚠️  Next steps:';
  RAISE NOTICE '   1. Update application code to use tournament-scoped queries';
  RAISE NOTICE '   2. Test all functionality thoroughly';
  RAISE NOTICE '   3. Monitor performance and data integrity';
  RAISE NOTICE '   4. Consider creating additional tournaments as needed';
END $$;

