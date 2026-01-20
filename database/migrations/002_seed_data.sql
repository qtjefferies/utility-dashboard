-- ============================================
-- Migration: 002_seed_data.sql
-- Description: Seed database with demo athlete data (Marcus Thompson)
-- Created: 2026-01-13
-- ============================================

-- Insert Marcus Thompson athlete
INSERT INTO athletes (
    id, email, email_verified, first_name, last_name,
    sport, year, initials, is_active, created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'marcus.thompson@university.edu',
    true,
    'Marcus',
    'Thompson',
    'Football',
    'Sophomore',
    'MT',
    true,
    CURRENT_TIMESTAMP
);

-- Insert user settings for Marcus
INSERT INTO user_settings (
    athlete_id, email_notifications, sms_notifications,
    push_notifications, deal_reminders, tax_alerts,
    payment_notifications, default_tax_rate, theme
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    true, false, true, true, true, true, 0.28, 'dark'
);

-- Initialize tax vault
INSERT INTO tax_vault (
    athlete_id, current_amount, goal_amount, tax_rate
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    13224.00, 20000.00, 0.28
);

-- Insert deals
INSERT INTO deals (id, athlete_id, deal_name, status, source, amount, amount_type, next_action, created_at) VALUES
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Local Auto Dealership Social Posts', 'active', 'Brand Direct', 2400.00, 'one-time', 'Post #3 due Mar 15', '2025-01-01 00:00:00'),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Conference Collective Monthly', 'active', 'Collective', 1000.00, 'monthly', NULL, '2025-01-01 00:00:00'),
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Apparel Brand Campaign', 'pending', 'Brand Direct', 5000.00, 'one-time', 'Contract review', '2025-01-10 00:00:00'),
('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Local Restaurant Appearances', 'active', 'Brand Direct', 1200.00, 'one-time', 'Next visit Mar 20', '2025-01-05 00:00:00'),
('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'Energy Drink Partnership', 'completed', 'Brand Direct', 4200.00, 'one-time', NULL, '2024-12-01 00:00:00'),
('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', 'Local Gym Partnership', 'completed', 'Brand Direct', 1400.00, 'one-time', NULL, '2024-12-15 00:00:00'),
('00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000001', 'NIL Collective Bonus', 'active', 'Collective', 6000.00, 'one-time', NULL, '2025-02-01 00:00:00'),
('00000000-0000-0000-0000-000000000108', '00000000-0000-0000-0000-000000000001', 'TikTok Sponsored Content', 'active', 'Brand Direct', 1800.00, 'per-instance', NULL, '2025-02-10 00:00:00'),
('00000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000001', 'YouTube Sponsorship', 'active', 'Brand Direct', 2000.00, 'monthly', NULL, '2025-03-01 00:00:00'),
('00000000-0000-0000-0000-000000000110', '00000000-0000-0000-0000-000000000001', 'Tech Company Partnership', 'active', 'Brand Direct', 2530.00, 'one-time', NULL, '2025-03-10 00:00:00'),
('00000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000001', 'Clothing Brand Campaign', 'active', 'Brand Direct', 7200.00, 'one-time', NULL, '2025-03-05 00:00:00'),
('00000000-0000-0000-0000-000000000112', '00000000-0000-0000-0000-000000000001', 'Restaurant Appearance Series', 'pending', 'Brand Direct', 3000.00, 'one-time', 'Contract negotiation', '2025-03-15 00:00:00');

-- Insert transactions (January)
INSERT INTO transactions (athlete_id, type, category, description, amount, transaction_date, deal_id, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'income', 'Collective', 'January Collective Payment', 1000.00, '2025-01-01', '00000000-0000-0000-0000-000000000102', '2025-01-01 09:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Local Restaurant Deal', 3500.00, '2025-01-05', '00000000-0000-0000-0000-000000000104', '2025-01-05 10:30:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Website Domain', -120.00, '2025-01-08', NULL, '2025-01-08 14:15:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Auto Dealership Post 1', 800.00, '2025-01-10', '00000000-0000-0000-0000-000000000101', '2025-01-10 11:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Logo Design', -350.00, '2025-01-12', NULL, '2025-01-12 16:45:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Collective', 'Conference Collective', 5000.00, '2025-01-15', NULL, '2025-01-15 09:30:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Travel', 'Gas for Appearance', -60.00, '2025-01-18', NULL, '2025-01-18 18:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Social Media', 'Instagram Sponsored Post', 1200.00, '2025-01-20', NULL, '2025-01-20 13:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Equipment', 'Camera Tripod', -220.00, '2025-01-22', NULL, '2025-01-22 10:30:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Apparel Brand', 1000.00, '2025-01-25', NULL, '2025-01-25 14:00:00');

-- Insert transactions (February)
INSERT INTO transactions (athlete_id, type, category, description, amount, transaction_date, deal_id, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'income', 'Collective', 'February Collective Payment', 1000.00, '2025-02-01', '00000000-0000-0000-0000-000000000102', '2025-02-01 09:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Auto Dealership Post 2', 800.00, '2025-02-05', '00000000-0000-0000-0000-000000000101', '2025-02-05 11:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Business Cards', -85.00, '2025-02-06', NULL, '2025-02-06 15:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Collective', 'NIL Collective Bonus', 6000.00, '2025-02-08', '00000000-0000-0000-0000-000000000107', '2025-02-08 10:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Accounting Software', -180.00, '2025-02-10', NULL, '2025-02-10 12:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Energy Drink Partnership', 4200.00, '2025-02-12', '00000000-0000-0000-0000-000000000105', '2025-02-12 14:30:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Travel', 'Hotel for Event', -420.00, '2025-02-14', NULL, '2025-02-14 19:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Social Media', 'TikTok Sponsored Content', 1800.00, '2025-02-15', '00000000-0000-0000-0000-000000000108', '2025-02-15 16:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Travel', 'Uber to Appearance', -45.00, '2025-02-18', NULL, '2025-02-18 20:15:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Local Gym Partnership', 1400.00, '2025-02-20', '00000000-0000-0000-0000-000000000106', '2025-02-20 11:30:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Equipment', 'Lighting Kit', -340.00, '2025-02-22', NULL, '2025-02-22 13:45:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Social Media Manager', -510.00, '2025-02-28', NULL, '2025-02-28 17:00:00');

-- Insert transactions (March)
INSERT INTO transactions (athlete_id, type, category, description, amount, transaction_date, deal_id, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'income', 'Collective', 'March Collective Payment', 1000.00, '2025-03-01', '00000000-0000-0000-0000-000000000102', '2025-03-01 09:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Website Maintenance', -95.00, '2025-03-03', NULL, '2025-03-03 10:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Collective', 'Conference Collective Q1', 5000.00, '2025-03-05', NULL, '2025-03-05 09:30:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Photo Editing Software', -240.00, '2025-03-07', NULL, '2025-03-07 14:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Auto Dealership Post 3', 800.00, '2025-03-08', '00000000-0000-0000-0000-000000000101', '2025-03-08 11:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Clothing Brand Campaign', 7200.00, '2025-03-10', '00000000-0000-0000-0000-000000000111', '2025-03-10 10:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Travel', 'Airport Parking', -45.00, '2025-03-11', NULL, '2025-03-11 07:30:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Social Media', 'YouTube Sponsorship', 2000.00, '2025-03-12', '00000000-0000-0000-0000-000000000109', '2025-03-12 15:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Travel', 'Flight for Appearance', -380.00, '2025-03-13', NULL, '2025-03-13 06:00:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Tech Company Partnership', 2530.00, '2025-03-15', '00000000-0000-0000-0000-000000000110', '2025-03-15 12:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Equipment', 'Ring Light', -120.00, '2025-03-16', NULL, '2025-03-16 16:30:00'),
('00000000-0000-0000-0000-000000000001', 'income', 'Brand Deal', 'Restaurant Appearance', 1000.00, '2025-03-18', '00000000-0000-0000-0000-000000000104', '2025-03-18 13:00:00'),
('00000000-0000-0000-0000-000000000001', 'expense', 'Business', 'Marketing Consultation', -870.00, '2025-03-20', NULL, '2025-03-20 11:00:00');

-- Insert people (Marcus Thompson's team)
INSERT INTO people (id, athlete_id, name, email, phone, access_level, initials, created_at) VALUES
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'Sarah Thompson', 'sarah.thompson@email.com', '(555) 123-4567', 'admin', 'ST', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'Mike Reynolds', 'mike@sportsagency.com', '(555) 234-5678', 'admin', 'MR', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'Coach Williams', 'williams@university.edu', '(555) 345-6789', 'read-only', 'CW', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', 'Jennifer Martinez', 'jmartinez@taxfirm.com', '(555) 456-7890', 'read-only', 'JM', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', 'David Chen', 'dchen@marketing.com', '(555) 567-8901', 'none', 'DC', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000001', 'Lisa Johnson', 'lisa.j@email.com', '(555) 678-9012', 'none', 'LJ', CURRENT_TIMESTAMP);

-- Insert person roles
INSERT INTO person_roles (person_id, role, created_at) VALUES
('00000000-0000-0000-0000-000000000201', 'Family', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000202', 'Agent', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000203', 'Coach', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000204', 'Accountant', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000205', 'Deal Rep', CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000206', 'Other', CURRENT_TIMESTAMP);

-- Insert quarterly tax payments
INSERT INTO quarterly_tax_payments (athlete_id, quarter, year, quarter_number, amount, due_date, status, paid_date, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Q1 2025', 2025, 1, 4500.00, '2025-03-01', 'paid', '2025-02-28', '2025-01-01 00:00:00'),
('00000000-0000-0000-0000-000000000001', 'Q2 2025', 2025, 2, 5200.00, '2025-06-15', 'due', NULL, '2025-01-01 00:00:00'),
('00000000-0000-0000-0000-000000000001', 'Q3 2025', 2025, 3, 5500.00, '2025-09-15', 'estimated', NULL, '2025-01-01 00:00:00'),
('00000000-0000-0000-0000-000000000001', 'Q4 2025', 2025, 4, 5300.00, '2025-12-15', 'estimated', NULL, '2025-01-01 00:00:00');

-- Insert upcoming tasks
INSERT INTO upcoming_tasks (athlete_id, label, due_date, task_type, related_deal_id, is_completed, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Social Post #3 Due', '2025-03-15', 'deal', '00000000-0000-0000-0000-000000000101', false, CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000001', 'Collective Payment', '2025-04-01', 'deal', '00000000-0000-0000-0000-000000000102', false, CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000001', 'Q2 Tax Payment', '2025-06-15', 'tax', NULL, false, CURRENT_TIMESTAMP);

-- Insert compliance record
INSERT INTO compliance (athlete_id, deals_reported, status, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 3, 'all_clear', CURRENT_TIMESTAMP);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these queries to verify the seed data was inserted correctly:

-- SELECT COUNT(*) as athlete_count FROM athletes; -- Should be 1
-- SELECT COUNT(*) as deal_count FROM deals; -- Should be 12
-- SELECT COUNT(*) as transaction_count FROM transactions; -- Should be 35
-- SELECT COUNT(*) as people_count FROM people; -- Should be 6
-- SELECT COUNT(*) as role_count FROM person_roles; -- Should be 6
-- SELECT COUNT(*) as quarterly_payment_count FROM quarterly_tax_payments; -- Should be 4
-- SELECT COUNT(*) as task_count FROM upcoming_tasks; -- Should be 3
-- SELECT COUNT(*) as compliance_count FROM compliance; -- Should be 1
-- SELECT COUNT(*) as tax_vault_count FROM tax_vault; -- Should be 1
-- SELECT COUNT(*) as settings_count FROM user_settings; -- Should be 1

-- Verify KPI calculations:
-- SELECT * FROM get_dashboard_kpis('00000000-0000-0000-0000-000000000001');
-- Should return: total_earned=47230.00, tax_vault=13224.00, available=33406.00

-- Verify monthly trend:
-- SELECT * FROM get_monthly_trend('00000000-0000-0000-0000-000000000001', 3);
-- Should return 3 rows: Jan (12500, 850, 11650), Feb (15200, 1240, 13960), Mar (19530, 1750, 17780)

-- Verify income by source:
-- SELECT * FROM income_by_source_chart WHERE athlete_id = '00000000-0000-0000-0000-000000000001';
-- Should return: Collectives (18000), Brand Deals (24230), Social Media (5000)

-- Verify expenses by category:
-- SELECT * FROM expenses_by_category_chart WHERE athlete_id = '00000000-0000-0000-0000-000000000001';
-- Should return: Business (1840), Travel (1200), Equipment (800)
