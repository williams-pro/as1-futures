-- =====================================================
-- AS1 Futures Database v3.0 - Create Users
-- =====================================================
-- Description: Creates admin and scout users
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. CREATE ADMIN USER
-- =====================================================
-- First create this user in Supabase Auth Dashboard:
-- - Go to Authentication > Users > Add user
-- - Email: williamsblanco216@gmail.com
-- - Password: admin123
-- - User ID will be auto-generated

-- Then run this to create admin profile:
INSERT INTO admins (id, email, first_name, last_name, is_active, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'williamsblanco216@gmail.com',
  'Williams',
  'Blanco',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- =====================================================
-- 2. CREATE SCOUT USER
-- =====================================================
-- First create this user in Supabase Auth Dashboard:
-- - Go to Authentication > Users > Add user
-- - Email: williams.blanco@prointernacional.com
-- - Password: scout123
-- - User ID will be auto-generated

-- Then run this to create scout profile:
INSERT INTO scouts (id, email, first_name, last_name, is_active, created_at, updated_at)
VALUES (
  'a80d087e-7188-4334-99c0-8a3bb7a36f76',
  'williams.blanco@prointernacional.com',
  'Williams',
  'Blanco',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- =====================================================
-- 3. VERIFY USERS CREATED
-- =====================================================
SELECT 'Admin users:' as info;
SELECT id, email, first_name, last_name, is_active FROM admins;

SELECT 'Scout users:' as info;
SELECT id, email, first_name, last_name, is_active FROM scouts;
