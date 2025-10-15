-- =====================================================
-- AS1 Futures Database v3.0 - Create Users Direct
-- =====================================================
-- Description: Creates users directly using Supabase functions
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. CREATE ADMIN USER
-- =====================================================
-- Create user in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'williamsblanco216@gmail.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create admin profile
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
-- Create user in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'williams.blanco@prointernacional.com',
  crypt('scout123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create scout profile
INSERT INTO scouts (id, email, first_name, last_name, is_active, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
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
SELECT 'Auth users:' as info;
SELECT id, email, email_confirmed_at FROM auth.users 
WHERE email IN (
  'williamsblanco216@gmail.com',
  'williams.blanco@prointernacional.com'
);

SELECT 'Admin profiles:' as info;
SELECT id, email, first_name, last_name, is_active FROM admins;

SELECT 'Scout profiles:' as info;
SELECT id, email, first_name, last_name, is_active FROM scouts;

