-- =====================================================
-- AS1 Futures Database v3.0 - Setup Storage Buckets
-- =====================================================
-- Description: Creates and configures Supabase Storage buckets
-- Version: 3.0
-- Last Updated: January 2025
-- =====================================================

-- =====================================================
-- 1. CREATE STORAGE BUCKETS
-- =====================================================

-- Create team-logos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-logos',
  'team-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Create player-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'player-photos',
  'player-photos',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. CREATE RLS POLICIES FOR STORAGE
-- =====================================================

-- Team logos policies
CREATE POLICY "Team logos are publicly readable" ON storage.objects
FOR SELECT USING (bucket_id = 'team-logos');

CREATE POLICY "Admins can upload team logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'team-logos' AND
  EXISTS (
    SELECT 1 FROM scouts
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update team logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'team-logos' AND
  EXISTS (
    SELECT 1 FROM scouts
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete team logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'team-logos' AND
  EXISTS (
    SELECT 1 FROM scouts
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Player photos policies
CREATE POLICY "Player photos are publicly readable" ON storage.objects
FOR SELECT USING (bucket_id = 'player-photos');

CREATE POLICY "Admins can upload player photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'player-photos' AND
  EXISTS (
    SELECT 1 FROM scouts
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update player photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'player-photos' AND
  EXISTS (
    SELECT 1 FROM scouts
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete player photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'player-photos' AND
  EXISTS (
    SELECT 1 FROM scouts
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Storage buckets created successfully!';
  RAISE NOTICE '📁 Buckets created: team-logos, player-photos';
  RAISE NOTICE '🔒 RLS policies: Public read, Admin write/update/delete';
  RAISE NOTICE '📏 File limits: Team logos (5MB), Player photos (10MB)';
  RAISE NOTICE '🎯 Next step: Upload images and update database URLs';
END $$;