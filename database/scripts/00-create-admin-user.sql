-- =====================================================
-- AS1 Futures Database v3.0 - Create Admin User
-- =====================================================
-- Description: Creates admin user for tournament management
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. CREATE ADMIN USER IN AUTH
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
  crypt('1234AS', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. CREATE ADMIN PROFILE IN SCOUTS TABLE
-- =====================================================
-- Insert admin profile in scouts table (following existing structure)
INSERT INTO scouts (id, email, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'williamsblanco216@gmail.com',
  'Williams',
  'Blanco',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- =====================================================
-- 3. VERIFY ADMIN USER CREATED
-- =====================================================
SELECT 'Admin user created successfully:' as info;
SELECT id, email, first_name, last_name, role, is_active 
FROM scouts 
WHERE role = 'admin';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Admin user created successfully!';
  RAISE NOTICE '👤 Admin: williamsblanco216@gmail.com (ID: 00000000-0000-0000-0000-000000000001)';
  RAISE NOTICE '🔑 Password: admin123';
  RAISE NOTICE '🔄 Next step: Run 01-create-tables.sql to create database structure';
END $$;



