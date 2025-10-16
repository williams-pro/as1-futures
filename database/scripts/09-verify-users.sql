-- =====================================================
-- AS1 Futures Database v3.0 - Verify Users
-- =====================================================
-- Description: Verify users exist in auth.users table
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- Check if users exist in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email IN (
  'williamsblanco216@gmail.com',
  'williams.blanco@prointernacional.com'
)
ORDER BY email;

-- Check if profiles exist in our tables
SELECT 'Admin profiles:' as info;
SELECT id, email, first_name, last_name, is_active FROM admins;

SELECT 'Scout profiles:' as info;
SELECT id, email, first_name, last_name, is_active FROM scouts;



