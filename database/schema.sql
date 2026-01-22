-- ============================================
-- Athlete Dashboard PostgreSQL Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE deal_status AS ENUM ('active', 'pending', 'completed', 'cancelled');
CREATE TYPE amount_type AS ENUM ('one-time', 'monthly', 'quarterly', 'yearly', 'per-instance');
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'tax_transfer');
CREATE TYPE access_level AS ENUM ('admin', 'read-only', 'none');
CREATE TYPE person_role AS ENUM ('Family', 'Agent', 'Deal Rep', 'Coach', 'Accountant', 'Other');
CREATE TYPE payment_status AS ENUM ('paid', 'due', 'estimated', 'overdue');
CREATE TYPE compliance_status AS ENUM ('all_clear', 'pending', 'warning', 'violation');
CREATE TYPE compliance_item_status AS ENUM ('overdue', 'pending', 'completed');
CREATE TYPE compliance_item_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE compliance_item_category AS ENUM ('reporting', 'contracts', 'education', 'disclosure', 'approval', 'other');
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'push');
CREATE TYPE theme_preference AS ENUM ('dark', 'light');
CREATE TYPE date_format AS ENUM ('MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD');
CREATE TYPE language_code AS ENUM ('en', 'es', 'fr');

-- ============================================
-- CORE TABLES
-- ============================================

-- Athletes/Users table
CREATE TABLE athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    initials VARCHAR(10),
    sport VARCHAR(50),
    year VARCHAR(50), -- e.g., "Sophomore", "Junior"
    university VARCHAR(200),
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Deals table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    deal_name VARCHAR(255) NOT NULL,
    status deal_status NOT NULL DEFAULT 'pending',
    source VARCHAR(100) NOT NULL, -- e.g., "Brand Direct", "Collective"
    amount DECIMAL(12, 2) NOT NULL,
    amount_type amount_type NOT NULL,
    next_action TEXT,
    start_date DATE,
    end_date DATE,
    contract_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- People/Team members table
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    access_level access_level NOT NULL DEFAULT 'none',
    initials VARCHAR(10),
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Person roles (many-to-many relationship)
CREATE TABLE person_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    role person_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(person_id, role)
);

-- Transactions table (income, expenses, tax transfers)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., "Collective", "Brand Deal", "Business", "Travel"
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL, -- Link to deal if applicable
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT non_zero_amount CHECK (amount != 0)
);

-- Tax Vault (tracking tax savings)
CREATE TABLE tax_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL UNIQUE REFERENCES athletes(id) ON DELETE CASCADE,
    current_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    goal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.28, -- e.g., 0.28 for 28%
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 1)
);

-- Quarterly Tax Payments
CREATE TABLE quarterly_tax_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    quarter VARCHAR(20) NOT NULL, -- e.g., "Q1 2025"
    year INTEGER NOT NULL,
    quarter_number INTEGER NOT NULL CHECK (quarter_number BETWEEN 1 AND 4),
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status payment_status NOT NULL DEFAULT 'estimated',
    paid_date DATE,
    payment_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(athlete_id, year, quarter_number)
);

-- Compliance tracking
CREATE TABLE compliance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    deals_reported INTEGER NOT NULL DEFAULT 0,
    status compliance_status NOT NULL DEFAULT 'all_clear',
    last_reported_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Compliance items (individual compliance tasks/requirements)
CREATE TABLE compliance_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status compliance_item_status NOT NULL DEFAULT 'pending',
    priority compliance_item_priority NOT NULL DEFAULT 'medium',
    category compliance_item_category NOT NULL DEFAULT 'other',
    related_deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Upcoming tasks/reminders
CREATE TABLE upcoming_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    task_type VARCHAR(50), -- e.g., "deal", "tax", "compliance"
    related_deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SETTINGS & PREFERENCES
-- ============================================

-- User settings
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL UNIQUE REFERENCES athletes(id) ON DELETE CASCADE,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    deal_reminders BOOLEAN DEFAULT TRUE,
    tax_alerts BOOLEAN DEFAULT TRUE,
    payment_notifications BOOLEAN DEFAULT TRUE,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    
    -- Financial settings
    default_tax_rate DECIMAL(5, 4) DEFAULT 0.28,
    preferred_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Appearance & localization
    theme theme_preference DEFAULT 'dark',
    date_format date_format DEFAULT 'MM/DD/YYYY',
    language language_code DEFAULT 'en',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_default_tax_rate CHECK (default_tax_rate >= 0 AND default_tax_rate <= 1)
);

-- Bank accounts
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    bank_name VARCHAR(200) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- e.g., "Checking", "Savings"
    last_four_digits VARCHAR(4) NOT NULL,
    is_connected BOOLEAN DEFAULT FALSE,
    plaid_item_id VARCHAR(255), -- If using Plaid integration
    plaid_account_id VARCHAR(255),
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Connected social accounts
CREATE TABLE connected_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- e.g., "Instagram", "Twitter", "TikTok"
    username VARCHAR(255),
    is_connected BOOLEAN DEFAULT FALSE,
    access_token TEXT, -- Encrypted
    refresh_token TEXT, -- Encrypted
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(athlete_id, platform)
);

-- ============================================
-- INDEXES
-- ============================================

-- Athletes indexes
CREATE INDEX idx_athletes_email ON athletes(email);
CREATE INDEX idx_athletes_sport ON athletes(sport);

-- Deals indexes
CREATE INDEX idx_deals_athlete_id ON deals(athlete_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_athlete_status ON deals(athlete_id, status);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);

-- People indexes
CREATE INDEX idx_people_athlete_id ON people(athlete_id);
CREATE INDEX idx_people_access_level ON people(access_level);

-- Person roles indexes
CREATE INDEX idx_person_roles_person_id ON person_roles(person_id);
CREATE INDEX idx_person_roles_role ON person_roles(role);

-- Transactions indexes
CREATE INDEX idx_transactions_athlete_id ON transactions(athlete_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_transactions_athlete_date ON transactions(athlete_id, transaction_date DESC);
CREATE INDEX idx_transactions_deal_id ON transactions(deal_id);
CREATE INDEX idx_transactions_category ON transactions(category);

-- Quarterly tax payments indexes
CREATE INDEX idx_quarterly_tax_athlete_id ON quarterly_tax_payments(athlete_id);
CREATE INDEX idx_quarterly_tax_due_date ON quarterly_tax_payments(due_date);
CREATE INDEX idx_quarterly_tax_status ON quarterly_tax_payments(status);

-- Upcoming tasks indexes
CREATE INDEX idx_upcoming_tasks_athlete_id ON upcoming_tasks(athlete_id);
CREATE INDEX idx_upcoming_tasks_due_date ON upcoming_tasks(due_date);
CREATE INDEX idx_upcoming_tasks_completed ON upcoming_tasks(is_completed);

-- Compliance items indexes
CREATE INDEX idx_compliance_items_athlete_id ON compliance_items(athlete_id);
CREATE INDEX idx_compliance_items_status ON compliance_items(status);
CREATE INDEX idx_compliance_items_due_date ON compliance_items(due_date);
CREATE INDEX idx_compliance_items_priority ON compliance_items(priority);
CREATE INDEX idx_compliance_items_athlete_status ON compliance_items(athlete_id, status);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quarterly_tax_updated_at BEFORE UPDATE ON quarterly_tax_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connected_accounts_updated_at BEFORE UPDATE ON connected_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_items_updated_at BEFORE UPDATE ON compliance_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-generate initials
CREATE OR REPLACE FUNCTION generate_initials()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.initials IS NULL OR NEW.initials = '' THEN
        IF NEW.first_name IS NOT NULL AND NEW.last_name IS NOT NULL THEN
            NEW.initials := UPPER(SUBSTRING(NEW.first_name, 1, 1) || SUBSTRING(NEW.last_name, 1, 1));
        ELSIF NEW.first_name IS NOT NULL THEN
            NEW.initials := UPPER(SUBSTRING(NEW.first_name, 1, 2));
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_athlete_initials BEFORE INSERT OR UPDATE ON athletes
    FOR EACH ROW EXECUTE FUNCTION generate_initials();

-- Function to auto-update tax vault on transaction
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
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tax_vault_trigger AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_tax_vault_on_income();

-- ============================================
-- VIEWS (for common queries)
-- ============================================

-- View for deal summary by athlete
CREATE OR REPLACE VIEW deal_summary AS
SELECT 
    athlete_id,
    COUNT(*) as total_deals,
    COUNT(*) FILTER (WHERE status = 'active') as active_deals,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_deals,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_deals,
    SUM(amount) FILTER (WHERE status = 'active') as active_deals_total
FROM deals
GROUP BY athlete_id;

-- View for transaction summary by athlete
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    athlete_id,
    DATE_TRUNC('month', transaction_date) as month,
    SUM(amount) FILTER (WHERE type = 'income') as total_income,
    SUM(amount) FILTER (WHERE type = 'expense') as total_expenses,
    SUM(amount) FILTER (WHERE type = 'income') + 
    SUM(amount) FILTER (WHERE type = 'expense') as net_cash_flow
FROM transactions
GROUP BY athlete_id, DATE_TRUNC('month', transaction_date);

-- View for income by source
CREATE OR REPLACE VIEW income_by_source AS
SELECT 
    athlete_id,
    category as source,
    SUM(amount) as total_income
FROM transactions
WHERE type = 'income'
GROUP BY athlete_id, category;

-- View for expenses by category
CREATE OR REPLACE VIEW expenses_by_category AS
SELECT
    athlete_id,
    category,
    SUM(ABS(amount)) as total_expenses
FROM transactions
WHERE type = 'expense'
GROUP BY athlete_id, category;

-- View for compliance items summary
CREATE OR REPLACE VIEW compliance_items_summary AS
SELECT
    athlete_id,
    COUNT(*) as total_items,
    COUNT(*) FILTER (WHERE status = 'overdue') as overdue_items,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_items,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_items,
    COUNT(*) FILTER (WHERE priority = 'high' AND status != 'completed') as high_priority_pending
FROM compliance_items
GROUP BY athlete_id;

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE athletes IS 'Core user/athlete information';
COMMENT ON TABLE deals IS 'NIL deals and partnerships';
COMMENT ON TABLE people IS 'Team members, family, agents, etc.';
COMMENT ON TABLE transactions IS 'All financial transactions (income, expenses, tax transfers)';
COMMENT ON TABLE tax_vault IS 'Tax savings tracking per athlete';
COMMENT ON TABLE quarterly_tax_payments IS 'Quarterly estimated tax payment schedule';
COMMENT ON TABLE user_settings IS 'User preferences and notification settings';
COMMENT ON TABLE bank_accounts IS 'Connected bank accounts for transaction tracking';
COMMENT ON TABLE connected_accounts IS 'Connected social media accounts';
COMMENT ON TABLE compliance_items IS 'Individual compliance tasks and requirements for athletes';
COMMENT ON COLUMN people.photo_url IS 'Profile photo URL for team member display';
