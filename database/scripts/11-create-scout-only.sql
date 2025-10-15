-- =====================================================
-- AS1 Futures Database v3.0 - Create Scout User Only
-- =====================================================
-- Description: Creates scout user profile
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- Create scout profile with real User ID
INSERT INTO scouts (id, email, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
  'a80d087e-7188-4334-99c0-8a3bb7a36f76',
  'williams.blanco@prointernacional.com',
  'Williams',
  'Blanco',
  'scout',
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

-- Verify scout was created
SELECT 'Scout profile created:' as info;
SELECT id, email, first_name, last_name, is_active, created_at 
FROM scouts 
WHERE email = 'williams.blanco@prointernacional.com';
