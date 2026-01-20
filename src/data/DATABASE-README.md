# Database Schema Documentation

## Overview

This PostgreSQL schema is designed for an athlete dashboard application that manages NIL (Name, Image, Likeness) deals, financial transactions, tax planning, and team collaboration.

## Design Principles

1. **Normalization**: Properly normalized to reduce data redundancy
2. **Referential Integrity**: Foreign keys ensure data consistency
3. **Performance**: Strategic indexes on frequently queried columns
4. **Type Safety**: ENUMs for status fields to prevent invalid data
5. **Audit Trail**: `created_at` and `updated_at` timestamps on all tables
6. **Scalability**: UUID primary keys for distributed systems

## Core Tables

### `athletes`
The main user table storing athlete information.
- **Key Fields**: email, first_name, last_name, sport, year
- **Security**: password_hash, email_verified, two_factor fields
- **Auto-generated**: `full_name` (computed), `initials` (via trigger)

### `deals`
NIL deals and partnerships.
- **Status**: active, pending, completed, cancelled
- **Amount Types**: one-time, monthly, quarterly, yearly, per-instance
- **Relationships**: Links to transactions when payments are received

### `people`
Team members, family, agents, coaches, etc.
- **Access Levels**: admin, read-only, none
- **Many-to-Many**: Uses `person_roles` junction table for multiple roles

### `transactions`
All financial movements (income, expenses, tax transfers).
- **Types**: income, expense, tax_transfer
- **Auto-tracking**: Tax vault automatically updates on income transactions
- **Linkage**: Can link to deals via `deal_id`

### `tax_vault`
Tracks tax savings per athlete.
- **Auto-updated**: Trigger updates vault when income transactions occur
- **Goal Tracking**: Stores goal amount vs current amount

### `quarterly_tax_payments`
Estimated tax payment schedule.
- **Status**: paid, due, estimated, overdue
- **Unique Constraint**: One payment per quarter per athlete

## Key Features

### Automatic Tax Vault Updates
When an income transaction is created, a trigger automatically:
1. Retrieves the athlete's tax rate from settings
2. Calculates the tax amount (income × rate)
3. Updates the tax vault balance

### Computed Fields
- `athletes.full_name`: Automatically generated from first_name + last_name
- `athletes.initials`: Auto-generated via trigger if not provided

### Indexes
Strategic indexes on:
- Foreign keys (athlete_id, deal_id, etc.)
- Status fields (for filtering)
- Date fields (for sorting/querying)
- Composite indexes for common query patterns

### Views
Pre-built views for common aggregations:
- `deal_summary`: Deal counts by status
- `transaction_summary`: Monthly income/expense summaries
- `income_by_source`: Income grouped by category
- `expenses_by_category`: Expenses grouped by category

## Relationships

```
athletes (1) ──< (many) deals
athletes (1) ──< (many) transactions
athletes (1) ──< (many) people
athletes (1) ──< (1) tax_vault
athletes (1) ──< (1) user_settings
athletes (1) ──< (many) quarterly_tax_payments
deals (1) ──< (many) transactions
people (1) ──< (many) person_roles
```

## Security Considerations

1. **Password Storage**: Use bcrypt or similar for `password_hash`
2. **Sensitive Data**: 
   - `bank_accounts.access_token` should be encrypted
   - `connected_accounts` tokens should be encrypted
3. **Access Control**: `access_level` enum controls permissions
4. **Email Verification**: `email_verified` flag for account security

## Migration Strategy

1. Run `schema.sql` to create all tables, enums, and functions
2. Create indexes after initial data load (if migrating existing data)
3. Set up triggers after schema creation
4. Populate initial data (athletes, settings defaults)

## Sample Queries

### Get athlete dashboard data
```sql
SELECT 
    a.*,
    ds.active_deals,
    ds.total_deals,
    tv.current_amount as tax_vault,
    tv.goal_amount
FROM athletes a
LEFT JOIN deal_summary ds ON ds.athlete_id = a.id
LEFT JOIN tax_vault tv ON tv.athlete_id = a.id
WHERE a.id = $1;
```

### Get recent transactions
```sql
SELECT * FROM transactions
WHERE athlete_id = $1
ORDER BY transaction_date DESC, created_at DESC
LIMIT 10;
```

### Get upcoming tasks
```sql
SELECT * FROM upcoming_tasks
WHERE athlete_id = $1
  AND is_completed = FALSE
  AND due_date >= CURRENT_DATE
ORDER BY due_date ASC;
```

## Future Enhancements

1. **Soft Deletes**: Add `deleted_at` timestamp for soft delete functionality
2. **Audit Log**: Separate table for tracking all changes
3. **File Storage**: Table for receipts, contracts, documents
4. **Notifications**: Table for in-app notifications
5. **Messages**: Table for athlete-CPA communication
6. **Compliance Log**: Detailed compliance tracking history

## Quick Start

### Initial Setup

1. **Install PostgreSQL** (14+):
   ```bash
   brew install postgresql  # macOS
   # or follow https://www.postgresql.org/download/
   ```

2. **Create Database**:
   ```bash
   createdb athlete_dashboard
   ```

3. **Install Dependencies**:
   ```bash
   npm install pg tsx --save-dev
   # or
   yarn add -D pg tsx
   ```

4. **Configure Environment** (create `.env` file):
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=athlete_dashboard
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

5. **Run Migrations**:
   ```bash
   npm run db:migrate
   ```

6. **Verify Installation**:
   ```bash
   psql athlete_dashboard -c "SELECT COUNT(*) FROM athletes;"
   # Should return: count: 1 (Marcus Thompson)
   ```

## KPI Calculation Functions

### `get_dashboard_kpis(athlete_id)`
Returns all dashboard KPIs including total earned, tax vault, available cash, and month-over-month growth.

**Parameters:**
- `athlete_id` (UUID) - The athlete's ID

**Returns:** TABLE with:
| Column | Type | Description |
|--------|------|-------------|
| total_earned | DECIMAL(12, 2) | Lifetime income from all income transactions |
| tax_vault | DECIMAL(12, 2) | Current tax savings balance |
| available | DECIMAL(12, 2) | Available cash (total_earned - tax_vault) |
| tax_rate | DECIMAL(5, 4) | Current tax rate (0-1, e.g., 0.28 = 28%) |
| earned_mom | DECIMAL(5, 4) | Month-over-month income growth rate |

**Usage:**
```sql
SELECT * FROM get_dashboard_kpis('00000000-0000-0000-0000-000000000001');

-- Example result:
-- total_earned | tax_vault | available | tax_rate | earned_mom
-- 47230.00     | 13224.00  | 33406.00  | 0.2800   | 0.2842
```

---

### `get_monthly_trend(athlete_id, months)`
Returns monthly aggregated income, expenses, and net for the last N months.

**Parameters:**
- `athlete_id` (UUID) - The athlete's ID
- `months` (INTEGER) - Number of months to return (default: 3)

**Returns:** TABLE with:
| Column | Type | Description |
|--------|------|-------------|
| month | TEXT | Month abbreviation (Jan, Feb, Mar) |
| month_date | DATE | First day of the month |
| income | DECIMAL(12, 2) | Total income for the month |
| expenses | DECIMAL(12, 2) | Total expenses for the month (positive number) |
| net | DECIMAL(12, 2) | Net cash flow (income - expenses) |

**Usage:**
```sql
-- Get last 3 months
SELECT * FROM get_monthly_trend('00000000-0000-0000-0000-000000000001', 3);

-- Get last 12 months
SELECT * FROM get_monthly_trend('00000000-0000-0000-0000-000000000001', 12);

-- Example result:
-- month | month_date | income    | expenses | net
-- Jan   | 2025-01-01 | 12500.00  | 850.00   | 11650.00
-- Feb   | 2025-02-01 | 15200.00  | 1240.00  | 13960.00
-- Mar   | 2025-03-01 | 19530.00  | 1750.00  | 17780.00
```

---

### `get_transaction_summary(athlete_id, start_date, end_date, type, categories)`
Returns filtered transaction summary with income, expenses, and net cash flow.

**Parameters:**
- `athlete_id` (UUID) - The athlete's ID
- `start_date` (DATE, optional) - Start date filter
- `end_date` (DATE, optional) - End date filter
- `transaction_type` (transaction_type, optional) - Filter by type (income/expense)
- `categories` (TEXT[], optional) - Array of categories to filter by

**Returns:** TABLE with:
| Column | Type | Description |
|--------|------|-------------|
| total_income | DECIMAL(12, 2) | Total income in period |
| total_expenses | DECIMAL(12, 2) | Total expenses in period (positive) |
| net_cash_flow | DECIMAL(12, 2) | Net (income - expenses) |
| transaction_count | INTEGER | Number of transactions |

**Usage:**
```sql
-- All time summary
SELECT * FROM get_transaction_summary('00000000-0000-0000-0000-000000000001');

-- January 2025 only
SELECT * FROM get_transaction_summary(
    '00000000-0000-0000-0000-000000000001',
    '2025-01-01',
    '2025-01-31',
    NULL,
    NULL
);

-- Income only, specific categories
SELECT * FROM get_transaction_summary(
    '00000000-0000-0000-0000-000000000001',
    NULL,
    NULL,
    'income',
    ARRAY['Brand Deal', 'Collective']
);
```

---

### `get_projected_annual_income(athlete_id)`
Projects annual income based on year-to-date earnings.

**Parameters:**
- `athlete_id` (UUID) - The athlete's ID

**Returns:** DECIMAL(12, 2) - Projected annual income

**Usage:**
```sql
SELECT get_projected_annual_income('00000000-0000-0000-0000-000000000001');
-- Example: 65000.00 (if currently in March with $16K earned YTD)
```

---

### `get_filtered_transactions(athlete_id, start_date, end_date, type, categories, limit)`
Returns transactions with optional filters applied.

**Parameters:**
- All parameters from `get_transaction_summary`
- `limit` (INTEGER, optional) - Maximum number of results

**Returns:** TABLE with full transaction details

**Usage:**
```sql
-- Get last 10 transactions
SELECT * FROM get_filtered_transactions(
    '00000000-0000-0000-0000-000000000001',
    NULL, NULL, NULL, NULL, 10
);

-- Get income transactions in Q1
SELECT * FROM get_filtered_transactions(
    '00000000-0000-0000-0000-000000000001',
    '2025-01-01',
    '2025-03-31',
    'income',
    NULL,
    NULL
);
```

---

### `get_expense_drilldown(athlete_id, category, start_date, end_date)`
Returns individual expenses for a specific category.

**Parameters:**
- `athlete_id` (UUID) - The athlete's ID
- `category` (TEXT) - The expense category to drill into
- `start_date` (DATE, optional) - Start date filter
- `end_date` (DATE, optional) - End date filter

**Returns:** TABLE with expense details

**Usage:**
```sql
-- Get all Business expenses
SELECT * FROM get_expense_drilldown(
    '00000000-0000-0000-0000-000000000001',
    'Business'
);

-- Get Travel expenses in February
SELECT * FROM get_expense_drilldown(
    '00000000-0000-0000-0000-000000000001',
    'Travel',
    '2025-02-01',
    '2025-02-28'
);
```

---

### `calculate_tax_vault_progress(athlete_id)`
Calculates tax vault progress percentage and projection.

**Parameters:**
- `athlete_id` (UUID) - The athlete's ID

**Returns:** TABLE with:
| Column | Type | Description |
|--------|------|-------------|
| current_amount | DECIMAL(12, 2) | Current tax vault balance |
| goal_amount | DECIMAL(12, 2) | Tax vault goal |
| progress_percentage | INTEGER | Progress toward goal (0-100) |
| projected_total | DECIMAL(12, 2) | Projected year-end tax savings |
| on_track | BOOLEAN | Whether on track to meet goal |

**Usage:**
```sql
SELECT * FROM calculate_tax_vault_progress('00000000-0000-0000-0000-000000000001');
```

## Enhanced Database Views

### `recent_activity`
Returns the most recent transactions formatted for dashboard display.

**Columns:** id, athlete_id, type, label, description, formatted_date, transaction_date, amount, category, created_at

**Usage:**
```sql
-- Get last 5 recent transactions
SELECT * FROM recent_activity
WHERE athlete_id = '00000000-0000-0000-0000-000000000001'
LIMIT 5;
```

---

### `upcoming_tasks_view`
Returns non-completed upcoming tasks with formatted dates.

**Columns:** id, athlete_id, label, formatted_date, due_date, task_type, related_deal_id, related_deal_name

**Usage:**
```sql
-- Get next 3 upcoming tasks
SELECT * FROM upcoming_tasks_view
WHERE athlete_id = '00000000-0000-0000-0000-000000000001'
LIMIT 3;
```

---

### `dashboard_summary`
Comprehensive athlete summary combining profile, deals, and financial data.

**Usage:**
```sql
SELECT * FROM dashboard_summary
WHERE athlete_id = '00000000-0000-0000-0000-000000000001';
```

---

### `income_by_source_chart`
Income aggregated by source with color codes for charts.

**Columns:** athlete_id, name, value, color

**Usage:**
```sql
SELECT * FROM income_by_source_chart
WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Example result:
-- name          | value     | color
-- Brand Deals   | 24230.00  | #3b82f6
-- Collectives   | 18000.00  | #10b981
-- Social Media  | 5000.00   | #8b5cf6
```

---

### `expenses_by_category_chart`
Expenses aggregated by category with color codes for charts.

**Usage:**
```sql
SELECT * FROM expenses_by_category_chart
WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Example result:
-- name       | value    | color
-- Business   | 1840.00  | #3b82f6
-- Travel     | 1200.00  | #a855f7
-- Equipment  | 800.00   | #10b981
```

---

### Additional Views
- **`monthly_income_trend`**: Monthly income over time
- **`monthly_expense_trend`**: Monthly expenses over time
- **`deal_details_with_totals`**: Deals with calculated totals
- **`athlete_team`**: People with aggregated roles
- **`quarterly_tax_status`**: Tax payments with due date info
- **`compliance_status_with_details`**: Compliance with deal counts
- **`cash_flow_summary_ytd`**: Year-to-date summary

See `/database/views/dashboard_views.sql` for complete documentation.

## Common Query Examples

### Get Complete Dashboard Data
```sql
-- Single query to get all dashboard data
WITH kpis AS (
  SELECT * FROM get_dashboard_kpis('00000000-0000-0000-0000-000000000001')
),
recent AS (
  SELECT json_agg(ra.* ORDER BY transaction_date DESC) as activities
  FROM (
    SELECT * FROM recent_activity
    WHERE athlete_id = '00000000-0000-0000-0000-000000000001'
    LIMIT 5
  ) ra
),
upcoming AS (
  SELECT json_agg(ut.*) as tasks
  FROM (
    SELECT * FROM upcoming_tasks_view
    WHERE athlete_id = '00000000-0000-0000-0000-000000000001'
    LIMIT 3
  ) ut
),
trend AS (
  SELECT json_agg(mt.* ORDER BY month_date) as months
  FROM get_monthly_trend('00000000-0000-0000-0000-000000000001', 3) mt
)
SELECT
  d.*,
  k.*,
  r.activities,
  u.tasks,
  t.months
FROM dashboard_summary d
CROSS JOIN kpis k
CROSS JOIN recent r
CROSS JOIN upcoming u
CROSS JOIN trend t
WHERE d.athlete_id = '00000000-0000-0000-0000-000000000001';
```

### Get Cash Flow Data with Filters
```sql
-- Get cash flow page data with date filter
SELECT
  -- Summary
  (SELECT row_to_json(s.*)
   FROM get_transaction_summary(
     '00000000-0000-0000-0000-000000000001',
     '2025-01-01',
     '2025-03-31',
     NULL,
     NULL
   ) s) as summary,

  -- Monthly trend
  (SELECT json_agg(mt.* ORDER BY month_date)
   FROM get_monthly_trend('00000000-0000-0000-0000-000000000001', 3) mt) as monthly_trend,

  -- Income by source
  (SELECT json_agg(ibs.*)
   FROM income_by_source_chart ibs
   WHERE ibs.athlete_id = '00000000-0000-0000-0000-000000000001') as income_by_source,

  -- Expenses by category
  (SELECT json_agg(ebc.*)
   FROM expenses_by_category_chart ebc
   WHERE ebc.athlete_id = '00000000-0000-0000-0000-000000000001') as expenses_by_category;
```

### Calculate Month-over-Month Growth
```sql
-- Get MoM growth for income
WITH monthly AS (
  SELECT
    TO_CHAR(month_date, 'Mon YYYY') as month,
    income,
    LAG(income) OVER (ORDER BY month_date) as prev_month_income
  FROM get_monthly_trend('00000000-0000-0000-0000-000000000001', 6)
)
SELECT
  month,
  income,
  prev_month_income,
  CASE
    WHEN prev_month_income > 0
    THEN ROUND(((income - prev_month_income) / prev_month_income * 100), 2)
    ELSE 0
  END as growth_percentage
FROM monthly
WHERE prev_month_income IS NOT NULL;
```

## Migration Management

### Running Migrations

The project uses a custom TypeScript migration runner.

**Commands:**
```bash
# Run all pending migrations
npm run db:migrate

# Show migration status
tsx database/migrate.ts status

# Remove last migration record (use with caution!)
tsx database/migrate.ts rollback
```

**Migration Files:**
- `/database/migrations/001_initial_schema.sql` - Base schema
- `/database/migrations/002_seed_data.sql` - Demo data (Marcus Thompson)
- Additional migrations numbered sequentially (003, 004, etc.)

### Creating New Migrations

1. Create a new file: `/database/migrations/003_your_migration_name.sql`
2. Write your SQL (CREATE, ALTER, INSERT, etc.)
3. Run: `npm run db:migrate`

**Example:**
```sql
-- /database/migrations/003_add_social_media_metrics.sql
ALTER TABLE connected_accounts
ADD COLUMN follower_count INTEGER DEFAULT 0,
ADD COLUMN engagement_rate DECIMAL(5, 4);

CREATE INDEX idx_connected_accounts_follower_count
ON connected_accounts(follower_count DESC);
```

### Database Scripts

**Available in package.json:**
```bash
npm run db:migrate      # Run migrations
npm run db:seed         # Run seed data only
npm run db:reset        # Drop, recreate, and migrate
```

## Performance Tips

1. Use connection pooling (pgBouncer, pg.Pool, etc.)
2. Consider partitioning `transactions` table by date for large datasets
3. Use materialized views for complex aggregations that don't need real-time data:
   ```sql
   CREATE MATERIALIZED VIEW monthly_summary AS
   SELECT * FROM get_monthly_trend(NULL, 12);

   REFRESH MATERIALIZED VIEW monthly_summary;
   ```
4. Use `EXPLAIN ANALYZE` to optimize slow queries
5. Monitor index usage:
   ```sql
   SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';
   ```
6. Consider read replicas for reporting queries
