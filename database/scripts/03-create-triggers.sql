-- =====================================================
-- AS1 Futures Database v3.0 - Create Triggers
-- =====================================================
-- Description: Creates all database triggers for AS1 Futures
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. VALIDATION TRIGGERS
-- =====================================================

-- Trigger: Validate exclusive limit
DROP TRIGGER IF EXISTS validate_exclusive_limit ON favorites;
CREATE TRIGGER validate_exclusive_limit
  BEFORE INSERT OR UPDATE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION check_exclusive_limit();

-- Trigger: Auto-favorite on exclusive
DROP TRIGGER IF EXISTS set_favorite_on_exclusive ON favorites;
CREATE TRIGGER set_favorite_on_exclusive
  BEFORE INSERT OR UPDATE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION auto_favorite_on_exclusive();

-- Trigger: Ensure single active tournament
DROP TRIGGER IF EXISTS ensure_single_active_tournament_trigger ON tournaments;
CREATE TRIGGER ensure_single_active_tournament_trigger
  BEFORE INSERT OR UPDATE ON tournaments
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION ensure_single_active_tournament();

-- =====================================================
-- 2. TIMESTAMP TRIGGERS
-- =====================================================

-- Trigger: Update timestamps for scouts
DROP TRIGGER IF EXISTS update_scouts_updated_at ON scouts;
CREATE TRIGGER update_scouts_updated_at
  BEFORE UPDATE ON scouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger: Update timestamps for tournaments
DROP TRIGGER IF EXISTS update_tournaments_updated_at ON tournaments;
CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON tournaments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger: Update timestamps for tournament_groups
DROP TRIGGER IF EXISTS update_tournament_groups_updated_at ON tournament_groups;
CREATE TRIGGER update_tournament_groups_updated_at
  BEFORE UPDATE ON tournament_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger: Update timestamps for teams
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger: Update timestamps for players
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger: Update timestamps for matches
DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger: Update timestamps for favorites
DROP TRIGGER IF EXISTS update_favorites_updated_at ON favorites;
CREATE TRIGGER update_favorites_updated_at
  BEFORE UPDATE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 3. ANALYTICS TRIGGERS
-- =====================================================

-- Trigger: Update player view stats
DROP TRIGGER IF EXISTS update_player_view_stats_trigger ON player_views;
CREATE TRIGGER update_player_view_stats_trigger
  AFTER INSERT ON player_views
  FOR EACH ROW
  EXECUTE FUNCTION update_player_view_stats();

-- =====================================================
-- 4. AUDIT TRIGGERS
-- =====================================================

-- Function: Log activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  entity_type TEXT;
  entity_id UUID;
  tournament_id UUID;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'updated';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'deleted';
  END IF;

  -- Determine entity type and ID
  entity_type := TG_TABLE_NAME;
  
  IF TG_OP = 'DELETE' THEN
    entity_id := OLD.id;
    -- Try to get tournament_id from OLD record
    CASE TG_TABLE_NAME
      WHEN 'tournaments' THEN tournament_id := OLD.id;
      WHEN 'tournament_groups' THEN tournament_id := OLD.tournament_id;
      WHEN 'teams' THEN tournament_id := OLD.tournament_id;
      WHEN 'players' THEN tournament_id := OLD.tournament_id;
      WHEN 'matches' THEN tournament_id := OLD.tournament_id;
      WHEN 'favorites' THEN tournament_id := OLD.tournament_id;
      ELSE tournament_id := NULL;
    END CASE;
  ELSE
    entity_id := NEW.id;
    -- Try to get tournament_id from NEW record
    CASE TG_TABLE_NAME
      WHEN 'tournaments' THEN tournament_id := NEW.id;
      WHEN 'tournament_groups' THEN tournament_id := NEW.tournament_id;
      WHEN 'teams' THEN tournament_id := NEW.tournament_id;
      WHEN 'players' THEN tournament_id := NEW.tournament_id;
      WHEN 'matches' THEN tournament_id := NEW.tournament_id;
      WHEN 'favorites' THEN tournament_id := NEW.tournament_id;
      ELSE tournament_id := NULL;
    END CASE;
  END IF;

  -- Insert activity log
  INSERT INTO activity_log (user_id, tournament_id, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    tournament_id,
    action_type,
    entity_type,
    entity_id,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', NOW()
    )
  );

  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Audit triggers for main tables
DROP TRIGGER IF EXISTS audit_tournaments ON tournaments;
CREATE TRIGGER audit_tournaments
  AFTER INSERT OR UPDATE OR DELETE ON tournaments
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

DROP TRIGGER IF EXISTS audit_tournament_groups ON tournament_groups;
CREATE TRIGGER audit_tournament_groups
  AFTER INSERT OR UPDATE OR DELETE ON tournament_groups
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

DROP TRIGGER IF EXISTS audit_teams ON teams;
CREATE TRIGGER audit_teams
  AFTER INSERT OR UPDATE OR DELETE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

DROP TRIGGER IF EXISTS audit_players ON players;
CREATE TRIGGER audit_players
  AFTER INSERT OR UPDATE OR DELETE ON players
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

DROP TRIGGER IF EXISTS audit_matches ON matches;
CREATE TRIGGER audit_matches
  AFTER INSERT OR UPDATE OR DELETE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

DROP TRIGGER IF EXISTS audit_favorites ON favorites;
CREATE TRIGGER audit_favorites
  AFTER INSERT OR UPDATE OR DELETE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION log_activity();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ All triggers created successfully!';
  RAISE NOTICE '🔧 Triggers created: validate_exclusive_limit, set_favorite_on_exclusive, ensure_single_active_tournament, update_*_updated_at, update_player_view_stats_trigger, audit_*';
  RAISE NOTICE '🔄 Next step: Run 04-create-indexes.sql';
END $$;

