-- ============================================
-- Migration: 004_enhanced_seed_data.sql
-- Description: Enhanced seed data with Plaid examples, overrides, and realistic scenarios
-- Created: 2026-01-14
-- ============================================

-- ============================================
-- PLAID ITEMS & ACCOUNTS
-- ============================================

-- Add a Plaid connection for Marcus Thompson
INSERT INTO plaid_items (
    id,
    athlete_id,
    plaid_item_id,
    plaid_access_token,
    institution_id,
    institution_name,
    status,
    last_successful_sync
) VALUES (
    '00000000-0000-0000-0000-000000001001',
    '00000000-0000-0000-0000-000000000001',
    'item_marcus_chase_12345',
    'access-sandbox-marcus-token-encrypted',
    'ins_109508',
    'Chase',
    'active',
    CURRENT_TIMESTAMP
);

-- Add Plaid sync state
INSERT INTO plaid_sync_state (
    plaid_item_id,
    cursor,
    last_sync_at,
    transactions_added,
    transactions_modified,
    transactions_removed,
    has_more
) VALUES (
    '00000000-0000-0000-0000-000000001001',
    'cursor_12345_marcus_chase',
    CURRENT_TIMESTAMP,
    15,
    0,
    0,
    false
);

-- Add Plaid checking account
INSERT INTO plaid_accounts (
    id,
    plaid_item_id,
    plaid_account_id,
    account_name,
    account_type,
    account_subtype,
    mask,
    current_balance,
    available_balance,
    is_active
) VALUES (
    '00000000-0000-0000-0000-000000002001',
    '00000000-0000-0000-0000-000000001001',
    'acct_marcus_checking_9876',
    'Chase Total Checking',
    'depository',
    'checking',
    '4321',
    45230.50,
    43206.50,
    true
);

-- ============================================
-- UPDATE EXISTING TRANSACTIONS WITH PLAID DATA
-- ============================================

-- Mark some existing transactions as from Plaid
UPDATE transactions SET
    external_provider = 'plaid',
    external_transaction_id = 'plaid_tx_auto_post1_' || id::text,
    plaid_account_id = '00000000-0000-0000-0000-000000002001',
    merchant_name = 'Auto Dealership Inc',
    posted_date = transaction_date
WHERE description LIKE '%Auto Dealership%';

UPDATE transactions SET
    external_provider = 'plaid',
    external_transaction_id = 'plaid_tx_collective_' || id::text,
    plaid_account_id = '00000000-0000-0000-0000-000000002001',
    merchant_name = 'Conference Collective',
    posted_date = transaction_date
WHERE description LIKE '%Collective%';

UPDATE transactions SET
    external_provider = 'plaid',
    external_transaction_id = 'plaid_tx_expense_' || id::text,
    plaid_account_id = '00000000-0000-0000-0000-000000002001',
    posted_date = transaction_date
WHERE type = 'expense' AND transaction_date < '2025-03-15';

-- ============================================
-- ADD PENDING TRANSACTIONS (Plaid behavior)
-- ============================================

-- Pending income transaction
INSERT INTO transactions (
    athlete_id, type, category, description, amount, transaction_date,
    external_provider, external_transaction_id, pending, merchant_name, plaid_account_id
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Tech Partnership Payment - Pending',
    3500.00,
    CURRENT_DATE,
    'plaid',
    'plaid_tx_pending_tech_001',
    true,
    'Tech Company LLC',
    '00000000-0000-0000-0000-000000002001'
);

-- Pending expense
INSERT INTO transactions (
    athlete_id, type, category, description, amount, transaction_date,
    external_provider, external_transaction_id, pending, merchant_name, plaid_account_id
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'expense',
    'Travel',
    'Hotel Reservation - Pending',
    -385.00,
    CURRENT_DATE,
    'plaid',
    'plaid_tx_pending_hotel_001',
    true,
    'Marriott Hotels',
    '00000000-0000-0000-0000-000000002001'
);

-- ============================================
-- TRANSACTION OVERRIDES (User Corrections)
-- ============================================

-- Get a transaction ID to override (Business expense that should be Travel)
DO $$
DECLARE
    v_transaction_id UUID;
    v_person_id UUID;
BEGIN
    -- Find the "Business Cards" transaction
    SELECT id INTO v_transaction_id
    FROM transactions
    WHERE description = 'Business Cards'
    LIMIT 1;

    -- Get Marcus's agent (Mike Reynolds) as the person who made the override
    SELECT id INTO v_person_id
    FROM people
    WHERE name = 'Mike Reynolds'
    LIMIT 1;

    -- Create override to recategorize as Equipment
    IF v_transaction_id IS NOT NULL THEN
        INSERT INTO transaction_overrides (
            transaction_id,
            overridden_category,
            overridden_description,
            override_reason,
            updated_by_person_id
        ) VALUES (
            v_transaction_id,
            'Equipment',
            'Business Cards (Marketing Materials)',
            'Reclassified as Equipment - marketing materials for appearances',
            v_person_id
        );
    END IF;
END $$;

-- Add another override for a deal linkage
DO $$
DECLARE
    v_transaction_id UUID;
    v_deal_id UUID;
    v_person_id UUID;
BEGIN
    -- Find a transaction that should be linked to a deal
    SELECT id INTO v_transaction_id
    FROM transactions
    WHERE description = 'Instagram Sponsored Post'
    LIMIT 1;

    -- Get a deal ID
    SELECT id INTO v_deal_id
    FROM deals
    WHERE deal_name LIKE '%Social%'
    LIMIT 1;

    -- Get accountant as override person
    SELECT id INTO v_person_id
    FROM people
    WHERE name = 'Jennifer Martinez'
    LIMIT 1;

    IF v_transaction_id IS NOT NULL AND v_deal_id IS NOT NULL THEN
        INSERT INTO transaction_overrides (
            transaction_id,
            overridden_deal_id,
            overridden_notes,
            override_reason,
            updated_by_person_id
        ) VALUES (
            v_transaction_id,
            v_deal_id,
            'Linked to TikTok sponsorship deal - January deliverable',
            'Associated transaction with correct deal per contract',
            v_person_id
        );
    END IF;
END $$;

-- ============================================
-- ADDITIONAL REALISTIC TRANSACTIONS
-- ============================================

-- Add more diverse income sources
INSERT INTO transactions (
    athlete_id, type, category, description, amount, transaction_date,
    external_provider, merchant_name, plaid_account_id, posted_date
) VALUES
-- NIL Platform payment
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'NIL Platform Marketplace Sale', 450.00, '2025-03-22', 'manual', 'NIL Marketplace', NULL, NULL),

-- Appearance fee
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Youth Camp Appearance Fee', 1200.00, '2025-03-25', 'plaid', 'Youth Sports Camp LLC', '00000000-0000-0000-0000-000000002001', '2025-03-25'),

-- Jersey/Merchandise royalty
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Jersey Sales Royalty - Q1', 875.00, '2025-03-28', 'manual', NULL, NULL, NULL),

-- Podcast sponsorship
('00000000-0000-0000-0000-000000000001', 'income', 'Social Media', 'Podcast Episode Sponsorship', 600.00, '2025-03-30', 'manual', NULL, NULL, NULL);

-- Add more expense categories
INSERT INTO transactions (
    athlete_id, type, category, description, amount, transaction_date,
    external_provider, merchant_name, plaid_account_id, posted_date
) VALUES
-- Professional services
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Legal Review - NIL Contracts', -650.00, '2025-03-23', 'plaid', 'Sports Law Group', '00000000-0000-0000-0000-000000002001', '2025-03-23'),

-- Content creation
('00000000-0000-0000-0000-000000000001', 'expense', 'Equipment', 'Video Editing Software Annual', -299.00, '2025-03-24', 'plaid', 'Adobe Creative Cloud', '00000000-0000-0000-0000-000000002001', '2025-03-24'),

-- Insurance
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Professional Liability Insurance', -485.00, '2025-03-26', 'plaid', 'NIL Insurance Co', '00000000-0000-0000-0000-000000002001', '2025-03-26'),

-- Training/Development
('00000000-0000-0000-0000-000000000001', 'expense', 'Equipment', 'Personal Training Session', -150.00, '2025-03-27', 'plaid', 'Elite Performance Training', '00000000-0000-0000-0000-000000002001', '2025-03-27'),

-- Marketing
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Social Media Ads Campaign', -320.00, '2025-03-29', 'plaid', 'Meta Ads', '00000000-0000-0000-0000-000000002001', '2025-03-29');

-- ============================================
-- TAX WITHHOLDINGS
-- Note: These are automatically created by trigger, but we can verify them
-- ============================================

-- The trigger should have created withholding records for all income transactions
-- Verify with: SELECT COUNT(*) FROM tax_withholdings WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- ============================================
-- REALISTIC DEAL SCENARIOS
-- ============================================

-- Add a deal that's in negotiation (pending)
INSERT INTO deals (
    athlete_id, deal_name, status, source, amount, amount_type, next_action
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Regional Car Dealership Partnership',
    'pending',
    'Brand Direct',
    8500.00,
    'one-time',
    'Legal review in progress'
),
(
    '00000000-0000-0000-0000-000000000001',
    'Streaming Platform Content Series',
    'pending',
    'Brand Direct',
    15000.00,
    'one-time',
    'Contract terms under negotiation'
),
(
    '00000000-0000-0000-0000-000000000001',
    'Monthly Podcast Host',
    'active',
    'Brand Direct',
    800.00,
    'monthly',
    'Next episode: Apr 5'
);

-- ============================================
-- ADDITIONAL COMPLIANCE SCENARIOS
-- ============================================

-- Update compliance with more realistic data
UPDATE compliance
SET
    deals_reported = 8,
    last_reported_at = CURRENT_DATE - INTERVAL '5 days',
    notes = 'Quarterly compliance report submitted. All active deals properly disclosed.'
WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- ============================================
-- ADDITIONAL TASKS
-- ============================================

INSERT INTO upcoming_tasks (athlete_id, label, due_date, task_type) VALUES
('00000000-0000-0000-0000-000000000001', 'Submit W-9 to NIL Platform', CURRENT_DATE + INTERVAL '7 days', 'compliance'),
('00000000-0000-0000-0000-000000000001', 'Renew Professional Liability Insurance', CURRENT_DATE + INTERVAL '30 days', 'compliance'),
('00000000-0000-0000-0000-000000000001', 'Podcast Recording Session', CURRENT_DATE + INTERVAL '5 days', 'deal');

-- ============================================
-- BANK ACCOUNT (DEPRECATED - now using plaid_accounts)
-- ============================================

-- Link legacy bank_accounts table to new plaid system
INSERT INTO bank_accounts (
    athlete_id, bank_name, account_type, last_four_digits,
    is_connected, plaid_item_id, plaid_account_id, last_synced_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Chase',
    'Checking',
    '4321',
    true,
    'item_marcus_chase_12345',
    'acct_marcus_checking_9876',
    CURRENT_TIMESTAMP
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check Plaid connections:
-- SELECT * FROM plaid_items WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Check pending transactions:
-- SELECT * FROM transactions WHERE athlete_id = '00000000-0000-0000-0000-000000000001' AND pending = true;

-- Check overrides:
-- SELECT t.description, t.category as original_category, o.overridden_category, o.override_reason
-- FROM transactions t
-- JOIN transaction_overrides o ON o.transaction_id = t.id;

-- Check effective transactions (with overrides applied):
-- SELECT id, description, category, has_override FROM transactions_effective
-- WHERE athlete_id = '00000000-0000-0000-0000-000000000001' AND has_override = true;

-- Check tax withholdings:
-- SELECT COUNT(*) as total_withholdings, SUM(withholding_amount) as total_withheld
-- FROM tax_withholdings
-- WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Test waterfall chart:
-- SELECT * FROM get_cashflow_waterfall('00000000-0000-0000-0000-000000000001');

-- Test page functions:
-- SELECT fn_home_page('00000000-0000-0000-0000-000000000001');
-- SELECT fn_cashflow_page('00000000-0000-0000-0000-000000000001');
