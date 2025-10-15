-- =====================================================
-- AS1 Futures Database v3.0 - Create Functions
-- =====================================================
-- Description: Creates all database functions for AS1 Futures
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. VALIDATION FUNCTIONS
-- =====================================================

-- Function: Validate exclusive limit (3 per scout per tournament)
CREATE OR REPLACE FUNCTION check_exclusive_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_exclusive = true THEN
    IF (
      SELECT COUNT(*)
      FROM favorites
      WHERE scout_id = NEW.scout_id
        AND tournament_id = NEW.tournament_id
        AND is_exclusive = true
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) >= 3 THEN
      RAISE EXCEPTION 'Scout can only have 3 exclusive players per tournament';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-mark as favorite when exclusive
CREATE OR REPLACE FUNCTION auto_favorite_on_exclusive()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_exclusive = true THEN
    NEW.is_favorite := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Ensure single active tournament
CREATE OR REPLACE FUNCTION ensure_single_active_tournament()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    -- Deactivate all other tournaments
    UPDATE tournaments
    SET status = 'completed'
    WHERE status = 'active' AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. UTILITY FUNCTIONS
-- =====================================================

-- Function: Update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Get active tournament
CREATE OR REPLACE FUNCTION get_active_tournament()
RETURNS UUID AS $$
DECLARE
  active_tournament_id UUID;
BEGIN
  SELECT id INTO active_tournament_id
  FROM tournaments
  WHERE status = 'active'
  LIMIT 1;
  
  RETURN active_tournament_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. ANALYTICS FUNCTIONS
-- =====================================================

-- Function: Update player view stats
CREATE OR REPLACE FUNCTION update_player_view_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO player_view_stats (
    player_id,
    scout_id,
    tournament_id,
    total_views,
    total_duration_seconds,
    avg_scroll_depth,
    video_play_count,
    stats_expand_count,
    first_viewed_at,
    last_viewed_at
  )
  VALUES (
    NEW.player_id,
    NEW.scout_id,
    NEW.tournament_id,
    1,
    COALESCE(NEW.duration_seconds, 0),
    NEW.scroll_depth_percentage,
    CASE WHEN NEW.video_played THEN 1 ELSE 0 END,
    CASE WHEN NEW.stats_expanded THEN 1 ELSE 0 END,
    NEW.viewed_at,
    NEW.viewed_at
  )
  ON CONFLICT (player_id, scout_id, tournament_id) DO UPDATE SET
    total_views = player_view_stats.total_views + 1,
    total_duration_seconds = player_view_stats.total_duration_seconds + COALESCE(NEW.duration_seconds, 0),
    avg_scroll_depth = (
      (player_view_stats.avg_scroll_depth * player_view_stats.total_views + NEW.scroll_depth_percentage)
      / (player_view_stats.total_views + 1)
    ),
    video_play_count = player_view_stats.video_play_count + CASE WHEN NEW.video_played THEN 1 ELSE 0 END,
    stats_expand_count = player_view_stats.stats_expand_count + CASE WHEN NEW.stats_expanded THEN 1 ELSE 0 END,
    last_viewed_at = NEW.viewed_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Archive old player views
CREATE OR REPLACE FUNCTION archive_old_player_views()
RETURNS void AS $$
DECLARE
  cutoff_date TIMESTAMPTZ;
  archived_count INTEGER;
BEGIN
  -- Calculate cutoff date (12 months ago)
  cutoff_date := NOW() - INTERVAL '12 months';

  -- Move old records to archive
  WITH moved_rows AS (
    DELETE FROM player_views
    WHERE viewed_at < cutoff_date
    RETURNING *
  )
  INSERT INTO player_views_archive
  SELECT * FROM moved_rows;

  GET DIAGNOSTICS archived_count = ROW_COUNT;

  RAISE NOTICE 'Archived % records older than %', archived_count, cutoff_date;
END;
$$ LANGUAGE plpgsql;

-- Function: Create next month partition
CREATE OR REPLACE FUNCTION create_next_month_partition()
RETURNS void AS $$
DECLARE
  next_month_start DATE;
  next_month_end DATE;
  partition_name TEXT;
BEGIN
  -- Calculate next month
  next_month_start := DATE_TRUNC('month', NOW() + INTERVAL '1 month');
  next_month_end := next_month_start + INTERVAL '1 month';

  -- Generate partition name (e.g., player_views_2025_02)
  partition_name := 'player_views_' || TO_CHAR(next_month_start, 'YYYY_MM');

  -- Create partition
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF player_views FOR VALUES FROM (%L) TO (%L)',
    partition_name,
    next_month_start,
    next_month_end
  );

  RAISE NOTICE 'Created partition % for period % to %', partition_name, next_month_start, next_month_end;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. REPORTING FUNCTIONS
-- =====================================================

-- Function: Get scout activity summary
CREATE OR REPLACE FUNCTION get_scout_activity_summary(
  scout_uuid UUID,
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  scout_name TEXT,
  unique_players_viewed BIGINT,
  total_time_seconds BIGINT,
  total_views BIGINT,
  favorite_count BIGINT,
  exclusive_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.full_name,
    COUNT(DISTINCT pv.player_id) as unique_players_viewed,
    SUM(pv.duration_seconds) as total_time_seconds,
    COUNT(pv.id) as total_views,
    COUNT(DISTINCT f_fav.player_id) as favorite_count,
    COUNT(DISTINCT f_exc.player_id) as exclusive_count
  FROM scouts s
  LEFT JOIN player_views pv ON pv.scout_id = s.id 
    AND pv.viewed_at >= NOW() - (days_back || ' days')::INTERVAL
  LEFT JOIN favorites f_fav ON f_fav.scout_id = s.id AND f_fav.is_favorite = true
  LEFT JOIN favorites f_exc ON f_exc.scout_id = s.id AND f_exc.is_exclusive = true
  WHERE s.id = scout_uuid
  GROUP BY s.id, s.full_name;
END;
$$ LANGUAGE plpgsql;

-- Function: Get player popularity summary
CREATE OR REPLACE FUNCTION get_player_popularity_summary(
  tournament_uuid UUID DEFAULT NULL
)
RETURNS TABLE (
  player_name TEXT,
  team_name TEXT,
  group_name TEXT,
  total_views BIGINT,
  video_play_count BIGINT,
  favorited_by_scouts BIGINT,
  exclusive_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.full_name,
    t.name as team_name,
    tg.name as group_name,
    COALESCE(pvs.total_views, 0) as total_views,
    COALESCE(pvs.video_play_count, 0) as video_play_count,
    COUNT(DISTINCT f_fav.scout_id) as favorited_by_scouts,
    COUNT(DISTINCT f_exc.scout_id) as exclusive_count
  FROM players p
  JOIN teams t ON t.id = p.team_id
  JOIN tournament_groups tg ON tg.id = t.group_id
  LEFT JOIN player_view_stats pvs ON pvs.player_id = p.id
    AND (tournament_uuid IS NULL OR pvs.tournament_id = tournament_uuid)
  LEFT JOIN favorites f_fav ON f_fav.player_id = p.id AND f_fav.is_favorite = true
    AND (tournament_uuid IS NULL OR f_fav.tournament_id = tournament_uuid)
  LEFT JOIN favorites f_exc ON f_exc.player_id = p.id AND f_exc.is_exclusive = true
    AND (tournament_uuid IS NULL OR f_exc.tournament_id = tournament_uuid)
  WHERE tournament_uuid IS NULL OR p.tournament_id = tournament_uuid
  GROUP BY p.id, p.full_name, t.name, tg.name, pvs.total_views, pvs.video_play_count
  ORDER BY COALESCE(pvs.total_views, 0) DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ All functions created successfully!';
  RAISE NOTICE '🔧 Functions created: check_exclusive_limit, auto_favorite_on_exclusive, ensure_single_active_tournament, update_updated_at, get_active_tournament, update_player_view_stats, archive_old_player_views, create_next_month_partition, get_scout_activity_summary, get_player_popularity_summary';
  RAISE NOTICE '🔄 Next step: Run 03-create-triggers.sql';
END $$;

