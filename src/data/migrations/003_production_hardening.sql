-- ============================================
-- Migration: 003_production_hardening.sql
-- Description: Production-ready enhancements for Plaid, auditability, and data integrity
-- Created: 2026-01-14
-- ============================================

-- ============================================
-- PART 1: TRANSACTION SIGN CONVENTION
-- ============================================

-- Document the convention: income = positive, expense/tax_transfer = negative
COMMENT ON COLUMN transactions.amount IS 'Transaction amount: positive for income, negative for expenses/tax_transfers';

-- Add constraint to enforce sign convention
ALTER TABLE transactions
ADD CONSTRAINT check_amount_sign CHECK (
    (type = 'income' AND amount > 0) OR
    (type IN ('expense', 'tax_transfer') AND amount < 0)
);

-- ============================================
-- PART 2: PLAID INTEGRATION FIELDS
-- ============================================

-- Add Plaid and deduplication fields to transactions
ALTER TABLE transactions
ADD COLUMN external_provider VARCHAR(50) DEFAULT 'manual',
ADD COLUMN external_transaction_id VARCHAR(255),
ADD COLUMN pending BOOLEAN DEFAULT FALSE,
ADD COLUMN merchant_name VARCHAR(255),
ADD COLUMN raw_metadata JSONB,
ADD COLUMN posted_date DATE;

-- Create unique constraint for Plaid deduplication
CREATE UNIQUE INDEX idx_transactions_external_dedup
ON transactions(athlete_id, external_provider, external_transaction_id)
WHERE external_transaction_id IS NOT NULL;

-- Add index for pending transactions
CREATE INDEX idx_transactions_pending
ON transactions(athlete_id, pending, transaction_date DESC)
WHERE pending = TRUE;

COMMENT ON COLUMN transactions.external_provider IS 'Source of transaction: manual, plaid, etc.';
COMMENT ON COLUMN transactions.external_transaction_id IS 'External system transaction ID for deduplication';
COMMENT ON COLUMN transactions.pending IS 'Whether transaction is pending (not yet posted)';
COMMENT ON COLUMN transactions.merchant_name IS 'Merchant/payee name from external system';
COMMENT ON COLUMN transactions.raw_metadata IS 'Raw transaction data from external provider (JSONB)';
COMMENT ON COLUMN transactions.posted_date IS 'Date transaction posted (may differ from transaction_date)';

-- ============================================
-- PART 3: PLAID PLUMBING TABLES
-- ============================================

-- Plaid Items (one per institution connection)
CREATE TABLE plaid_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    plaid_item_id VARCHAR(255) NOT NULL UNIQUE,
    plaid_access_token TEXT NOT NULL, -- Encrypted in production
    institution_id VARCHAR(255) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, login_required, error
    error_code VARCHAR(100),
    error_message TEXT,
    consent_expiration_time TIMESTAMP WITH TIME ZONE,
    last_successful_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plaid_items_athlete ON plaid_items(athlete_id);
CREATE INDEX idx_plaid_items_status ON plaid_items(status);

COMMENT ON TABLE plaid_items IS 'Plaid Item connections (one per bank/institution login)';

-- Plaid Sync State (cursor tracking for incremental sync)
CREATE TABLE plaid_sync_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plaid_item_id UUID NOT NULL REFERENCES plaid_items(id) ON DELETE CASCADE,
    cursor VARCHAR(500), -- Plaid sync cursor
    last_sync_at TIMESTAMP WITH TIME ZONE,
    transactions_added INTEGER DEFAULT 0,
    transactions_modified INTEGER DEFAULT 0,
    transactions_removed INTEGER DEFAULT 0,
    has_more BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plaid_item_id)
);

CREATE INDEX idx_plaid_sync_state_item ON plaid_sync_state(plaid_item_id);

COMMENT ON TABLE plaid_sync_state IS 'Tracks Plaid sync cursors for incremental transaction updates';

-- Plaid Accounts (accounts within an item)
CREATE TABLE plaid_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plaid_item_id UUID NOT NULL REFERENCES plaid_items(id) ON DELETE CASCADE,
    plaid_account_id VARCHAR(255) NOT NULL UNIQUE,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- depository, credit, loan, investment
    account_subtype VARCHAR(50), -- checking, savings, credit card, etc.
    mask VARCHAR(10), -- Last 4 digits
    current_balance DECIMAL(12, 2),
    available_balance DECIMAL(12, 2),
    currency_code VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plaid_accounts_item ON plaid_accounts(plaid_item_id);
CREATE INDEX idx_plaid_accounts_active ON plaid_accounts(is_active);

COMMENT ON TABLE plaid_accounts IS 'Bank accounts from Plaid connections';

-- Link transactions to Plaid accounts
ALTER TABLE transactions
ADD COLUMN plaid_account_id UUID REFERENCES plaid_accounts(id) ON DELETE SET NULL;

CREATE INDEX idx_transactions_plaid_account ON transactions(plaid_account_id);

-- ============================================
-- PART 4: TAX WITHHOLDINGS AUDIT TRAIL
-- ============================================

-- Tax Withholdings table for auditability
CREATE TABLE tax_withholdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    withholding_amount DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 4) NOT NULL,
    income_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_withholding CHECK (withholding_amount >= 0)
);

CREATE INDEX idx_tax_withholdings_transaction ON tax_withholdings(transaction_id);
CREATE INDEX idx_tax_withholdings_athlete ON tax_withholdings(athlete_id);
CREATE INDEX idx_tax_withholdings_created ON tax_withholdings(created_at DESC);

COMMENT ON TABLE tax_withholdings IS 'Audit trail of tax withholdings on income transactions';

-- Update tax vault trigger to create withholding records
DROP TRIGGER IF EXISTS update_tax_vault_trigger ON transactions;

CREATE OR REPLACE FUNCTION update_tax_vault_on_income()
RETURNS TRIGGER AS $$
DECLARE
    v_tax_rate DECIMAL(5, 4);
    v_tax_amount DECIMAL(12, 2);
BEGIN
    IF NEW.type = 'income' AND NEW.amount > 0 THEN
        -- Get athlete's tax rate
        SELECT COALESCE(ts.default_tax_rate, 0.28) INTO v_tax_rate
        FROM user_settings ts
        WHERE ts.athlete_id = NEW.athlete_id;

        -- Calculate tax amount
        v_tax_amount := NEW.amount * v_tax_rate;

        -- Update tax vault
        INSERT INTO tax_vault (athlete_id, current_amount, tax_rate)
        VALUES (NEW.athlete_id, v_tax_amount, v_tax_rate)
        ON CONFLICT (athlete_id)
        DO UPDATE SET
            current_amount = tax_vault.current_amount + v_tax_amount,
            last_updated_at = CURRENT_TIMESTAMP;

        -- Create withholding record for audit trail
        INSERT INTO tax_withholdings (
            transaction_id,
            athlete_id,
            withholding_amount,
            tax_rate,
            income_amount
        ) VALUES (
            NEW.id,
            NEW.athlete_id,
            v_tax_amount,
            v_tax_rate,
            NEW.amount
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tax_vault_trigger AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_tax_vault_on_income();

-- ============================================
-- PART 5: TRANSACTION OVERRIDES
-- ============================================

-- Transaction Overrides table for user corrections
CREATE TABLE transaction_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    overridden_category VARCHAR(100),
    overridden_description TEXT,
    overridden_deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    overridden_notes TEXT,
    override_reason TEXT,
    updated_by_person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(transaction_id)
);

CREATE INDEX idx_transaction_overrides_transaction ON transaction_overrides(transaction_id);
CREATE INDEX idx_transaction_overrides_person ON transaction_overrides(updated_by_person_id);

COMMENT ON TABLE transaction_overrides IS 'User corrections to transaction data without modifying original';

-- Trigger to update updated_at
CREATE TRIGGER update_transaction_overrides_updated_at BEFORE UPDATE ON transaction_overrides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 6: ENHANCED COMPOSITE INDEXES
-- ============================================

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_transactions_athlete_type_date
ON transactions(athlete_id, type, transaction_date DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_athlete_category_date
ON transactions(athlete_id, category, transaction_date DESC);

CREATE INDEX IF NOT EXISTS idx_upcoming_tasks_athlete_completed_due
ON upcoming_tasks(athlete_id, is_completed, due_date)
WHERE is_completed = FALSE;

CREATE INDEX IF NOT EXISTS idx_deals_athlete_status_created
ON deals(athlete_id, status, created_at DESC);

-- Index for override lookups
CREATE INDEX idx_transactions_with_overrides
ON transactions(id)
WHERE EXISTS (SELECT 1 FROM transaction_overrides WHERE transaction_id = transactions.id);

-- ============================================
-- PART 7: UPDATED VIEWS WITH OVERRIDE SUPPORT
-- ============================================

-- Enhanced view that prefers override values
CREATE OR REPLACE VIEW transactions_effective AS
SELECT
    t.id,
    t.athlete_id,
    t.type,
    COALESCE(o.overridden_category, t.category) as category,
    COALESCE(o.overridden_description, t.description) as description,
    t.amount,
    t.transaction_date,
    t.posted_date,
    COALESCE(o.overridden_deal_id, t.deal_id) as deal_id,
    t.receipt_url,
    COALESCE(o.overridden_notes, t.notes) as notes,
    t.external_provider,
    t.external_transaction_id,
    t.pending,
    t.merchant_name,
    t.plaid_account_id,
    CASE WHEN o.id IS NOT NULL THEN TRUE ELSE FALSE END as has_override,
    o.override_reason,
    o.updated_by_person_id as override_by_person_id,
    t.created_at,
    t.updated_at
FROM transactions t
LEFT JOIN transaction_overrides o ON o.transaction_id = t.id;

COMMENT ON VIEW transactions_effective IS 'Transactions with overrides applied - use this view in queries';

-- Update existing views to use transactions_effective
CREATE OR REPLACE VIEW income_by_source_chart AS
SELECT
    athlete_id,
    CASE
        WHEN category = 'Collective' THEN 'Collectives'
        WHEN category = 'Brand Deal' THEN 'Brand Deals'
        ELSE category
    END as name,
    SUM(amount) as value,
    CASE
        WHEN category = 'Collective' THEN '#10b981'
        WHEN category = 'Brand Deal' THEN '#3b82f6'
        WHEN category = 'Social Media' THEN '#8b5cf6'
        ELSE '#a855f7'
    END as color
FROM transactions_effective
WHERE type = 'income'
GROUP BY athlete_id, category
ORDER BY value DESC;

CREATE OR REPLACE VIEW expenses_by_category_chart AS
SELECT
    athlete_id,
    category as name,
    SUM(ABS(amount)) as value,
    CASE
        WHEN category = 'Business' THEN '#3b82f6'
        WHEN category = 'Travel' THEN '#a855f7'
        WHEN category = 'Equipment' THEN '#10b981'
        ELSE '#ec4899'
    END as color
FROM transactions_effective
WHERE type = 'expense'
GROUP BY athlete_id, category
ORDER BY value DESC;

-- ============================================
-- PART 8: ADDITIONAL CONSTRAINTS
-- ============================================

-- Ensure plaid_access_token is never null for active items
ALTER TABLE plaid_items
ADD CONSTRAINT check_active_has_token CHECK (
    (status != 'active') OR (plaid_access_token IS NOT NULL AND plaid_access_token != '')
);

-- Ensure withholding amount matches calculation
ALTER TABLE tax_withholdings
ADD CONSTRAINT check_withholding_calculation CHECK (
    ABS(withholding_amount - (income_amount * tax_rate)) < 0.01
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify the migration:

-- Check transaction sign convention is working:
-- SELECT type, MIN(amount) as min_amt, MAX(amount) as max_amt FROM transactions GROUP BY type;
-- Expected: income has positive amounts, expense/tax_transfer have negative amounts

-- Check Plaid tables exist:
-- \dt plaid_*

-- Check tax_withholdings is tracking:
-- SELECT COUNT(*) FROM tax_withholdings;

-- Check overrides table:
-- SELECT COUNT(*) FROM transaction_overrides;

-- Check composite indexes:
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('transactions', 'upcoming_tasks', 'deals');
