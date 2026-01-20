-- ============================================
-- PERFORMANCE INDEXES
-- Description: Additional indexes for optimizing common query patterns
-- ============================================

-- Index: idx_transactions_athlete_type_date
-- Description: Composite index for filtering transactions by athlete, type, and date
-- Used by: Dashboard KPI queries, filtered transaction queries
CREATE INDEX IF NOT EXISTS idx_transactions_athlete_type_date
ON transactions(athlete_id, type, transaction_date DESC);

-- Index: idx_transactions_year
-- Description: Index for filtering transactions by year
-- Used by: Year-to-date calculations, annual projections
CREATE INDEX IF NOT EXISTS idx_transactions_year
ON transactions(EXTRACT(YEAR FROM transaction_date));

-- Index: idx_transactions_month
-- Description: Index for grouping transactions by month
-- Used by: Monthly trend calculations, month-over-month comparisons
CREATE INDEX IF NOT EXISTS idx_transactions_month
ON transactions(DATE_TRUNC('month', transaction_date));

-- Index: idx_transactions_category
-- Description: Index for filtering by category
-- Used by: Income by source, expenses by category aggregations
CREATE INDEX IF NOT EXISTS idx_transactions_category
ON transactions(athlete_id, category, type);

-- Index: idx_deals_athlete_status
-- Description: Composite index for filtering deals by athlete and status
-- Used by: Deal summary calculations, active deals queries
CREATE INDEX IF NOT EXISTS idx_deals_athlete_status
ON deals(athlete_id, status);

-- Index: idx_people_athlete_access
-- Description: Index for filtering people by athlete and access level
-- Used by: Team member queries, access control
CREATE INDEX IF NOT EXISTS idx_people_athlete_access
ON people(athlete_id, access_level);

-- Index: idx_upcoming_tasks_athlete_due
-- Description: Index for filtering upcoming tasks by athlete and due date
-- Used by: Upcoming tasks view, deadline alerts
CREATE INDEX IF NOT EXISTS idx_upcoming_tasks_athlete_due
ON upcoming_tasks(athlete_id, due_date)
WHERE is_completed = FALSE;

-- Index: idx_quarterly_payments_athlete_status
-- Description: Index for filtering quarterly payments by athlete and status
-- Used by: Tax payment tracking, payment status queries
CREATE INDEX IF NOT EXISTS idx_quarterly_payments_athlete_status
ON quarterly_tax_payments(athlete_id, status, due_date);

-- Index: idx_compliance_athlete_status
-- Description: Index for compliance queries
-- Used by: Compliance status checks, reporting
CREATE INDEX IF NOT EXISTS idx_compliance_athlete_status
ON compliance(athlete_id, status);

-- Index: idx_person_roles_person
-- Description: Index for looking up roles by person
-- Used by: Team member role queries, permission checks
CREATE INDEX IF NOT EXISTS idx_person_roles_person
ON person_roles(person_id, role);

-- Index: idx_transactions_deal
-- Description: Index for finding transactions associated with a deal
-- Used by: Deal tracking, deal income calculations
CREATE INDEX IF NOT EXISTS idx_transactions_deal
ON transactions(deal_id)
WHERE deal_id IS NOT NULL;

-- Index: idx_athletes_email
-- Description: Index for athlete lookup by email
-- Used by: Authentication, user lookup
CREATE INDEX IF NOT EXISTS idx_athletes_email
ON athletes(email)
WHERE is_active = TRUE;

-- Index: idx_transactions_created_at
-- Description: Index for ordering by creation time
-- Used by: Recent activity queries, audit trails
CREATE INDEX IF NOT EXISTS idx_transactions_created_at
ON transactions(athlete_id, created_at DESC);

-- ============================================
-- INDEX USAGE NOTES:
-- ============================================

-- The indexes created here are designed to optimize the most common query patterns:
--
-- 1. Dashboard KPI Queries:
--    - idx_transactions_athlete_type_date: Fast filtering by athlete + type + date
--    - idx_deals_athlete_status: Quick deal counts by status
--
-- 2. Monthly Trend Calculations:
--    - idx_transactions_month: Fast grouping by month
--    - idx_transactions_year: Year-based filtering
--
-- 3. Category Aggregations:
--    - idx_transactions_category: Income/expense by category charts
--
-- 4. Filtered Queries:
--    - idx_transactions_athlete_type_date: Supports date range filters
--    - idx_deals_athlete_status: Supports deal filtering
--
-- 5. Team Queries:
--    - idx_people_athlete_access: Team member lookups
--    - idx_person_roles_person: Role-based queries
--
-- 6. Task Management:
--    - idx_upcoming_tasks_athlete_due: Upcoming deadlines
--    - idx_quarterly_payments_athlete_status: Tax payment tracking
--
-- Performance Impact:
-- - These indexes will improve read performance at the cost of slightly slower writes
-- - For this application (more reads than writes), this is an acceptable trade-off
-- - Index size is minimal given the expected data volume (thousands of transactions per athlete)
--
-- Monitoring:
-- - Use EXPLAIN ANALYZE to verify index usage:
--   EXPLAIN ANALYZE SELECT * FROM transactions WHERE athlete_id = '...' AND type = 'income';
--
-- - Check index usage stats:
--   SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';
--
-- - Identify unused indexes:
--   SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0 AND indexrelname NOT LIKE 'pg_%';

-- ============================================
-- VERIFICATION QUERY:
-- ============================================

-- List all indexes on key tables:
-- SELECT
--     tablename,
--     indexname,
--     indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
--   AND tablename IN ('athletes', 'deals', 'transactions', 'people', 'person_roles',
--                     'upcoming_tasks', 'quarterly_tax_payments', 'compliance')
-- ORDER BY tablename, indexname;
