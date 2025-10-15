-- =====================================================
-- AS1 Futures Database v3.0 - Create Tables
-- =====================================================
-- Description: Creates all table structures for AS1 Futures
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. TOURNAMENT MANAGEMENT TABLES
-- =====================================================

-- Tournaments table - Main tournament container
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

-- Tournament groups table - Dynamic groups per tournament
CREATE TABLE IF NOT EXISTS tournament_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  code TEXT NOT NULL CHECK (code ~ '^[A-Z]$'),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_tournament_group_code UNIQUE (tournament_id, code)
);

-- =====================================================
-- 2. APPLICATION TABLES
-- =====================================================

-- Scouts table - Extended user profiles
CREATE TABLE IF NOT EXISTS scouts (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  role TEXT NOT NULL DEFAULT 'scout' CHECK (role IN ('scout', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table - Tournament teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_code TEXT NOT NULL CHECK (team_code ~ '^[A-Z0-9_]{3,8}$'),
  name TEXT NOT NULL,
  group_id UUID NOT NULL REFERENCES tournament_groups(id) ON DELETE RESTRICT,
  logo_url TEXT,
  is_as1_team BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_tournament_team_code UNIQUE (tournament_id, team_code)
);

-- Players table - Player information
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  dni TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  jersey_number INTEGER NOT NULL CHECK (jersey_number BETWEEN 1 AND 99),
  position TEXT NOT NULL CHECK (position IN ('Goalkeeper', 'Defender', 'Midfielder', 'Forward')),
  dominant_foot TEXT CHECK (dominant_foot IN ('Left', 'Right', 'Both')),
  height_cm INTEGER CHECK (height_cm BETWEEN 120 AND 220),
  date_of_birth DATE,
  photo_url TEXT,
  photo_thumb_url TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_tournament_team_jersey UNIQUE (tournament_id, team_id, jersey_number)
);

-- Player videos table - Video highlights
CREATE TABLE IF NOT EXISTS player_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  video_type TEXT CHECK (video_type IN ('youtube', 'veo', 'other')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table - Tournament matches
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  match_code TEXT NOT NULL,
  group_id UUID NOT NULL REFERENCES tournament_groups(id) ON DELETE RESTRICT,
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT different_teams CHECK (home_team_id != away_team_id),
  CONSTRAINT unique_tournament_match_code UNIQUE (tournament_id, match_code)
);

-- Favorites table - Scout's favorite and exclusive players
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID NOT NULL REFERENCES scouts(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT true,
  is_exclusive BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_scout_player_tournament UNIQUE (scout_id, player_id, tournament_id)
);

-- =====================================================
-- 3. ANALYTICS TABLES
-- =====================================================

-- Player views table - Track when scouts view player details (partitioned)
CREATE TABLE IF NOT EXISTS player_views (
  id UUID DEFAULT gen_random_uuid(),
  scout_id UUID NOT NULL REFERENCES scouts(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_seconds INTEGER,
  session_id TEXT NOT NULL,
  scroll_depth_percentage INTEGER DEFAULT 0 CHECK (scroll_depth_percentage BETWEEN 0 AND 100),
  video_played BOOLEAN DEFAULT false,
  stats_expanded BOOLEAN DEFAULT false,
  user_agent TEXT,
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  PRIMARY KEY (id, viewed_at)
) PARTITION BY RANGE (viewed_at);

-- Create initial partitions for 2025
CREATE TABLE IF NOT EXISTS player_views_2025_01 PARTITION OF player_views
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE IF NOT EXISTS player_views_2025_02 PARTITION OF player_views
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE IF NOT EXISTS player_views_2025_03 PARTITION OF player_views
  FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

CREATE TABLE IF NOT EXISTS player_views_2025_04 PARTITION OF player_views
  FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');

CREATE TABLE IF NOT EXISTS player_views_2025_05 PARTITION OF player_views
  FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');

CREATE TABLE IF NOT EXISTS player_views_2025_06 PARTITION OF player_views
  FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');

CREATE TABLE IF NOT EXISTS player_views_2025_07 PARTITION OF player_views
  FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');

CREATE TABLE IF NOT EXISTS player_views_2025_08 PARTITION OF player_views
  FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');

CREATE TABLE IF NOT EXISTS player_views_2025_09 PARTITION OF player_views
  FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');

CREATE TABLE IF NOT EXISTS player_views_2025_10 PARTITION OF player_views
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE IF NOT EXISTS player_views_2025_11 PARTITION OF player_views
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE TABLE IF NOT EXISTS player_views_2025_12 PARTITION OF player_views
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Player view stats table - Pre-calculated analytics
CREATE TABLE IF NOT EXISTS player_view_stats (
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  scout_id UUID REFERENCES scouts(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  avg_scroll_depth INTEGER DEFAULT 0,
  video_play_count INTEGER DEFAULT 0,
  stats_expand_count INTEGER DEFAULT 0,
  first_viewed_at TIMESTAMPTZ,
  last_viewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (player_id, scout_id, tournament_id)
);

-- Player views archive table - Historical data
CREATE TABLE IF NOT EXISTS player_views_archive (
  LIKE player_views INCLUDING ALL
);

-- Player interactions table - Track specific scout actions
CREATE TABLE IF NOT EXISTS player_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id UUID NOT NULL REFERENCES scouts(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (
    action_type IN ('favorite', 'exclusive', 'remove', 'video_play', 'stats_expand')
  ),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id TEXT NOT NULL,
  metadata JSONB
);

-- Activity log table - Audit trail for admin actions
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES scouts(id) ON DELETE SET NULL,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ All tables created successfully!';
  RAISE NOTICE '📊 Tables created: tournaments, tournament_groups, scouts, teams, players, player_videos, matches, favorites, player_views (partitioned), player_view_stats, player_views_archive, player_interactions, activity_log';
  RAISE NOTICE '🔄 Next step: Run 02-create-functions.sql';
END $$;

