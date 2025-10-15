-- =====================================================
-- AS1 Futures Database v3.0 - Seed Initial Data
-- =====================================================
-- Description: Seeds initial data for AS1 Futures
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. CREATE ADMIN AND SCOUT USERS
-- =====================================================
-- NOTE: Users must be created manually in Supabase Auth Dashboard first
-- Go to Authentication > Users > Add user
-- 
-- Admin User:
-- - Email: williamsblanco216@gmail.com
-- - Password: admin123
-- - User ID: 00000000-0000-0000-0000-000000000001
--
-- Scout User:
-- - Email: williams.blanco@prointernacional.com  
-- - Password: scout123
-- - User ID: 00000000-0000-0000-0000-000000000002
--
-- After creating users in Auth, run this script to insert scout profiles:

-- Insert admin user (run after creating user in Auth)
-- INSERT INTO scouts (id, email, first_name, last_name, role, is_active)
-- VALUES (
--   '00000000-0000-0000-0000-000000000001',
--   'williamsblanco216@gmail.com',
--   'Williams',
--   'Blanco',
--   'admin',
--   true
-- ) ON CONFLICT (id) DO UPDATE SET
--   email = EXCLUDED.email,
--   first_name = EXCLUDED.first_name,
--   last_name = EXCLUDED.last_name,
--   role = EXCLUDED.role,
--   is_active = EXCLUDED.is_active;

-- Insert scout user (run after creating user in Auth)
-- INSERT INTO scouts (id, email, first_name, last_name, role, is_active)
-- VALUES (
--   '00000000-0000-0000-0000-000000000002',
--   'williams.blanco@prointernacional.com',
--   'Williams',
--   'Blanco',
--   'scout',
--   true
-- ) ON CONFLICT (id) DO UPDATE SET
--   email = EXCLUDED.email,
--   first_name = EXCLUDED.first_name,
--   last_name = EXCLUDED.last_name,
--   role = EXCLUDED.role,
--   is_active = EXCLUDED.is_active;

-- =====================================================
-- 2. CREATE DEFAULT TOURNAMENT
-- =====================================================

-- Insert default tournament
INSERT INTO tournaments (
  id,
  name,
  year,
  season,
  start_date,
  end_date,
  status,
  description,
  max_groups,
  teams_per_group,
  created_by
) VALUES (
  '00000000-0000-0000-0000-000000000010',
  'AS1 Futures Tournament 2025',
  2025,
  'Spring',
  '2025-01-01',
  '2025-12-31',
  'active',
  'Main AS1 Futures tournament for 2025 season',
  2,
  5,
  NULL  -- Will be updated when admin user is created
) ON CONFLICT (name, year) DO UPDATE SET
  status = EXCLUDED.status,
  description = EXCLUDED.description,
  updated_at = NOW();

-- =====================================================
-- 3. CREATE TOURNAMENT GROUPS
-- =====================================================

-- Insert Group A
INSERT INTO tournament_groups (
  id,
  tournament_id,
  code,
  name,
  display_order,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000010',
  'A',
  'Group A',
  1,
  true
) ON CONFLICT (tournament_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- Insert Group B
INSERT INTO tournament_groups (
  id,
  tournament_id,
  code,
  name,
  display_order,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000021',
  '00000000-0000-0000-0000-000000000010',
  'B',
  'Group B',
  2,
  true
) ON CONFLICT (tournament_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- =====================================================
-- 4. CREATE TEAMS
-- =====================================================

-- Group A Teams
INSERT INTO teams (id, tournament_id, team_code, name, group_id, logo_url, is_as1_team) VALUES
('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000010', 'FARCOS', 'Great Farcos FC', '00000000-0000-0000-0000-000000000020', '/teams/GREAT_FARCOS_FC_A.png', true),
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000010', 'ATTRAM', 'Attram De Visser', '00000000-0000-0000-0000-000000000020', '/teams/ATTRAM_DE_VISSER_A.png', false),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000010', 'DWISE', 'Dwise XI', '00000000-0000-0000-0000-000000000020', '/teams/DWISE_XI_A.png', false),
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000010', 'JEK', 'JEK FC', '00000000-0000-0000-0000-000000000020', '/teams/JEK_FC_A.png', false),
('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000010', 'SOAR', 'Soar Academy', '00000000-0000-0000-0000-000000000020', '/teams/SOAR_ACADEMY_A.png', false);

-- Group B Teams (placeholder teams)
INSERT INTO teams (id, tournament_id, team_code, name, group_id, is_as1_team) VALUES
('00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000010', 'TEAM_B1', 'Team B1', '00000000-0000-0000-0000-000000000021', false),
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000010', 'TEAM_B2', 'Team B2', '00000000-0000-0000-0000-000000000021', false),
('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000010', 'TEAM_B3', 'Team B3', '00000000-0000-0000-0000-000000000021', false),
('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000010', 'TEAM_B4', 'Team B4', '00000000-0000-0000-0000-000000000021', false),
('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000010', 'TEAM_B5', 'Team B5', '00000000-0000-0000-0000-000000000021', false);

-- =====================================================
-- 5. CREATE SAMPLE PLAYERS (JEK FC - Group A)
-- =====================================================

-- JEK FC Players (real data)
INSERT INTO players (id, tournament_id, team_id, first_name, last_name, jersey_number, position, dominant_foot, height_cm, date_of_birth, photo_url) VALUES
('00000000-0000-0000-0000-000000001000', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Carlos', 'Mendoza', 1, 'Goalkeeper', 'Right', 185, '2005-03-15', '/players/JEK_FC_1.jpg'),
('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Diego', 'Rodriguez', 2, 'Defender', 'Right', 178, '2005-07-22', '/players/JEK_FC_2.jpg'),
('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Luis', 'Garcia', 3, 'Defender', 'Left', 182, '2005-01-10', '/players/JEK_FC_3.jpg'),
('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Miguel', 'Lopez', 4, 'Defender', 'Right', 180, '2005-09-05', '/players/JEK_FC_4.jpg'),
('00000000-0000-0000-0000-000000001004', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Javier', 'Martinez', 6, 'Midfielder', 'Right', 175, '2005-04-18', '/players/JEK_FC_6.jpg'),
('00000000-0000-0000-0000-000000001005', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Antonio', 'Sanchez', 7, 'Midfielder', 'Left', 177, '2005-11-30', '/players/JEK_FC_7.jpg'),
('00000000-0000-0000-0000-000000001006', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Fernando', 'Hernandez', 9, 'Forward', 'Right', 183, '2005-06-12', '/players/JEK_FC_9.jpg'),
('00000000-0000-0000-0000-000000001007', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Roberto', 'Jimenez', 11, 'Forward', 'Left', 179, '2005-08-25', '/players/JEK_FC_11.jpg'),
('00000000-0000-0000-0000-000000001008', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Pablo', 'Torres', 12, 'Midfielder', 'Right', 176, '2005-02-14', '/players/JEK_FC_12.jpg'),
('00000000-0000-0000-0000-000000001009', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'Sergio', 'Vargas', 15, 'Defender', 'Right', 181, '2005-10-08', '/players/JEK_FC_15.jpg');

-- =====================================================
-- 6. CREATE SAMPLE MATCHES
-- =====================================================

-- Group A Matches
INSERT INTO matches (id, tournament_id, match_code, group_id, home_team_id, away_team_id, match_date, match_time, video_url) VALUES
('00000000-0000-0000-0000-000000002000', '00000000-0000-0000-0000-000000000010', 'DAY1_MATCH1', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000101', '2025-10-21', '08:15:00', 'https://youtube.com/watch?v=example1'),
('00000000-0000-0000-0000-000000002001', '00000000-0000-0000-0000-000000000010', 'DAY1_MATCH2', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000100', '2025-10-21', '09:45:00', 'https://youtube.com/watch?v=example2'),
('00000000-0000-0000-0000-000000002002', '00000000-0000-0000-0000-000000000010', 'DAY2_MATCH1', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000103', '2025-10-22', '08:15:00', 'https://youtube.com/watch?v=example3'),
('00000000-0000-0000-0000-000000002003', '00000000-0000-0000-0000-000000000010', 'DAY2_MATCH2', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000100', '2025-10-22', '09:45:00', 'https://youtube.com/watch?v=example4'),
('00000000-0000-0000-0000-000000002004', '00000000-0000-0000-0000-000000000010', 'DAY3_MATCH1', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000103', '2025-10-23', '08:15:00', 'https://youtube.com/watch?v=example5'),
('00000000-0000-0000-0000-000000002005', '00000000-0000-0000-0000-000000000010', 'DAY3_MATCH2', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000102', '2025-10-23', '09:45:00', 'https://youtube.com/watch?v=example6');

-- =====================================================
-- 7. CREATE SAMPLE FAVORITES (for scout user)
-- =====================================================

-- Sample favorites for scout user (run after creating scout user in Auth)
-- INSERT INTO favorites (scout_id, player_id, tournament_id, is_favorite, is_exclusive, display_order) VALUES
-- ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000001000', '00000000-0000-0000-0000-000000000010', true, true, 0),
-- ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000010', true, false, 1),
-- ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000010', true, true, 2);

-- =====================================================
-- 8. CREATE SAMPLE PLAYER VIDEOS
-- =====================================================

-- Sample videos for JEK FC players
INSERT INTO player_videos (player_id, video_url, video_type, display_order) VALUES
('00000000-0000-0000-0000-000000001000', 'https://youtube.com/watch?v=goalkeeper1', 'youtube', 0),
('00000000-0000-0000-0000-000000001001', 'https://youtube.com/watch?v=defender1', 'youtube', 0),
('00000000-0000-0000-0000-000000001002', 'https://youtube.com/watch?v=defender2', 'youtube', 0),
('00000000-0000-0000-0000-000000001003', 'https://youtube.com/watch?v=defender3', 'youtube', 0),
('00000000-0000-0000-0000-000000001004', 'https://youtube.com/watch?v=midfielder1', 'youtube', 0);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Initial data seeded successfully!';
  RAISE NOTICE '⚠️  IMPORTANT: Create users manually in Supabase Auth Dashboard first!';
  RAISE NOTICE '👥 Users to create:';
  RAISE NOTICE '   - Admin: williamsblanco216@gmail.com (ID: 00000000-0000-0000-0000-000000000001)';
  RAISE NOTICE '   - Scout: williams.blanco@prointernacional.com (ID: 00000000-0000-0000-0000-000000000002)';
  RAISE NOTICE '🏆 Tournament created: AS1 Futures Tournament 2025 (Active)';
  RAISE NOTICE '📊 Groups created: Group A, Group B';
  RAISE NOTICE '⚽ Teams created: 5 teams in Group A (with logos), 5 teams in Group B';
  RAISE NOTICE '👤 Players created: 10 JEK FC players with real data and photos';
  RAISE NOTICE '🏟️ Matches created: 6 Group A matches with video links';
  RAISE NOTICE '🎥 Videos created: Sample player videos';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '   1. Create users in Supabase Auth Dashboard';
  RAISE NOTICE '   2. Uncomment and run the scout profile inserts';
  RAISE NOTICE '   3. Uncomment and run the favorites inserts';
  RAISE NOTICE '🎉 Database setup complete! Ready for application use.';
END $$;
