# Production Enhancements

This document outlines all production-ready enhancements implemented for the athlete dashboard database.

## Overview

The database has been hardened with:
- ✅ Plaid integration support
- ✅ Transaction deduplication
- ✅ Tax withholding audit trail
- ✅ User transaction overrides
- ✅ Waterfall cash flow visualization
- ✅ One-function-per-page API design
- ✅ Enhanced seed data with realistic scenarios

## Migration Files

### 003_production_hardening.sql
**Purpose**: Core production enhancements

**What it does**:
1. **Transaction Sign Convention**
   - Enforces: income = positive, expenses/tax_transfers = negative
   - Adds CHECK constraint to prevent incorrect signs
   - Documents the convention in column comments

2. **Plaid Integration Fields** (transactions table)
   - `external_provider` - Source: 'manual', 'plaid', etc.
   - `external_transaction_id` - For deduplication
   - `pending` - Whether transaction is posted
   - `merchant_name` - Merchant from Plaid
   - `raw_metadata` - Full Plaid transaction data (JSONB)
   - `posted_date` - When transaction posted
   - `plaid_account_id` - Link to Plaid account

3. **Plaid Tables**
   - `plaid_items` - Bank/institution connections
   - `plaid_sync_state` - Sync cursor tracking
   - `plaid_accounts` - Individual bank accounts

4. **Tax Withholdings Table**
   - Audit trail for every tax withholding
   - Links to original income transaction
   - Records tax rate and amounts
   - Updated trigger creates records automatically

5. **Transaction Overrides Table**
   - User corrections without modifying originals
   - Override category, description, deal linkage, notes
   - Track who made the override and why
   - `transactions_effective` view prefers overrides

6. **Enhanced Views**
   - `transactions_effective` - Transactions with overrides applied
   - Updated `income_by_source_chart` to use effective transactions
   - Updated `expenses_by_category_chart` to use effective transactions

7. **Composite Indexes**
   - `idx_transactions_athlete_type_date`
   - `idx_transactions_athlete_category_date`
   - `idx_upcoming_tasks_athlete_completed_due`
   - `idx_deals_athlete_status_created`
   - Plus deduplication and pending transaction indexes

### 004_enhanced_seed_data.sql
**Purpose**: Realistic demo data

**What it adds**:
- Plaid connection for Marcus Thompson (Chase bank)
- Plaid checking account with balance
- Mix of manual and Plaid transactions
- Pending transactions (Plaid behavior)
- Transaction overrides (2 examples)
- Diverse income sources (NIL marketplace, appearances, royalties, podcast)
- Additional expense categories (legal, insurance, training, marketing)
- More realistic deals (pending, various amounts)
- Updated compliance data
- Additional tasks

## New Functions

### functions/page_functions.sql

#### Waterfall Chart
```sql
get_cashflow_waterfall(athlete_id, start_date, end_date)
```
Returns: Income → Tax Vault → Expenses → Net Cash
Perfect for visualizing cash flow breakdown

**Usage**:
```sql
SELECT * FROM get_cashflow_waterfall('00000000-0000-0000-0000-000000000001');
```

Returns:
| step | amount | cumulative | step_order | color |
|------|--------|------------|------------|-------|
| Income | 47230.00 | 47230.00 | 1 | #10b981 |
| Tax Vault | -13224.00 | 33406.00 | 2 | #3b82f6 |
| Expenses | -3840.00 | 29566.00 | 3 | #ef4444 |
| Net Cash | 29566.00 | 29566.00 | 4 | #8b5cf6 |

#### Page-Level Functions
These return complete JSON for each page with ONE query:

1. **`fn_home_page(athlete_id)`**
   - Returns: athlete info, KPIs, recent activity, upcoming tasks, compliance, deals summary
   - Use this to replace multiple queries on home page

2. **`fn_cashflow_page(athlete_id, start_date, end_date, type, categories)`**
   - Returns: athlete, summary, monthly trend, waterfall, income by source, expenses by category, recent transactions
   - Supports all existing filters

3. **`fn_deals_page(athlete_id, status_filter)`**
   - Returns: athlete, deal summary, all deals with calculations
   - Includes paid-to-date from linked transactions

4. **`fn_taxes_page(athlete_id)`**
   - Returns: athlete, tax vault, progress, quarterly payments, withholdings history, projected annual
   - Complete tax page in one call

5. **`fn_people_page(athlete_id)`**
   - Returns: athlete, all team members with roles
   - Sorted by access level

**Example Usage**:
```sql
-- Get complete home page data
SELECT fn_home_page('00000000-0000-0000-0000-000000000001');

-- Get cash flow with filters
SELECT fn_cashflow_page(
    '00000000-0000-0000-0000-000000000001',
    '2025-01-01',
    '2025-03-31',
    NULL,
    NULL
);
```

## Key Concepts

### 1. Transaction Sign Convention

**Rule**: Income is positive, expenses/tax_transfers are negative

**Why**: Consistent with accounting principles and simplifies NET calculations

**Example**:
```sql
-- Income: +1000.00
-- Expense: -85.00
-- Net: +1000.00 + (-85.00) = +915.00
```

**Enforced by**: CHECK constraint at database level

### 2. Plaid Integration Architecture

**Flow**:
1. User connects bank → creates `plaid_items` record
2. Plaid returns accounts → creates `plaid_accounts` records
3. Sync transactions → creates `transactions` with `external_transaction_id`
4. Cursor saved → in `plaid_sync_state` for incremental sync
5. Deduplication → UNIQUE constraint prevents duplicates

**Example**:
```sql
-- Check Plaid connections
SELECT * FROM plaid_items WHERE athlete_id = $1;

-- Get Plaid accounts
SELECT * FROM plaid_accounts WHERE plaid_item_id = $1;

-- Get Plaid transactions
SELECT * FROM transactions
WHERE plaid_account_id = $1 AND external_provider = 'plaid';
```

### 3. Transaction Overrides

**Problem**: User needs to correct Plaid transaction categorization without losing original data

**Solution**: `transaction_overrides` table + `transactions_effective` view

**Example**:
```sql
-- Original transaction: "AMAZON" → Business expense
-- User correction: Should be "Equipment" (camera gear)

INSERT INTO transaction_overrides (
    transaction_id,
    overridden_category,
    override_reason,
    updated_by_person_id
) VALUES (
    $transaction_id,
    'Equipment',
    'Amazon purchase was camera equipment',
    $person_id
);

-- All queries should use transactions_effective view
SELECT * FROM transactions_effective WHERE athlete_id = $1;
-- This automatically prefers override values
```

### 4. Tax Withholding Audit Trail

**Problem**: Need to track when/how much tax was withheld from each income

**Solution**: `tax_withholdings` table + automatic trigger

**How it works**:
1. Income transaction created
2. Trigger fires
3. Calculates tax amount (income × rate)
4. Updates tax vault
5. Creates withholding record for audit

**Example Query**:
```sql
-- See tax withholding history
SELECT
    t.description,
    t.amount as income,
    tw.withholding_amount,
    tw.tax_rate,
    tw.created_at
FROM tax_withholdings tw
JOIN transactions t ON t.id = tw.transaction_id
WHERE tw.athlete_id = $1
ORDER BY tw.created_at DESC;
```

### 5. Waterfall Charts

**Purpose**: Visualize cash flow breakdown step-by-step

**Steps**:
1. Start with total income
2. Subtract tax withholdings
3. Subtract expenses
4. End with net cash

**Frontend Integration**:
Use the cumulative values to draw a waterfall chart showing how income flows to net cash.

### 6. One-Function-Per-Page Pattern

**Traditional Approach**:
- Frontend makes 5-10 separate queries
- Multiple round-trips to database
- Complex client-side data assembly

**New Approach**:
- One function call = complete page data
- Single round-trip
- Database does the assembly
- Returns JSONB ready for frontend

**Benefits**:
- Faster page loads
- Simpler frontend code
- Database-level caching possible
- Easier to optimize

**Example**:
```typescript
// Backend API endpoint
app.get('/api/home/:athleteId', async (req, res) => {
    const result = await pool.query(
        'SELECT fn_home_page($1)',
        [req.params.athleteId]
    );
    res.json(result.rows[0].fn_home_page);
});

// Frontend gets everything in one call
const response = await fetch('/api/home/00000000-0000-0000-0000-000000000001');
const { athlete, kpis, recentActivity, upcoming, compliance } = await response.json();
```

## Database Schema Changes Summary

### New Tables (5)
1. `plaid_items` - Bank connections
2. `plaid_sync_state` - Sync cursors
3. `plaid_accounts` - Bank accounts
4. `tax_withholdings` - Tax audit trail
5. `transaction_overrides` - User corrections

### Modified Tables (1)
1. `transactions` - Added 7 new columns for Plaid

### New Views (1)
1. `transactions_effective` - Transactions with overrides

### New Functions (6)
1. `get_cashflow_waterfall()` - Waterfall chart data
2. `fn_home_page()` - Complete home page
3. `fn_cashflow_page()` - Complete cash flow page
4. `fn_deals_page()` - Complete deals page
5. `fn_taxes_page()` - Complete taxes page
6. `fn_people_page()` - Complete people page

### New Indexes (8)
- Transaction deduplication index
- Pending transactions index
- Composite indexes for common queries
- Override lookup indexes

## Running the Migrations

```bash
# Install dependencies (if not already)
npm install

# Run all migrations (includes 003 and 004)
npm run db:migrate

# Check status
npm run db:status

# Verify new tables
psql athlete_dashboard -c "\dt plaid_*"
psql athlete_dashboard -c "\dt *override*"
psql athlete_dashboard -c "\dt *withholding*"
```

## Testing the Enhancements

### 1. Test Plaid Integration
```sql
-- Check Plaid connections
SELECT * FROM plaid_items WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Check Plaid accounts
SELECT * FROM plaid_accounts;

-- Check Plaid transactions
SELECT description, amount, merchant_name, pending
FROM transactions
WHERE external_provider = 'plaid'
LIMIT 10;
```

### 2. Test Transaction Overrides
```sql
-- See transactions with overrides
SELECT
    t.description,
    t.category as original_category,
    te.category as effective_category,
    te.has_override,
    te.override_reason
FROM transactions t
JOIN transactions_effective te ON te.id = t.id
WHERE te.has_override = true;
```

### 3. Test Tax Withholdings
```sql
-- See withholding history
SELECT * FROM tax_withholdings
WHERE athlete_id = '00000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC
LIMIT 10;

-- Verify totals match
SELECT
    SUM(withholding_amount) as total_withheld,
    (SELECT current_amount FROM tax_vault WHERE athlete_id = '00000000-0000-0000-0000-000000000001') as vault_balance
FROM tax_withholdings
WHERE athlete_id = '00000000-0000-0000-0000-000000000001';
```

### 4. Test Waterfall Chart
```sql
SELECT * FROM get_cashflow_waterfall('00000000-0000-0000-0000-000000000001');
```

### 5. Test Page Functions
```sql
-- Home page (returns JSON)
SELECT fn_home_page('00000000-0000-0000-0000-000000000001');

-- Cash flow page with filters
SELECT fn_cashflow_page(
    '00000000-0000-0000-0000-000000000001',
    '2025-01-01',
    '2025-03-31',
    NULL,
    NULL
);

-- Taxes page
SELECT fn_taxes_page('00000000-0000-0000-0000-000000000001');
```

## Next Steps (Future Enhancements)

1. **Plaid Webhooks**
   - Add webhook handling for account updates
   - Real-time transaction notifications

2. **Machine Learning Categorization**
   - Auto-categorize transactions based on history
   - Suggest deal linkages

3. **Multi-Currency Support**
   - Add currency_code to transactions
   - Exchange rate table
   - Multi-currency reporting

4. **Advanced Tax Planning**
   - Quarterly projections with scenarios
   - Tax optimization recommendations
   - State-level tax calculations

5. **Real-time Notifications**
   - Trigger-based notifications
   - LISTEN/NOTIFY for real-time updates

6. **Data Export**
   - CSV export functions
   - Tax year reports
   - Compliance reports

## Performance Considerations

- All new indexes created with appropriate WHERE clauses
- Composite indexes for common query patterns
- JSONB for flexible metadata storage (indexed with GIN if needed)
- Page functions use CTEs for optimal query plans
- Views can be materialized if needed for heavy reporting

## Security Notes

**IMPORTANT**:
- `plaid_access_token` should be encrypted at rest (use pgcrypto)
- `raw_metadata` may contain sensitive data - encrypt if needed
- Audit who creates overrides (tracked in `updated_by_person_id`)
- Row-Level Security (RLS) should be added for multi-tenant deployment

## Documentation

- Main README: `src/data/DATABASE-README.md`
- This file: `src/data/PRODUCTION-ENHANCEMENTS.md`
- Function docs: See comments in SQL files
- API examples: See "Example Usage" sections above
