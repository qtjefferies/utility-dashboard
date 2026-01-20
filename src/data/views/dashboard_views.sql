-- ============================================
-- ENHANCED DATABASE VIEWS
-- Description: Views for common dashboard queries and chart data
-- ============================================

-- View: recent_activity
-- Description: Returns the most recent transactions formatted for dashboard display
-- Columns: id, athlete_id, type, label, description, formatted_date, transaction_date, amount, category, created_at
CREATE OR REPLACE VIEW recent_activity AS
SELECT
    t.id,
    t.athlete_id,
    t.type,
    CASE
        WHEN t.type = 'tax_transfer' THEN 'Tax Vault Auto-Transfer'
        ELSE t.description
    END as label,
    t.description,
    TO_CHAR(t.transaction_date, 'Mon DD') as formatted_date,
    t.transaction_date,
    t.amount,
    t.category,
    t.created_at
FROM transactions t
ORDER BY t.transaction_date DESC, t.created_at DESC;

-- View: upcoming_tasks_view
-- Description: Returns non-completed upcoming tasks with formatted dates
-- Columns: id, athlete_id, label, formatted_date, due_date, task_type, related_deal_id, related_deal_name
CREATE OR REPLACE VIEW upcoming_tasks_view AS
SELECT
    ut.id,
    ut.athlete_id,
    ut.label,
    TO_CHAR(ut.due_date, 'Mon DD') as formatted_date,
    ut.due_date,
    ut.task_type,
    ut.related_deal_id,
    d.deal_name as related_deal_name
FROM upcoming_tasks ut
LEFT JOIN deals d ON d.id = ut.related_deal_id
WHERE ut.is_completed = FALSE
  AND ut.due_date >= CURRENT_DATE
ORDER BY ut.due_date ASC;

-- View: dashboard_summary
-- Description: Comprehensive athlete summary combining profile, deals, and financial data
-- Columns: All athlete fields + deal counts + financial totals + compliance status
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT
    a.id as athlete_id,
    a.first_name,
    a.full_name,
    a.sport,
    a.year,
    a.initials,
    a.email,
    a.phone,
    a.profile_image_url,
    -- Deal summary
    COALESCE(ds.total_deals, 0) as total_deals,
    COALESCE(ds.active_deals, 0) as active_deals,
    COALESCE(ds.pending_deals, 0) as pending_deals,
    COALESCE(ds.completed_deals, 0) as completed_deals,
    -- Financial summary (all time)
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE athlete_id = a.id AND type = 'income') as total_earned,
    (SELECT COALESCE(SUM(ABS(amount)), 0) FROM transactions WHERE athlete_id = a.id AND type = 'expense') as total_expenses,
    -- Tax vault
    COALESCE(tv.current_amount, 0) as tax_vault_current,
    COALESCE(tv.goal_amount, 0) as tax_vault_goal,
    COALESCE(tv.tax_rate, 0.28) as tax_rate,
    -- Compliance
    COALESCE(c.deals_reported, 0) as compliance_deals_reported,
    COALESCE(c.status, 'all_clear') as compliance_status,
    -- Timestamps
    a.created_at,
    a.last_login_at
FROM athletes a
LEFT JOIN deal_summary ds ON ds.athlete_id = a.id
LEFT JOIN tax_vault tv ON tv.athlete_id = a.id
LEFT JOIN compliance c ON c.athlete_id = a.id
WHERE a.is_active = TRUE;

-- View: income_by_source_chart
-- Description: Income aggregated by source with color codes for charts
-- Columns: athlete_id, name, value, color
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
FROM transactions
WHERE type = 'income'
GROUP BY athlete_id, category
ORDER BY value DESC;

-- View: expenses_by_category_chart
-- Description: Expenses aggregated by category with color codes for charts
-- Columns: athlete_id, name, value, color
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
FROM transactions
WHERE type = 'expense'
GROUP BY athlete_id, category
ORDER BY value DESC;

-- View: monthly_income_trend
-- Description: Monthly income aggregated over time for trend charts
-- Columns: athlete_id, month_date, month, year, income, transaction_count
CREATE OR REPLACE VIEW monthly_income_trend AS
SELECT
    athlete_id,
    DATE_TRUNC('month', transaction_date)::DATE as month_date,
    TO_CHAR(transaction_date, 'Mon') as month,
    EXTRACT(YEAR FROM transaction_date)::INTEGER as year,
    SUM(amount) as income,
    COUNT(*) as transaction_count
FROM transactions
WHERE type = 'income'
GROUP BY athlete_id, DATE_TRUNC('month', transaction_date), TO_CHAR(transaction_date, 'Mon'), EXTRACT(YEAR FROM transaction_date)
ORDER BY month_date DESC;

-- View: monthly_expense_trend
-- Description: Monthly expenses aggregated over time for trend charts
-- Columns: athlete_id, month_date, month, year, expenses, transaction_count
CREATE OR REPLACE VIEW monthly_expense_trend AS
SELECT
    athlete_id,
    DATE_TRUNC('month', transaction_date)::DATE as month_date,
    TO_CHAR(transaction_date, 'Mon') as month,
    EXTRACT(YEAR FROM transaction_date)::INTEGER as year,
    SUM(ABS(amount)) as expenses,
    COUNT(*) as transaction_count
FROM transactions
WHERE type = 'expense'
GROUP BY athlete_id, DATE_TRUNC('month', transaction_date), TO_CHAR(transaction_date, 'Mon'), EXTRACT(YEAR FROM transaction_date)
ORDER BY month_date DESC;

-- View: deal_details_with_totals
-- Description: Deals with calculated totals based on amount_type
-- Columns: All deal fields + estimated_total, paid_to_date
CREATE OR REPLACE VIEW deal_details_with_totals AS
SELECT
    d.*,
    CASE
        WHEN d.amount_type = 'one-time' THEN d.amount
        WHEN d.amount_type = 'monthly' THEN d.amount * 12  -- Annualized
        WHEN d.amount_type = 'quarterly' THEN d.amount * 4  -- Annualized
        WHEN d.amount_type = 'yearly' THEN d.amount
        ELSE d.amount
    END as estimated_annual_value,
    (
        SELECT COALESCE(SUM(t.amount), 0)
        FROM transactions t
        WHERE t.deal_id = d.id
          AND t.type = 'income'
    ) as paid_to_date
FROM deals d;

-- View: athlete_team
-- Description: People associated with athletes with aggregated role information
-- Columns: athlete_id, person details, roles array, role count
CREATE OR REPLACE VIEW athlete_team AS
SELECT
    p.athlete_id,
    p.id as person_id,
    p.name,
    p.email,
    p.phone,
    p.access_level,
    p.initials,
    ARRAY_AGG(pr.role ORDER BY pr.role) as roles,
    COUNT(pr.role) as role_count
FROM people p
LEFT JOIN person_roles pr ON pr.person_id = p.id
GROUP BY p.athlete_id, p.id, p.name, p.email, p.phone, p.access_level, p.initials;

-- View: quarterly_tax_status
-- Description: Quarterly tax payments with status indicators and time remaining
-- Columns: All quarterly_tax_payments fields + days_until_due, is_overdue
CREATE OR REPLACE VIEW quarterly_tax_status AS
SELECT
    qtp.*,
    (qtp.due_date - CURRENT_DATE) as days_until_due,
    CASE
        WHEN qtp.status = 'paid' THEN FALSE
        WHEN qtp.due_date < CURRENT_DATE THEN TRUE
        ELSE FALSE
    END as is_overdue
FROM quarterly_tax_payments qtp
ORDER BY qtp.year DESC, qtp.quarter_number DESC;

-- View: compliance_status_with_details
-- Description: Compliance information with additional context
-- Columns: All compliance fields + total_deals, unreported_deals
CREATE OR REPLACE VIEW compliance_status_with_details AS
SELECT
    c.*,
    (
        SELECT COUNT(*)
        FROM deals d
        WHERE d.athlete_id = c.athlete_id
          AND d.status IN ('active', 'completed')
    ) as total_deals,
    (
        SELECT COUNT(*)
        FROM deals d
        WHERE d.athlete_id = c.athlete_id
          AND d.status IN ('active', 'completed')
    ) - c.deals_reported as unreported_deals
FROM compliance c;

-- View: cash_flow_summary_ytd
-- Description: Year-to-date cash flow summary by athlete
-- Columns: athlete_id, year, total_income, total_expenses, net_cash_flow, transaction_count
CREATE OR REPLACE VIEW cash_flow_summary_ytd AS
SELECT
    athlete_id,
    EXTRACT(YEAR FROM transaction_date)::INTEGER as year,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END) as total_expenses,
    SUM(CASE WHEN type = 'income' THEN amount ELSE amount END) as net_cash_flow,
    COUNT(*) as transaction_count
FROM transactions
WHERE EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY athlete_id, EXTRACT(YEAR FROM transaction_date);

-- ============================================
-- EXAMPLE QUERIES:
-- ============================================

-- Get recent activity for athlete (last 5):
-- SELECT * FROM recent_activity WHERE athlete_id = '00000000-0000-0000-0000-000000000001' LIMIT 5;

-- Get upcoming tasks for athlete:
-- SELECT * FROM upcoming_tasks_view WHERE athlete_id = '00000000-0000-0000-0000-000000000001' LIMIT 3;

-- Get complete dashboard summary:
-- SELECT * FROM dashboard_summary WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Get income by source for charts:
-- SELECT * FROM income_by_source_chart WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Get expenses by category for charts:
-- SELECT * FROM expenses_by_category_chart WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Get monthly income trend (last 12 months):
-- SELECT * FROM monthly_income_trend WHERE athlete_id = '00000000-0000-0000-0000-000000000001' LIMIT 12;

-- Get deal details with totals:
-- SELECT * FROM deal_details_with_totals WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Get athlete's team:
-- SELECT * FROM athlete_team WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Get quarterly tax status:
-- SELECT * FROM quarterly_tax_status WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Get compliance status with details:
-- SELECT * FROM compliance_status_with_details WHERE athlete_id = '00000000-0000-0000-0000-000000000001';

-- Get year-to-date cash flow:
-- SELECT * FROM cash_flow_summary_ytd WHERE athlete_id = '00000000-0000-0000-0000-000000000001';
