# Database Design Thoughts & Decisions

## Overall Architecture

I've designed a **normalized, relational PostgreSQL schema** that balances:
- **Data integrity** through foreign keys and constraints
- **Query performance** via strategic indexing
- **Maintainability** with clear relationships and documentation
- **Scalability** using UUIDs and proper indexing

## Key Design Decisions

### 1. UUIDs vs Auto-Incrementing IDs
**Decision**: Use UUIDs for all primary keys
**Rationale**:
- Better for distributed systems (if you scale horizontally)
- Prevents ID enumeration attacks
- Easier to merge databases if needed
- Trade-off: Slightly larger storage, but negligible for this use case

### 2. ENUMs vs Check Constraints
**Decision**: Use PostgreSQL ENUMs for status fields
**Rationale**:
- Type safety at database level
- Better performance than VARCHAR with check constraints
- Clearer documentation of allowed values
- Easy to query and filter

### 3. Separate `person_roles` Junction Table
**Decision**: Many-to-many relationship for person roles
**Rationale**:
- A person can have multiple roles (e.g., "Family" + "Accountant")
- Normalized design prevents data duplication
- Easy to query "all agents" or "all people with role X"

### 4. Auto-Generated Fields
**Decision**: Use generated columns and triggers
**Rationale**:
- `full_name`: Always consistent, no sync issues
- `initials`: Auto-generated if not provided (better UX)
- `updated_at`: Automatic via triggers (no manual updates needed)

### 5. Tax Vault Auto-Update Trigger
**Decision**: Automatically update tax vault on income transactions
**Rationale**:
- Ensures tax vault is always accurate
- Reduces application-level complexity
- Prevents bugs from forgetting to update vault
- Can be disabled if needed for manual overrides

### 6. Transaction Linking
**Decision**: Optional `deal_id` on transactions
**Rationale**:
- Not all transactions come from deals (e.g., expenses)
- Allows tracking "which deal generated this income"
- Useful for reporting and analytics
- NULL is acceptable (not all transactions are deal-related)

### 7. Settings as Separate Table
**Decision**: `user_settings` table instead of JSONB column
**Rationale**:
- Better query performance (can index individual settings)
- Type safety with proper columns
- Easier to add new settings without migrations
- Can query "all users with email notifications enabled"

### 8. Views for Common Queries
**Decision**: Pre-built views for aggregations
**Rationale**:
- Reusable across application
- Consistent calculations
- Can be materialized if performance becomes an issue
- Easier to maintain than duplicating SQL

## What I Would Add Next

### 1. Audit Logging
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY,
    athlete_id UUID,
    table_name VARCHAR(100),
    record_id UUID,
    action VARCHAR(20), -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID,
    created_at TIMESTAMP
);
```

### 2. Soft Deletes
Add `deleted_at TIMESTAMP` to critical tables:
- Allows data recovery
- Maintains referential integrity
- Can archive old data

### 3. File Storage
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY,
    athlete_id UUID,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size BIGINT,
    storage_url TEXT,
    related_table VARCHAR(50), -- 'deals', 'transactions', etc.
    related_id UUID,
    created_at TIMESTAMP
);
```

### 4. Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    athlete_id UUID,
    type VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN,
    action_url TEXT,
    created_at TIMESTAMP
);
```

### 5. Compliance History
```sql
CREATE TABLE compliance_history (
    id UUID PRIMARY KEY,
    athlete_id UUID,
    event_type VARCHAR(50),
    description TEXT,
    status_before compliance_status,
    status_after compliance_status,
    created_at TIMESTAMP
);
```

## Performance Considerations

### Indexing Strategy
- **Foreign keys**: Always indexed (PostgreSQL does this automatically)
- **Status fields**: Indexed for filtering (e.g., `WHERE status = 'active'`)
- **Date fields**: Indexed for sorting and range queries
- **Composite indexes**: For common query patterns (e.g., `(athlete_id, status)`)

### Query Optimization Tips
1. Use `EXPLAIN ANALYZE` to identify slow queries
2. Consider partial indexes for filtered queries:
   ```sql
   CREATE INDEX idx_active_deals ON deals(athlete_id) 
   WHERE status = 'active';
   ```
3. For large transaction tables, consider partitioning by date
4. Use materialized views for expensive aggregations

### Connection Pooling
- Use **pgBouncer** or **PgBouncer** for connection pooling
- Prevents connection exhaustion
- Improves performance under load

## Security Considerations

### 1. Password Storage
- Never store plain text passwords
- Use **bcrypt** or **argon2** for hashing
- Store in `password_hash` column

### 2. Sensitive Data Encryption
- Encrypt `bank_accounts.access_token` at application level
- Encrypt `connected_accounts` tokens
- Consider PostgreSQL's `pgcrypto` extension for database-level encryption

### 3. Row-Level Security (RLS)
For multi-tenant scenarios, consider:
```sql
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY deals_athlete_isolation ON deals
    FOR ALL
    USING (athlete_id = current_setting('app.current_athlete_id')::UUID);
```

### 4. SQL Injection Prevention
- Always use parameterized queries
- Never concatenate user input into SQL
- Use an ORM (Prisma, TypeORM, etc.) for type safety

## Migration Strategy

### Initial Setup
1. Create database: `CREATE DATABASE athlete_dashboard;`
2. Run `schema.sql` to create all tables
3. Set up connection pooling
4. Configure backups

### Ongoing Migrations
1. Use migration tools (Flyway, Liquibase, or custom)
2. Always test migrations on staging first
3. Have rollback scripts ready
4. Document breaking changes

## Testing Recommendations

### 1. Unit Tests
- Test triggers (tax vault updates)
- Test constraints (positive amounts, valid enums)
- Test computed columns

### 2. Integration Tests
- Test foreign key relationships
- Test cascade deletes
- Test transaction isolation

### 3. Performance Tests
- Load test with realistic data volumes
- Test query performance with indexes
- Test concurrent writes

## Monitoring

### Key Metrics to Track
1. **Query Performance**: Slow query log
2. **Connection Pool**: Active connections
3. **Table Sizes**: Growth over time
4. **Index Usage**: Are indexes being used?
5. **Lock Contention**: Deadlocks, long-running queries

### Tools
- **pg_stat_statements**: Track slow queries
- **pgAdmin**: Visual monitoring
- **Datadog/New Relic**: APM for database
- **PostgreSQL logs**: Error tracking

## Conclusion

This schema provides a solid foundation that:
- ✅ Handles all current application features
- ✅ Scales to thousands of athletes
- ✅ Maintains data integrity
- ✅ Supports future enhancements
- ✅ Follows PostgreSQL best practices

The design is **pragmatic** - not over-engineered, but not under-engineered either. It balances normalization with practical query patterns.
