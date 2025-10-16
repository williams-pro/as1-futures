# AS1 Futures - Migration Guide

## 📋 Overview

This guide provides step-by-step instructions for migrating from mock data to production database with Supabase Storage integration.

## 🎯 Goals

- [x] Create tournament structure with groups
- [x] Migrate teams with logo support
- [x] Migrate players with photo support
- [x] Migrate matches with video support
- [x] Setup Supabase Storage for images
- [x] Remove dependency on mock data

## 🗂️ Database Structure

### Tournament Hierarchy
```
Tournament (AS1 Futures Tournament 2025)
├── Group A
│   ├── Great Farcos FC (AS1 Team)
│   ├── Attram De Visser
│   ├── Dwise XI
│   ├── JEK FC
│   └── Soar Academy
└── Group B
    ├── AS1 Academy Elite (AS1 Team)
    ├── Barcelona Youth
    ├── Real Madrid CF
    ├── Atletico Madrid
    └── Valencia CF
```

### Storage Structure
```
Supabase Storage
├── team-logos/
│   ├── teams/{team_id}/GREAT_FARCOS_FC_A.png
│   ├── teams/{team_id}/ATTRAM_DE_VISSER_A.png
│   └── ...
├── player-photos/
│   ├── players/{player_id}/JEK_FC_1.jpg
│   ├── players/{player_id}/JEK_FC_2.jpg
│   └── ...
└── player-photos-thumbs/
    ├── players/{player_id}/JEK_FC_1_thumb.jpg
    ├── players/{player_id}/JEK_FC_2_thumb.jpg
    └── ...
```

## 🚀 Migration Steps

### 1. Prerequisites

```bash
# Set environment variables
export SUPABASE_URL="your-project-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Or create .env file
echo "SUPABASE_URL=your-project-url" >> .env
echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key" >> .env
```

### 2. Execute Migration Script

```bash
# Make script executable
chmod +x database/scripts/migrate-to-production.sh

# Run migration
./database/scripts/migrate-to-production.sh
```

### 3. Manual Steps

#### 3.1 Upload Team Logos
1. Go to Supabase Dashboard → Storage
2. Create bucket: `team-logos`
3. Upload images:
   - `GREAT_FARCOS_FC_A.png`
   - `ATTRAM_DE_VISSER_A.png`
   - `DWISE_XI_A.png`
   - `JEK_FC_A.png`
   - `SOAR_ACADEMY_A.png`

#### 3.2 Upload Player Photos
1. Create bucket: `player-photos`
2. Upload images:
   - `JEK_FC_1.jpg` to `JEK_FC_10.jpg`

#### 3.3 Upload Thumbnails
1. Create bucket: `player-photos-thumbs`
2. Upload thumbnails:
   - `JEK_FC_1_thumb.jpg` to `JEK_FC_10_thumb.jpg`

### 4. Update Frontend Code

#### 4.1 Remove Mock Data Imports
```typescript
// Remove these imports
import { MOCK_TEAMS, MOCK_PLAYERS, MOCK_MATCHES } from "@/lib/mock-data"

// Replace with Supabase queries
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
```

#### 4.2 Update Data Fetching
```typescript
// Before (mock data)
const teams = MOCK_TEAMS

// After (real data)
const supabase = getSupabaseBrowserClient()
const { data: teams } = await supabase
  .from('teams')
  .select(`
    *,
    tournament_groups!inner(code, name)
  `)
  .eq('tournament_id', '550e8400-e29b-41d4-a716-446655440000')
```

#### 4.3 Update Image Handling
```typescript
// Before (local images)
<img src="/teams/team-logo.png" alt="Team Logo" />

// After (Supabase Storage)
<img 
  src={team.logo_url || "/placeholder-team.png"} 
  alt="Team Logo"
  onError={(e) => {
    e.currentTarget.src = "/placeholder-team.png"
  }}
/>
```

## 🔧 Scripts Reference

| Script | Purpose | Order |
|--------|---------|-------|
| `01-create-tables.sql` | Create database tables | 1 |
| `02-create-functions.sql` | Create helper functions | 2 |
| `03-create-triggers.sql` | Create database triggers | 3 |
| `04-create-indexes.sql` | Create performance indexes | 4 |
| `05-enable-rls.sql` | Enable Row Level Security | 5 |
| `06-create-policies.sql` | Create RLS policies | 6 |
| `13-insert-scout-simple.sql` | Create scout user | 7 |
| `15-migrate-mock-data.sql` | Migrate mock data | 8 |
| `16-setup-storage-buckets.sql` | Setup Storage buckets | 9 |
| `17-upload-sample-images.sql` | Image upload instructions | 10 |
| `18-remove-mock-data.sql` | Prepare mock data removal | 11 |

## 🧪 Testing

### 1. Verify Data Migration
```sql
-- Check tournament
SELECT * FROM tournaments WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Check teams
SELECT t.*, tg.code as group_code 
FROM teams t 
JOIN tournament_groups tg ON t.group_id = tg.id 
WHERE t.tournament_id = '550e8400-e29b-41d4-a716-446655440000';

-- Check players
SELECT p.*, t.name as team_name 
FROM players p 
JOIN teams t ON p.team_id = t.id 
WHERE p.tournament_id = '550e8400-e29b-41d4-a716-446655440000';

-- Check matches
SELECT m.*, ht.name as home_team, at.name as away_team 
FROM matches m 
JOIN teams ht ON m.home_team_id = ht.id 
JOIN teams at ON m.away_team_id = at.id 
WHERE m.tournament_id = '550e8400-e29b-41d4-a716-446655440000';
```

### 2. Verify Storage
```sql
-- Check storage buckets
SELECT * FROM storage.buckets WHERE id IN ('team-logos', 'player-photos', 'player-photos-thumbs');

-- Check team logos
SELECT team_code, name, logo_url FROM teams WHERE logo_url IS NOT NULL;

-- Check player photos
SELECT first_name, last_name, jersey_number, photo_url FROM players WHERE photo_url IS NOT NULL;
```

## 🚨 Troubleshooting

### Common Issues

1. **Storage buckets not created**
   - Run `16-setup-storage-buckets.sql` manually
   - Check Supabase Dashboard → Storage

2. **Images not loading**
   - Verify bucket policies allow public read access
   - Check image URLs are correct
   - Verify images are uploaded to correct paths

3. **RLS policies blocking access**
   - Check user has correct role in `scouts` table
   - Verify policies are created correctly
   - Test with service role key

4. **Foreign key constraints**
   - Ensure tournament is created first
   - Check group_id references exist
   - Verify team_id references exist

### Debug Queries

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'teams';

-- Check user permissions
SELECT * FROM scouts WHERE id = auth.uid();

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

## 📊 Performance Considerations

1. **Image Optimization**
   - Use WebP format when possible
   - Implement lazy loading
   - Create multiple sizes (thumbnail, medium, large)

2. **Database Indexes**
   - Tournament ID indexes
   - Team code indexes
   - Player jersey number indexes

3. **Caching**
   - Cache team and player data
   - Use Supabase real-time for live updates
   - Implement proper loading states

## 🔄 Rollback Plan

If migration fails:

1. **Database Rollback**
   ```sql
   -- Drop tournament and all related data
   DELETE FROM tournaments WHERE id = '550e8400-e29b-41d4-a716-446655440000';
   ```

2. **Storage Rollback**
   - Delete buckets from Supabase Dashboard
   - Or empty buckets to remove uploaded files

3. **Frontend Rollback**
   - Revert to mock data imports
   - Restore original image paths

## ✅ Success Criteria

- [ ] Tournament created with 2 groups
- [ ] 10 teams migrated (5 per group)
- [ ] 10+ players migrated with photos
- [ ] 6+ matches created
- [ ] Storage buckets configured
- [ ] Images uploaded and accessible
- [ ] Frontend updated to use real data
- [ ] All functionality tested
- [ ] Mock data removed

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review SQL script comments
3. Check Supabase documentation
4. Contact development team

---

**Last Updated:** January 2025  
**Version:** 3.0  
**Status:** Ready for Production



