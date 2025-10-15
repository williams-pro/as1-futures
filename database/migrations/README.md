# Database Migrations

This directory contains database migration scripts for version upgrades.

## Available Migrations

### v2.0 to v3.0 Migration
- **File**: `v2.0-to-v3.0.sql`
- **Description**: Migrates from single-tournament to multi-tournament architecture
- **Breaking Changes**: All data now scoped to specific tournaments
- **Estimated Time**: 5-10 minutes depending on data size

## Migration Process

### Before Running Migrations

1. **Backup your database** - This is critical!
2. **Test in staging environment** first
3. **Verify all data** is accessible before migration
4. **Plan for downtime** during migration

### Running Migrations

```bash
# 1. Backup database
pg_dump $DATABASE_URL > backup_before_v3.0.sql

# 2. Run migration
psql $DATABASE_URL -f database/migrations/v2.0-to-v3.0.sql

# 3. Verify migration success
psql $DATABASE_URL -c "SELECT COUNT(*) FROM tournaments;"
```

### After Migration

1. **Verify data integrity**
2. **Test application functionality**
3. **Update application code** to use tournament-scoped queries
4. **Monitor performance** for any issues

## Rollback Procedures

If migration fails or issues are discovered:

```bash
# Restore from backup
psql $DATABASE_URL < backup_before_v3.0.sql
```

## Migration Checklist

- [ ] Database backed up
- [ ] Migration script reviewed
- [ ] Staging environment tested
- [ ] Application code updated
- [ ] Data integrity verified
- [ ] Performance tested
- [ ] Documentation updated

