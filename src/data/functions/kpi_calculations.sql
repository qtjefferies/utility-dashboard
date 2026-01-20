-- ============================================
-- KPI CALCULATION FUNCTIONS
-- Description: PostgreSQL functions for calculating dashboard KPIs
-- ============================================

-- Function: get_dashboard_kpis
-- Description: Returns all dashboard KPIs for a specific athlete
-- Parameters: p_athlete_id (UUID) - The athlete's ID
-- Returns: TABLE with total_earned, tax_vault, available, tax_rate, earned_mom
CREATE OR REPLACE FUNCTION get_dashboard_kpis(p_athlete_id UUID)
RETURNS TABLE (
    total_earned DECIMAL(12, 2),
    tax_vault DECIMAL(12, 2),
    available DECIMAL(12, 2),
    tax_rate DECIMAL(5, 4),
    earned_mom DECIMAL(5, 4)
) AS $$
BEGIN
    RETURN QUERY
    WITH current_month AS (
        SELECT
            COALESCE(SUM(amount), 0) as month_income
        FROM transactions
        WHERE athlete_id = p_athlete_id
          AND type = 'income'
          AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
    ),
    last_month AS (
        SELECT
            COALESCE(SUM(amount), 0) as month_income
        FROM transactions
        WHERE athlete_id = p_athlete_id
          AND type = 'income'
          AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    ),
    totals AS (
        SELECT
            COALESCE(SUM(amount), 0) as total_income
        FROM transactions
        WHERE athlete_id = p_athlete_id
          AND type = 'income'
    )
    SELECT
        t.total_income as total_earned,
        COALESCE(tv.current_amount, 0) as tax_vault,
        t.total_income - COALESCE(tv.current_amount, 0) as available,
        COALESCE(tv.tax_rate, 0.28) as tax_rate,
        CASE
            WHEN lm.month_income = 0 THEN 0
            ELSE (cm.month_income - lm.month_income) / NULLIF(lm.month_income, 0)
        END as earned_mom
    FROM totals t
    CROSS JOIN current_month cm
    CROSS JOIN last_month lm
    LEFT JOIN tax_vault tv ON tv.athlete_id = p_athlete_id;
END;
$$ LANGUAGE plpgsql;

-- Function: get_monthly_trend
-- Description: Returns monthly aggregated income, expenses, and net for the last N months
-- Parameters:
--   p_athlete_id (UUID) - The athlete's ID
--   p_months (INTEGER) - Number of months to return (default: 3)
-- Returns: TABLE with month, month_date, income, expenses, net
CREATE OR REPLACE FUNCTION get_monthly_trend(
    p_athlete_id UUID,
    p_months INTEGER DEFAULT 3
)
RETURNS TABLE (
    month TEXT,
    month_date DATE,
    income DECIMAL(12, 2),
    expenses DECIMAL(12, 2),
    net DECIMAL(12, 2)
) AS $$
BEGIN
    RETURN QUERY
    WITH month_series AS (
        SELECT
            generate_series(
                DATE_TRUNC('month', CURRENT_DATE - ((p_months - 1) || ' months')::INTERVAL),
                DATE_TRUNC('month', CURRENT_DATE),
                '1 month'::INTERVAL
            )::DATE as month_date
    ),
    monthly_data AS (
        SELECT
            DATE_TRUNC('month', transaction_date)::DATE as month_date,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
            SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END) as expenses
        FROM transactions
        WHERE athlete_id = p_athlete_id
        GROUP BY DATE_TRUNC('month', transaction_date)::DATE
    )
    SELECT
        TO_CHAR(ms.month_date, 'Mon') as month,
        ms.month_date,
        COALESCE(md.income, 0) as income,
        COALESCE(md.expenses, 0) as expenses,
        COALESCE(md.income, 0) - COALESCE(md.expenses, 0) as net
    FROM month_series ms
    LEFT JOIN monthly_data md ON ms.month_date = md.month_date
    ORDER BY ms.month_date;
END;
$$ LANGUAGE plpgsql;

-- Function: get_transaction_summary
-- Description: Returns filtered transaction summary with income, expenses, and net cash flow
-- Parameters:
--   p_athlete_id (UUID) - The athlete's ID
--   p_start_date (DATE) - Optional start date filter
--   p_end_date (DATE) - Optional end date filter
--   p_transaction_type (transaction_type) - Optional transaction type filter
--   p_categories (TEXT[]) - Optional array of categories to filter by
-- Returns: TABLE with total_income, total_expenses, net_cash_flow, transaction_count
CREATE OR REPLACE FUNCTION get_transaction_summary(
    p_athlete_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_transaction_type transaction_type DEFAULT NULL,
    p_categories TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    total_income DECIMAL(12, 2),
    total_expenses DECIMAL(12, 2),
    net_cash_flow DECIMAL(12, 2),
    transaction_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE amount END), 0) as net_cash_flow,
        COUNT(*)::INTEGER as transaction_count
    FROM transactions
    WHERE athlete_id = p_athlete_id
      AND (p_start_date IS NULL OR transaction_date >= p_start_date)
      AND (p_end_date IS NULL OR transaction_date <= p_end_date)
      AND (p_transaction_type IS NULL OR type = p_transaction_type)
      AND (p_categories IS NULL OR category = ANY(p_categories));
END;
$$ LANGUAGE plpgsql;

-- Function: get_projected_annual_income
-- Description: Projects annual income based on year-to-date earnings
-- Parameters: p_athlete_id (UUID) - The athlete's ID
-- Returns: DECIMAL projected annual income
CREATE OR REPLACE FUNCTION get_projected_annual_income(p_athlete_id UUID)
RETURNS DECIMAL(12, 2) AS $$
DECLARE
    v_months_elapsed INTEGER;
    v_total_income DECIMAL(12, 2);
    v_projection DECIMAL(12, 2);
BEGIN
    -- Get number of months elapsed this year
    v_months_elapsed := EXTRACT(MONTH FROM CURRENT_DATE);

    -- Get total income this year
    SELECT COALESCE(SUM(amount), 0) INTO v_total_income
    FROM transactions
    WHERE athlete_id = p_athlete_id
      AND type = 'income'
      AND EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE);

    -- Project to full year
    IF v_months_elapsed > 0 THEN
        v_projection := (v_total_income / v_months_elapsed) * 12;
    ELSE
        v_projection := 0;
    END IF;

    RETURN v_projection;
END;
$$ LANGUAGE plpgsql;

-- Function: get_filtered_transactions
-- Description: Returns transactions with optional filters applied
-- Parameters:
--   p_athlete_id (UUID) - The athlete's ID
--   p_start_date (DATE) - Optional start date filter
--   p_end_date (DATE) - Optional end date filter
--   p_transaction_type (transaction_type) - Optional transaction type filter
--   p_categories (TEXT[]) - Optional array of categories to filter by
--   p_limit (INTEGER) - Optional limit on number of results
-- Returns: TABLE with transaction details
CREATE OR REPLACE FUNCTION get_filtered_transactions(
    p_athlete_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_transaction_type transaction_type DEFAULT NULL,
    p_categories TEXT[] DEFAULT NULL,
    p_limit INTEGER DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    type transaction_type,
    category TEXT,
    description TEXT,
    amount DECIMAL(12, 2),
    transaction_date DATE,
    formatted_date TEXT,
    month TEXT,
    deal_id UUID,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.type,
        t.category,
        t.description,
        t.amount,
        t.transaction_date,
        TO_CHAR(t.transaction_date, 'Mon DD') as formatted_date,
        TO_CHAR(t.transaction_date, 'Mon') as month,
        t.deal_id,
        t.created_at
    FROM transactions t
    WHERE t.athlete_id = p_athlete_id
      AND (p_start_date IS NULL OR t.transaction_date >= p_start_date)
      AND (p_end_date IS NULL OR t.transaction_date <= p_end_date)
      AND (p_transaction_type IS NULL OR t.type = p_transaction_type)
      AND (p_categories IS NULL OR t.category = ANY(p_categories))
    ORDER BY t.transaction_date DESC, t.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function: get_expense_drilldown
-- Description: Returns individual expenses for a specific category
-- Parameters:
--   p_athlete_id (UUID) - The athlete's ID
--   p_category (TEXT) - The expense category to drill into
--   p_start_date (DATE) - Optional start date filter
--   p_end_date (DATE) - Optional end date filter
-- Returns: TABLE with expense details
CREATE OR REPLACE FUNCTION get_expense_drilldown(
    p_athlete_id UUID,
    p_category TEXT,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    description TEXT,
    amount DECIMAL(12, 2),
    transaction_date DATE,
    formatted_date TEXT,
    receipt_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.description,
        ABS(t.amount) as amount,
        t.transaction_date,
        TO_CHAR(t.transaction_date, 'Mon DD, YYYY') as formatted_date,
        t.receipt_url
    FROM transactions t
    WHERE t.athlete_id = p_athlete_id
      AND t.type = 'expense'
      AND t.category = p_category
      AND (p_start_date IS NULL OR t.transaction_date >= p_start_date)
      AND (p_end_date IS NULL OR t.transaction_date <= p_end_date)
    ORDER BY t.transaction_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function: calculate_tax_vault_progress
-- Description: Calculates tax vault progress percentage and projection
-- Parameters: p_athlete_id (UUID) - The athlete's ID
-- Returns: TABLE with current_amount, goal_amount, progress_percentage, projected_total
CREATE OR REPLACE FUNCTION calculate_tax_vault_progress(p_athlete_id UUID)
RETURNS TABLE (
    current_amount DECIMAL(12, 2),
    goal_amount DECIMAL(12, 2),
    progress_percentage INTEGER,
    projected_total DECIMAL(12, 2),
    on_track BOOLEAN
) AS $$
DECLARE
    v_projected_income DECIMAL(12, 2);
    v_tax_rate DECIMAL(5, 4);
BEGIN
    -- Get projected annual income
    SELECT get_projected_annual_income(p_athlete_id) INTO v_projected_income;

    -- Get tax rate
    SELECT COALESCE(tax_rate, 0.28) INTO v_tax_rate
    FROM tax_vault
    WHERE athlete_id = p_athlete_id;

    RETURN QUERY
    SELECT
        tv.current_amount,
        tv.goal_amount,
        CASE
            WHEN tv.goal_amount > 0 THEN ROUND((tv.current_amount / tv.goal_amount * 100))::INTEGER
            ELSE 0
        END as progress_percentage,
        ROUND(v_projected_income * v_tax_rate, 2) as projected_total,
        tv.current_amount >= (v_projected_income * v_tax_rate * 0.9) as on_track
    FROM tax_vault tv
    WHERE tv.athlete_id = p_athlete_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- EXAMPLE USAGE:
-- ============================================

-- Get dashboard KPIs:
-- SELECT * FROM get_dashboard_kpis('00000000-0000-0000-0000-000000000001');

-- Get monthly trend (last 3 months):
-- SELECT * FROM get_monthly_trend('00000000-0000-0000-0000-000000000001', 3);

-- Get transaction summary (all time):
-- SELECT * FROM get_transaction_summary('00000000-0000-0000-0000-000000000001');

-- Get transaction summary (filtered):
-- SELECT * FROM get_transaction_summary(
--   '00000000-0000-0000-0000-000000000001',
--   '2025-01-01',
--   '2025-01-31',
--   'income',
--   ARRAY['Brand Deal', 'Collective']
-- );

-- Get projected annual income:
-- SELECT get_projected_annual_income('00000000-0000-0000-0000-000000000001');

-- Get recent transactions (last 10):
-- SELECT * FROM get_filtered_transactions('00000000-0000-0000-0000-000000000001', NULL, NULL, NULL, NULL, 10);

-- Get expense drilldown for Business category:
-- SELECT * FROM get_expense_drilldown('00000000-0000-0000-0000-000000000001', 'Business');

-- Get tax vault progress:
-- SELECT * FROM calculate_tax_vault_progress('00000000-0000-0000-0000-000000000001');
