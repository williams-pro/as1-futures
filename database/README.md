# AS1 Futures - Database Setup & Management

**Version:** 3.0  
**Database:** PostgreSQL 15+ (Supabase)  
**Last Updated:** January 2025

## 📋 Overview

This directory contains all database-related files for the AS1 Futures application, including SQL scripts, migrations, seeds, and documentation.

## 🗂️ Directory Structure

```
database/
├── README.md                 # This file
├── env.example              # Environment variables template
├── scripts/                 # SQL scripts for database operations
│   ├── 01-create-tables.sql
│   ├── 02-create-functions.sql
│   ├── 03-create-triggers.sql
│   ├── 04-create-indexes.sql
│   ├── 05-enable-rls.sql
│   ├── 06-create-policies.sql
│   └── 07-seed-data.sql
├── migrations/              # Database migrations
│   ├── v2.0-to-v3.0.sql
│   └── README.md
├── seeds/                   # Initial data seeds
│   ├── tournaments.sql
│   ├── groups.sql
│   ├── teams.sql
│   ├── players.sql
│   └── matches.sql
└── docs/                    # Additional documentation
    ├── database-schema.md
    ├── rls-policies.md
    └── performance-optimization.md
```

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment variables template:
```bash
cp database/env.example .env.local
```

Update the `DATABASE_URL` with your actual Supabase password.

### 2. Database Setup (New Installation)

Execute scripts in order:

```bash
# 1. Create all tables
psql $DATABASE_URL -f database/scripts/01-create-tables.sql

# 2. Create functions
psql $DATABASE_URL -f database/scripts/02-create-functions.sql

# 3. Create triggers
psql $DATABASE_URL -f database/scripts/03-create-triggers.sql

# 4. Create indexes
psql $DATABASE_URL -f database/scripts/04-create-indexes.sql

# 5. Enable RLS
psql $DATABASE_URL -f database/scripts/05-enable-rls.sql

# 6. Create RLS policies
psql $DATABASE_URL -f database/scripts/06-create-policies.sql

# 7. Seed initial data
psql $DATABASE_URL -f database/scripts/07-seed-data.sql
```

### 3. Migration from v2.0 to v3.0

If migrating from an existing v2.0 database:

```bash
# Run migration script
psql $DATABASE_URL -f database/migrations/v2.0-to-v3.0.sql
```

## 📊 Database Schema

### Core Tables

- **`tournaments`** - Multi-tournament support
- **`tournament_groups`** - Dynamic groups (A, B, C, etc.)
- **`scouts`** - User profiles (scouts and admins)
- **`teams`** - Tournament teams
- **`players`** - Player information
- **`matches`** - Tournament matches
- **`favorites`** - Scout's favorite/exclusive players

### Analytics Tables

- **`player_views`** - Player view tracking (partitioned)
- **`player_view_stats`** - Pre-calculated analytics
- **`player_interactions`** - Specific scout actions
- **`activity_log`** - Admin audit trail

## 🔐 Security

All tables use Row Level Security (RLS) with policies:
- **Scouts**: Can only access their own data
- **Admins**: Can access all data
- **Public**: No direct database access

## 📈 Performance

- **Time-based partitioning** for `player_views` table
- **Strategic indexes** on all foreign keys and query columns
- **Pre-calculated stats** for fast analytics
- **Data retention policies** (12 months active, archive older)

## 🛠️ Maintenance

### Monthly Tasks (Automated)
- Create next month's partition
- Archive old player views
- Update statistics

### Quarterly Tasks (Manual)
- Review partition sizes
- Optimize indexes
- Analyze query performance

## 📝 Script Execution Order

**CRITICAL:** Scripts must be executed in the exact order listed below:

1. **`01-create-tables.sql`** - Creates all table structures
2. **`02-create-functions.sql`** - Creates database functions
3. **`03-create-triggers.sql`** - Creates triggers (depends on functions)
4. **`04-create-indexes.sql`** - Creates performance indexes
5. **`05-enable-rls.sql`** - Enables Row Level Security
6. **`06-create-policies.sql`** - Creates RLS policies (depends on RLS)
7. **`07-seed-data.sql`** - Seeds initial data

## 🚨 Important Notes

- **Backup before migration**: Always backup your database before running migration scripts
- **Environment variables**: Ensure all Supabase credentials are correctly set
- **User creation**: Admin and scout users are created in the seed data script
- **Tournament scope**: All data is now scoped to specific tournaments (v3.0)

## 📞 Support

For database issues or questions:
- Check the logs in Supabase dashboard
- Review RLS policies if access is denied
- Verify environment variables are correct
- Check script execution order

## 🔄 Version History

- **v3.0** (January 2025) - Multi-tournament support, historical data preservation
- **v2.0** (January 2025) - Dynamic groups, analytics optimization
- **v1.0** (December 2024) - Initial release

---

**Maintained by:** AS1 Futures Development Team  
**Last Updated:** January 2025

