-- ============================================
-- Migration: 005_mock_data_seed.sql
-- Description: Seed data extracted from mockData.ts (Marcus Thompson)
-- Created: 2026-01-14
-- Uses deterministic UUIDs for repeatability
-- ============================================

-- ============================================
-- ATHLETE (Marcus Thompson)
-- ============================================

INSERT INTO athletes (
    id,
    email,
    first_name,
    last_name,
    sport,
    year,
    password_hash
) VALUES (
    '10000000-0000-0000-0000-000000000001',
    'marcus.thompson@university.edu',
    'Marcus',
    'Thompson',
    'Football',
    'Sophomore',
    '$2a$10$dummyhashforseeddataonly1234567890'
);

-- ============================================
-- USER SETTINGS
-- ============================================

INSERT INTO user_settings (
    athlete_id,
    default_tax_rate
) VALUES (
    '10000000-0000-0000-0000-000000000001',
    0.28
);

-- ============================================
-- DEALS (4 total)
-- ============================================

INSERT INTO deals (
    id,
    athlete_id,
    deal_name,
    status,
    source,
    amount,
    amount_type,
    next_action,
    created_at
) VALUES
-- Deal 1: Local Auto Dealership (active)
(
    '10000000-0000-0000-0001-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Local Auto Dealership Social Posts',
    'active',
    'Brand Direct',
    2400.00,
    'one-time',
    'Post #3 due Mar 15',
    '2025-01-01 10:00:00-05'
),
-- Deal 2: Conference Collective (active, monthly)
(
    '10000000-0000-0000-0001-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Conference Collective Monthly',
    'active',
    'Collective',
    1000.00,
    'monthly',
    NULL,
    '2025-01-01 10:00:00-05'
),
-- Deal 3: Apparel Brand (pending)
(
    '10000000-0000-0000-0001-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Apparel Brand Campaign',
    'pending',
    'Brand Direct',
    5000.00,
    'one-time',
    'Contract review',
    '2025-02-15 14:00:00-05'
),
-- Deal 4: Local Restaurant (active)
(
    '10000000-0000-0000-0001-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'Local Restaurant Appearances',
    'active',
    'Brand Direct',
    1200.00,
    'one-time',
    'Next visit Mar 20',
    '2025-01-05 11:00:00-05'
);

-- ============================================
-- TRANSACTIONS (40 total: Jan-Mar 2025)
-- Income: positive amounts
-- Expenses: negative amounts
-- ============================================

INSERT INTO transactions (
    id,
    athlete_id,
    type,
    category,
    description,
    amount,
    transaction_date,
    deal_id,
    external_provider,
    created_at
) VALUES
-- ============================================
-- JANUARY TRANSACTIONS (10 total)
-- ============================================
-- Income (6)
(
    '10000000-0000-0000-0002-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Collective',
    'January Collective Payment',
    1000.00,
    '2025-01-01',
    '10000000-0000-0000-0001-000000000002',
    'manual',
    '2025-01-01 10:00:00-05'
),
(
    '10000000-0000-0000-0002-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Local Restaurant Deal',
    3500.00,
    '2025-01-05',
    '10000000-0000-0000-0001-000000000004',
    'manual',
    '2025-01-05 14:30:00-05'
),
(
    '10000000-0000-0000-0002-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Auto Dealership Post 1',
    800.00,
    '2025-01-10',
    '10000000-0000-0000-0001-000000000001',
    'manual',
    '2025-01-10 09:15:00-05'
),
(
    '10000000-0000-0000-0002-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Collective',
    'Conference Collective',
    5000.00,
    '2025-01-15',
    NULL,
    'manual',
    '2025-01-15 11:20:00-05'
),
(
    '10000000-0000-0000-0002-000000000005',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Social Media',
    'Instagram Sponsored Post',
    1200.00,
    '2025-01-20',
    NULL,
    'manual',
    '2025-01-20 16:45:00-05'
),
(
    '10000000-0000-0000-0002-000000000006',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Apparel Brand',
    1000.00,
    '2025-01-25',
    NULL,
    'manual',
    '2025-01-25 13:00:00-05'
),
-- Expenses (4)
(
    '10000000-0000-0000-0002-000000000007',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Business',
    'Website Domain',
    -120.00,
    '2025-01-08',
    NULL,
    'manual',
    '2025-01-08 10:30:00-05'
),
(
    '10000000-0000-0000-0002-000000000008',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Business',
    'Logo Design',
    -350.00,
    '2025-01-12',
    NULL,
    'manual',
    '2025-01-12 15:20:00-05'
),
(
    '10000000-0000-0000-0002-000000000009',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Travel',
    'Gas for Appearance',
    -60.00,
    '2025-01-18',
    NULL,
    'manual',
    '2025-01-18 08:45:00-05'
),
(
    '10000000-0000-0000-0002-000000000010',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Equipment',
    'Camera Tripod',
    -220.00,
    '2025-01-22',
    NULL,
    'manual',
    '2025-01-22 12:00:00-05'
),

-- ============================================
-- FEBRUARY TRANSACTIONS (12 total)
-- ============================================
-- Income (6)
(
    '10000000-0000-0000-0002-000000000011',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Collective',
    'February Collective Payment',
    1000.00,
    '2025-02-01',
    '10000000-0000-0000-0001-000000000002',
    'manual',
    '2025-02-01 10:00:00-05'
),
(
    '10000000-0000-0000-0002-000000000012',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Auto Dealership Post 2',
    800.00,
    '2025-02-05',
    '10000000-0000-0000-0001-000000000001',
    'manual',
    '2025-02-05 09:30:00-05'
),
(
    '10000000-0000-0000-0002-000000000013',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Collective',
    'NIL Collective Bonus',
    6000.00,
    '2025-02-08',
    NULL,
    'manual',
    '2025-02-08 14:15:00-05'
),
(
    '10000000-0000-0000-0002-000000000014',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Energy Drink Partnership',
    4200.00,
    '2025-02-12',
    NULL,
    'manual',
    '2025-02-12 11:45:00-05'
),
(
    '10000000-0000-0000-0002-000000000015',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Social Media',
    'TikTok Sponsored Content',
    1800.00,
    '2025-02-15',
    NULL,
    'manual',
    '2025-02-15 16:20:00-05'
),
(
    '10000000-0000-0000-0002-000000000016',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Local Gym Partnership',
    1400.00,
    '2025-02-20',
    NULL,
    'manual',
    '2025-02-20 13:30:00-05'
),
-- Expenses (6)
(
    '10000000-0000-0000-0002-000000000017',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Business',
    'Business Cards',
    -85.00,
    '2025-02-06',
    NULL,
    'manual',
    '2025-02-06 10:15:00-05'
),
(
    '10000000-0000-0000-0002-000000000018',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Business',
    'Accounting Software',
    -180.00,
    '2025-02-10',
    NULL,
    'manual',
    '2025-02-10 09:00:00-05'
),
(
    '10000000-0000-0000-0002-000000000019',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Travel',
    'Hotel for Event',
    -420.00,
    '2025-02-14',
    NULL,
    'manual',
    '2025-02-14 15:30:00-05'
),
(
    '10000000-0000-0000-0002-000000000020',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Travel',
    'Uber to Appearance',
    -45.00,
    '2025-02-18',
    NULL,
    'manual',
    '2025-02-18 19:45:00-05'
),
(
    '10000000-0000-0000-0002-000000000021',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Equipment',
    'Lighting Kit',
    -340.00,
    '2025-02-22',
    NULL,
    'manual',
    '2025-02-22 11:00:00-05'
),
(
    '10000000-0000-0000-0002-000000000022',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Business',
    'Social Media Manager',
    -510.00,
    '2025-02-28',
    NULL,
    'manual',
    '2025-02-28 17:00:00-05'
),

-- ============================================
-- MARCH TRANSACTIONS (13 total)
-- ============================================
-- Income (7)
(
    '10000000-0000-0000-0002-000000000023',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Collective',
    'March Collective Payment',
    1000.00,
    '2025-03-01',
    '10000000-0000-0000-0001-000000000002',
    'manual',
    '2025-03-01 10:00:00-05'
),
(
    '10000000-0000-0000-0002-000000000024',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Auto Dealership Post 3',
    800.00,
    '2025-03-08',
    '10000000-0000-0000-0001-000000000001',
    'manual',
    '2025-03-08 09:45:00-05'
),
(
    '10000000-0000-0000-0002-000000000025',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Collective',
    'Conference Collective Q1',
    5000.00,
    '2025-03-05',
    NULL,
    'manual',
    '2025-03-05 11:30:00-05'
),
(
    '10000000-0000-0000-0002-000000000026',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Clothing Brand Campaign',
    7200.00,
    '2025-03-10',
    NULL,
    'manual',
    '2025-03-10 14:00:00-05'
),
(
    '10000000-0000-0000-0002-000000000027',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Social Media',
    'YouTube Sponsorship',
    2000.00,
    '2025-03-12',
    NULL,
    'manual',
    '2025-03-12 16:30:00-05'
),
(
    '10000000-0000-0000-0002-000000000028',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Tech Company Partnership',
    2530.00,
    '2025-03-15',
    NULL,
    'manual',
    '2025-03-15 10:15:00-05'
),
(
    '10000000-0000-0000-0002-000000000029',
    '10000000-0000-0000-0000-000000000001',
    'income',
    'Brand Deal',
    'Restaurant Appearance',
    1000.00,
    '2025-03-18',
    '10000000-0000-0000-0001-000000000004',
    'manual',
    '2025-03-18 18:00:00-05'
),
-- Expenses (6)
(
    '10000000-0000-0000-0002-000000000030',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Business',
    'Website Maintenance',
    -95.00,
    '2025-03-03',
    NULL,
    'manual',
    '2025-03-03 09:30:00-05'
),
(
    '10000000-0000-0000-0002-000000000031',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Business',
    'Photo Editing Software',
    -240.00,
    '2025-03-07',
    NULL,
    'manual',
    '2025-03-07 13:15:00-05'
),
(
    '10000000-0000-0000-0002-000000000032',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Travel',
    'Airport Parking',
    -45.00,
    '2025-03-11',
    NULL,
    'manual',
    '2025-03-11 07:00:00-05'
),
(
    '10000000-0000-0000-0002-000000000033',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Travel',
    'Flight for Appearance',
    -380.00,
    '2025-03-13',
    NULL,
    'manual',
    '2025-03-13 06:30:00-05'
),
(
    '10000000-0000-0000-0002-000000000034',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Equipment',
    'Ring Light',
    -120.00,
    '2025-03-16',
    NULL,
    'manual',
    '2025-03-16 15:45:00-05'
),
(
    '10000000-0000-0000-0002-000000000035',
    '10000000-0000-0000-0000-000000000001',
    'expense',
    'Business',
    'Marketing Consultation',
    -870.00,
    '2025-03-20',
    NULL,
    'manual',
    '2025-03-20 14:30:00-05'
);

-- ============================================
-- PEOPLE (6 total)
-- ============================================

INSERT INTO people (
    id,
    athlete_id,
    name,
    email,
    phone,
    access_level,
    initials
) VALUES
(
    '10000000-0000-0000-0003-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Sarah Thompson',
    'sarah.thompson@email.com',
    '(555) 123-4567',
    'admin',
    'ST'
),
(
    '10000000-0000-0000-0003-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Mike Reynolds',
    'mike@sportsagency.com',
    '(555) 234-5678',
    'admin',
    'MR'
),
(
    '10000000-0000-0000-0003-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Coach Williams',
    'williams@university.edu',
    '(555) 345-6789',
    'read-only',
    'CW'
),
(
    '10000000-0000-0000-0003-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'Jennifer Martinez',
    'jmartinez@taxfirm.com',
    '(555) 456-7890',
    'read-only',
    'JM'
),
(
    '10000000-0000-0000-0003-000000000005',
    '10000000-0000-0000-0000-000000000001',
    'David Chen',
    'dchen@marketing.com',
    '(555) 567-8901',
    'none',
    'DC'
),
(
    '10000000-0000-0000-0003-000000000006',
    '10000000-0000-0000-0000-000000000001',
    'Lisa Johnson',
    'lisa.j@email.com',
    '(555) 678-9012',
    'none',
    'LJ'
);

-- ============================================
-- PERSON ROLES (6 total)
-- ============================================

INSERT INTO person_roles (
    person_id,
    role
) VALUES
(
    '10000000-0000-0000-0003-000000000001',
    'Family'
),
(
    '10000000-0000-0000-0003-000000000002',
    'Agent'
),
(
    '10000000-0000-0000-0003-000000000003',
    'Coach'
),
(
    '10000000-0000-0000-0003-000000000004',
    'Accountant'
),
(
    '10000000-0000-0000-0003-000000000005',
    'Deal Rep'
),
(
    '10000000-0000-0000-0003-000000000006',
    'Other'
);

-- ============================================
-- UPCOMING TASKS (3 total)
-- ============================================

INSERT INTO upcoming_tasks (
    id,
    athlete_id,
    label,
    due_date,
    task_type,
    is_completed
) VALUES
(
    '10000000-0000-0000-0004-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Social Post #3 Due',
    '2025-03-15',
    'deal',
    false
),
(
    '10000000-0000-0000-0004-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Collective Payment',
    '2025-04-01',
    'deal',
    false
),
(
    '10000000-0000-0000-0004-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Q2 Tax Payment',
    '2025-06-15',
    'tax',
    false
);

-- ============================================
-- QUARTERLY TAX PAYMENTS (4 for 2025)
-- ============================================

INSERT INTO quarterly_tax_payments (
    id,
    athlete_id,
    quarter,
    year,
    quarter_number,
    amount,
    due_date,
    status,
    paid_date
) VALUES
-- Q1 2025 (paid)
(
    '10000000-0000-0000-0005-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Q1 2025',
    2025,
    1,
    4500.00,
    '2025-03-01',
    'paid',
    '2025-02-28'
),
-- Q2 2025 (due)
(
    '10000000-0000-0000-0005-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Q2 2025',
    2025,
    2,
    5200.00,
    '2025-06-15',
    'due',
    NULL
),
-- Q3 2025 (estimated)
(
    '10000000-0000-0000-0005-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Q3 2025',
    2025,
    3,
    5500.00,
    '2025-09-15',
    'estimated',
    NULL
),
-- Q4 2025 (estimated)
(
    '10000000-0000-0000-0005-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'Q4 2025',
    2025,
    4,
    5300.00,
    '2025-12-15',
    'estimated',
    NULL
);

-- ============================================
-- COMPLIANCE
-- ============================================

INSERT INTO compliance (
    athlete_id,
    deals_reported,
    status,
    last_reported_at,
    notes
) VALUES (
    '10000000-0000-0000-0000-000000000001',
    3,
    'all_clear',
    '2025-03-10',
    'All active deals properly disclosed to compliance office'
);

-- ============================================
-- TAX VAULT
-- Note: This will be auto-populated by trigger when income transactions are inserted
-- We'll update the goal_amount after the trigger creates the record
-- ============================================

-- The trigger will create this automatically, so we just update the goal
UPDATE tax_vault
SET goal_amount = 20000.00
WHERE athlete_id = '10000000-0000-0000-0000-000000000001';

-- ============================================
-- VERIFICATION QUERIES
-- NOTE: These queries are commented out because they require functions/views
-- to be installed first via the migration system (npm run db:migrate)
-- After running migrations, you can uncomment and run these manually to verify
-- ============================================

-- Expected results based on mockData.ts:
-- Total Income: $47,230
-- Total Expenses: $3,840
-- Net Cash Flow: $43,390
-- Tax Vault: $13,224 (28% of $47,230)
-- Available: $33,406 ($47,230 - $13,224)

-- Verify record counts
-- SELECT
--     'Athletes' as table_name, COUNT(*) as count FROM athletes WHERE id = '10000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Deals', COUNT(*) FROM deals WHERE athlete_id = '10000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Transactions', COUNT(*) FROM transactions WHERE athlete_id = '10000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'People', COUNT(*) FROM people WHERE id::text LIKE '10000000-0000-0000-0003-%'
-- UNION ALL
-- SELECT 'Person Roles', COUNT(*) FROM person_roles WHERE person_id::text LIKE '10000000-0000-0000-0003-%'
-- UNION ALL
-- SELECT 'Upcoming Tasks', COUNT(*) FROM upcoming_tasks WHERE athlete_id = '10000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Quarterly Payments', COUNT(*) FROM quarterly_tax_payments WHERE athlete_id = '10000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Tax Withholdings', COUNT(*) FROM tax_withholdings WHERE athlete_id = '10000000-0000-0000-0000-000000000001';

-- Expected: Athletes=1, Deals=4, Transactions=35, People=6, Roles=6, Tasks=3, Payments=4, Withholdings=19

-- Verify dashboard KPIs (should match mockData.ts)
-- NOTE: Commented out - requires functions to be installed first via migrations
-- SELECT
--     'KPI Check' as check_type,
--     total_earned,
--     tax_vault,
--     available,
--     tax_rate,
--     ROUND(earned_mom, 2) as earned_mom
-- FROM get_dashboard_kpis('10000000-0000-0000-0000-000000000001');

-- Expected: total_earned=47230, tax_vault=13224.40, available=34005.60, tax_rate=0.28

-- Verify monthly trend (should match mockData.ts)
-- SELECT
--     month,
--     income,
--     expenses,
--     net
-- FROM get_monthly_trend('10000000-0000-0000-0000-000000000001', 3)
-- ORDER BY month_date;

-- Expected:
-- Jan: income=12500, expenses=750, net=11750
-- Feb: income=15200, expenses=1580, net=13620
-- Mar: income=19530, expenses=1750, net=17780

-- Verify income by source (should match mockData.ts)
-- SELECT
--     name,
--     value,
--     color
-- FROM income_by_source_chart
-- WHERE athlete_id = '10000000-0000-0000-0000-000000000001'
-- ORDER BY value DESC;

-- Expected:
-- Brand Deals: 24230
-- Collectives: 18000
-- Social Media: 5000

-- Verify expenses by category (should match mockData.ts)
-- SELECT
--     name,
--     value,
--     color
-- FROM expenses_by_category_chart
-- WHERE athlete_id = '10000000-0000-0000-0000-000000000001'
-- ORDER BY value DESC;

-- Expected:
-- Business: 2450 (120+350+85+180+510+95+240+870)
-- Travel: 950 (60+420+45+45+380)
-- Equipment: 680 (220+340+120)

-- Verify recent activity (last 5 transactions)
-- SELECT
--     type,
--     label,
--     formatted_date,
--     amount
-- FROM recent_activity
-- WHERE athlete_id = '10000000-0000-0000-0000-000000000001'
-- ORDER BY transaction_date DESC, created_at DESC
-- LIMIT 5;

-- Expected: Should show latest March transactions

-- Verify upcoming tasks
-- SELECT
--     label,
--     formatted_date,
--     task_type
-- FROM upcoming_tasks_view
-- WHERE athlete_id = '10000000-0000-0000-0000-000000000001'
-- ORDER BY due_date ASC;

-- Expected: 3 tasks (Social Post, Collective Payment, Q2 Tax)

-- Verify tax withholdings audit trail
-- SELECT
--     COUNT(*) as withholding_count,
--     ROUND(SUM(withholding_amount), 2) as total_withheld,
--     ROUND(SUM(income_amount), 2) as total_income
-- FROM tax_withholdings
-- WHERE athlete_id = '10000000-0000-0000-0000-000000000001';

-- Expected: 19 withholdings (one per income transaction), total_withheld=13224.40, total_income=47230

-- Verify tax vault updated by trigger
-- SELECT
--     ROUND(current_amount, 2) as current_amount,
--     goal_amount,
--     tax_rate,
--     ROUND((current_amount / goal_amount) * 100, 0) as progress_percentage
-- FROM tax_vault
-- WHERE athlete_id = '10000000-0000-0000-0000-000000000001';

-- Expected: current_amount=13224.40, goal=20000, progress=66%

-- Verify waterfall chart data
-- SELECT
--     step,
--     ROUND(amount, 2) as amount,
--     ROUND(cumulative, 2) as cumulative,
--     color
-- FROM get_cashflow_waterfall('10000000-0000-0000-0000-000000000001')
-- ORDER BY step_order;

-- Expected:
-- Income: 47230.00, cumulative: 47230.00
-- Tax Vault: -13224.40, cumulative: 34005.60
-- Expenses: -4080.00, cumulative: 29925.60
-- Net Cash: 29925.60, cumulative: 29925.60

-- Verify page functions return complete JSON
-- SELECT jsonb_pretty(fn_home_page('10000000-0000-0000-0000-000000000001'));

-- Should return complete home page JSON with athlete, kpis, recentActivity, upcoming, compliance

-- Verify deal summary
-- SELECT
--     total_deals,
--     active_deals,
--     pending_deals,
--     completed_deals
-- FROM deal_summary
-- WHERE athlete_id = '10000000-0000-0000-0000-000000000001';

-- Expected: total=4, active=2, pending=1, completed=0

-- Verify people/team view
-- SELECT
--     name,
--     access_level,
--     initials,
--     roles
-- FROM athlete_team
-- WHERE athlete_id = '10000000-0000-0000-0000-000000000001'
-- ORDER BY
--     CASE access_level
--         WHEN 'admin' THEN 1
--         WHEN 'read-only' THEN 2
--         ELSE 3
--     END,
--     name;

-- Expected: 6 people with correct access levels and roles

-- Summary check: Compare totals to mockData.ts
-- SELECT
--     'Summary Check' as check_type,
--     (SELECT SUM(amount) FROM transactions WHERE athlete_id = '10000000-0000-0000-0000-000000000001' AND type = 'income') as total_income,
--     (SELECT SUM(ABS(amount)) FROM transactions WHERE athlete_id = '10000000-0000-0000-0000-000000000001' AND type = 'expense') as total_expenses,
--     (SELECT current_amount FROM tax_vault WHERE athlete_id = '10000000-0000-0000-0000-000000000001') as tax_vault,
--     (SELECT COUNT(*) FROM deals WHERE athlete_id = '10000000-0000-0000-0000-000000000001' AND status = 'active') as active_deals;

-- Expected: income=47230, expenses=3840 (CORRECTED), tax_vault=13224.40, active_deals=2

-- ============================================
-- END OF SEED SCRIPT
-- ============================================
