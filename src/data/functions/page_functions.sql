-- ============================================
-- PAGE-LEVEL FUNCTIONS
-- Description: Functions that return complete page data as JSON
-- Usage: Call one function to get all data needed for a page
-- ============================================

-- ============================================
-- WATERFALL CHART FUNCTION
-- ============================================

-- Function: get_cashflow_waterfall
-- Description: Returns waterfall chart data (income → taxes → expenses → net)
-- Parameters:
--   p_athlete_id (UUID) - The athlete's ID
--   p_start_date (DATE, optional) - Start date filter
--   p_end_date (DATE, optional) - End date filter
-- Returns: TABLE with waterfall steps
CREATE OR REPLACE FUNCTION get_cashflow_waterfall(
    p_athlete_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    step TEXT,
    amount DECIMAL(12, 2),
    cumulative DECIMAL(12, 2),
    step_order INTEGER,
    color TEXT
) AS $$
DECLARE
    v_total_income DECIMAL(12, 2);
    v_total_taxes DECIMAL(12, 2);
    v_total_expenses DECIMAL(12, 2);
    v_net DECIMAL(12, 2);
BEGIN
    -- Calculate totals from transactions_effective (respects overrides)
    SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN type = 'tax_transfer' THEN ABS(amount) ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END), 0)
    INTO v_total_income, v_total_taxes, v_total_expenses
    FROM transactions_effective
    WHERE athlete_id = p_athlete_id
      AND (p_start_date IS NULL OR transaction_date >= p_start_date)
      AND (p_end_date IS NULL OR transaction_date <= p_end_date);

    v_net := v_total_income - v_total_taxes - v_total_expenses;

    RETURN QUERY
    SELECT 'Income'::TEXT, v_total_income, v_total_income, 1, '#10b981'::TEXT
    UNION ALL
    SELECT 'Tax Vault'::TEXT, -v_total_taxes, v_total_income - v_total_taxes, 2, '#3b82f6'::TEXT
    UNION ALL
    SELECT 'Expenses'::TEXT, -v_total_expenses, v_net, 3, '#ef4444'::TEXT
    UNION ALL
    SELECT 'Net Cash'::TEXT, v_net, v_net, 4, '#8b5cf6'::TEXT
    ORDER BY step_order;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- HOME PAGE FUNCTION
-- ============================================

-- Function: fn_home_page
-- Description: Returns all data needed for the home page as a single JSON object
-- Parameters: p_athlete_id (UUID) - The athlete's ID
-- Returns: jsonb with complete page data
CREATE OR REPLACE FUNCTION fn_home_page(p_athlete_id UUID)
RETURNS jsonb AS $$
DECLARE
    v_result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'athlete', (
            SELECT row_to_json(a.*)
            FROM (
                SELECT first_name, full_name, sport, year, initials, email, profile_image_url
                FROM athletes
                WHERE id = p_athlete_id
            ) a
        ),
        'kpis', (
            SELECT row_to_json(k.*)
            FROM get_dashboard_kpis(p_athlete_id) k
        ),
        'recentActivity', (
            SELECT json_agg(ra.*)
            FROM (
                SELECT
                    id,
                    type,
                    category as label,
                    description,
                    formatted_date as date,
                    amount
                FROM recent_activity
                WHERE athlete_id = p_athlete_id
                ORDER BY transaction_date DESC, created_at DESC
                LIMIT 5
            ) ra
        ),
        'upcoming', (
            SELECT json_agg(ut.*)
            FROM (
                SELECT label, formatted_date as date, task_type
                FROM upcoming_tasks_view
                WHERE athlete_id = p_athlete_id
                ORDER BY due_date ASC
                LIMIT 3
            ) ut
        ),
        'compliance', (
            SELECT jsonb_build_object(
                'dealsReported', deals_reported,
                'status', status
            )
            FROM compliance
            WHERE athlete_id = p_athlete_id
        ),
        'dealsSummary', (
            SELECT jsonb_build_object(
                'totalDeals', total_deals,
                'activeDeals', active_deals,
                'pendingDeals', pending_deals,
                'completedDeals', completed_deals
            )
            FROM deal_summary
            WHERE athlete_id = p_athlete_id
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CASH FLOW PAGE FUNCTION
-- ============================================

-- Function: fn_cashflow_page
-- Description: Returns all data needed for the cash flow page as a single JSON object
-- Parameters:
--   p_athlete_id (UUID) - The athlete's ID
--   p_start_date (DATE, optional) - Start date filter
--   p_end_date (DATE, optional) - End date filter
--   p_transaction_type (transaction_type, optional) - Filter by type
--   p_categories (TEXT[], optional) - Filter by categories
-- Returns: jsonb with complete page data
CREATE OR REPLACE FUNCTION fn_cashflow_page(
    p_athlete_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_transaction_type transaction_type DEFAULT NULL,
    p_categories TEXT[] DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
    v_result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'athlete', (
            SELECT row_to_json(a.*)
            FROM (
                SELECT first_name, full_name, initials
                FROM athletes
                WHERE id = p_athlete_id
            ) a
        ),
        'summary', (
            SELECT row_to_json(s.*)
            FROM get_transaction_summary(
                p_athlete_id,
                p_start_date,
                p_end_date,
                p_transaction_type,
                p_categories
            ) s
        ),
        'monthlyTrend', (
            SELECT json_agg(mt.* ORDER BY month_date)
            FROM get_monthly_trend(p_athlete_id, 3) mt
        ),
        'waterfall', (
            SELECT json_agg(w.* ORDER BY step_order)
            FROM get_cashflow_waterfall(p_athlete_id, p_start_date, p_end_date) w
        ),
        'incomeBySource', (
            SELECT json_agg(ibs.*)
            FROM income_by_source_chart ibs
            WHERE ibs.athlete_id = p_athlete_id
        ),
        'expensesByCategory', (
            SELECT json_agg(ebc.*)
            FROM expenses_by_category_chart ebc
            WHERE ebc.athlete_id = p_athlete_id
        ),
        'recentTransactions', (
            SELECT json_agg(t.*)
            FROM (
                SELECT
                    id,
                    type,
                    category,
                    description,
                    amount,
                    formatted_date,
                    transaction_date,
                    has_override,
                    pending,
                    merchant_name
                FROM get_filtered_transactions(
                    p_athlete_id,
                    p_start_date,
                    p_end_date,
                    p_transaction_type,
                    p_categories,
                    10
                )
            ) t
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DEALS PAGE FUNCTION
-- ============================================

-- Function: fn_deals_page
-- Description: Returns all data needed for the deals page as a single JSON object
-- Parameters:
--   p_athlete_id (UUID) - The athlete's ID
--   p_status_filter (deal_status, optional) - Filter by status
-- Returns: jsonb with complete page data
CREATE OR REPLACE FUNCTION fn_deals_page(
    p_athlete_id UUID,
    p_status_filter deal_status DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
    v_result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'athlete', (
            SELECT row_to_json(a.*)
            FROM (
                SELECT first_name, full_name, initials
                FROM athletes
                WHERE id = p_athlete_id
            ) a
        ),
        'summary', (
            SELECT row_to_json(ds.*)
            FROM deal_summary ds
            WHERE ds.athlete_id = p_athlete_id
        ),
        'deals', (
            SELECT json_agg(d.*)
            FROM (
                SELECT
                    id,
                    deal_name,
                    status,
                    source,
                    amount,
                    amount_type,
                    next_action,
                    start_date,
                    end_date,
                    estimated_annual_value,
                    paid_to_date,
                    created_at
                FROM deal_details_with_totals
                WHERE athlete_id = p_athlete_id
                  AND (p_status_filter IS NULL OR status = p_status_filter)
                ORDER BY
                    CASE status
                        WHEN 'active' THEN 1
                        WHEN 'pending' THEN 2
                        WHEN 'completed' THEN 3
                        ELSE 4
                    END,
                    created_at DESC
            ) d
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TAXES PAGE FUNCTION
-- ============================================

-- Function: fn_taxes_page
-- Description: Returns all data needed for the taxes page as a single JSON object
-- Parameters: p_athlete_id (UUID) - The athlete's ID
-- Returns: jsonb with complete page data
CREATE OR REPLACE FUNCTION fn_taxes_page(p_athlete_id UUID)
RETURNS jsonb AS $$
DECLARE
    v_result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'athlete', (
            SELECT row_to_json(a.*)
            FROM (
                SELECT first_name, full_name, initials
                FROM athletes
                WHERE id = p_athlete_id
            ) a
        ),
        'taxVault', (
            SELECT row_to_json(tv.*)
            FROM (
                SELECT
                    current_amount,
                    goal_amount,
                    tax_rate,
                    last_updated_at
                FROM tax_vault
                WHERE athlete_id = p_athlete_id
            ) tv
        ),
        'progress', (
            SELECT row_to_json(p.*)
            FROM calculate_tax_vault_progress(p_athlete_id) p
        ),
        'quarterlyPayments', (
            SELECT json_agg(qp.* ORDER BY year DESC, quarter_number DESC)
            FROM (
                SELECT
                    quarter,
                    year,
                    quarter_number,
                    amount,
                    due_date,
                    status,
                    paid_date,
                    days_until_due,
                    is_overdue
                FROM quarterly_tax_status
                WHERE athlete_id = p_athlete_id
            ) qp
        ),
        'withholdingsHistory', (
            SELECT json_agg(wh.* ORDER BY created_at DESC)
            FROM (
                SELECT
                    withholding_amount,
                    tax_rate,
                    income_amount,
                    created_at
                FROM tax_withholdings
                WHERE athlete_id = p_athlete_id
                ORDER BY created_at DESC
                LIMIT 10
            ) wh
        ),
        'projectedAnnual', (
            SELECT get_projected_annual_income(p_athlete_id)
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PEOPLE PAGE FUNCTION
-- ============================================

-- Function: fn_people_page
-- Description: Returns all data needed for the people/team page as a single JSON object
-- Parameters: p_athlete_id (UUID) - The athlete's ID
-- Returns: jsonb with complete page data
CREATE OR REPLACE FUNCTION fn_people_page(p_athlete_id UUID)
RETURNS jsonb AS $$
DECLARE
    v_result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'athlete', (
            SELECT row_to_json(a.*)
            FROM (
                SELECT first_name, full_name, initials
                FROM athletes
                WHERE id = p_athlete_id
            ) a
        ),
        'people', (
            SELECT json_agg(p.*)
            FROM (
                SELECT
                    person_id as id,
                    name,
                    email,
                    phone,
                    access_level,
                    initials,
                    roles,
                    role_count
                FROM athlete_team
                WHERE athlete_id = p_athlete_id
                ORDER BY
                    CASE access_level
                        WHEN 'admin' THEN 1
                        WHEN 'read-only' THEN 2
                        ELSE 3
                    END,
                    name
            ) p
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- EXAMPLE USAGE:
-- ============================================

-- Get complete home page data:
-- SELECT fn_home_page('00000000-0000-0000-0000-000000000001');

-- Get cash flow page with filters:
-- SELECT fn_cashflow_page(
--   '00000000-0000-0000-0000-000000000001',
--   '2025-01-01',
--   '2025-03-31',
--   NULL,
--   NULL
-- );

-- Get waterfall chart data:
-- SELECT * FROM get_cashflow_waterfall('00000000-0000-0000-0000-000000000001');

-- Get deals page:
-- SELECT fn_deals_page('00000000-0000-0000-0000-000000000001', 'active');

-- Get taxes page:
-- SELECT fn_taxes_page('00000000-0000-0000-0000-000000000001');

-- Get people page:
-- SELECT fn_people_page('00000000-0000-0000-0000-000000000001');
