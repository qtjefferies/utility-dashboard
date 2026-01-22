-- ============================================
-- Migration: 003_add_missing_fields.sql
-- Description: Add missing fields for frontend parity
-- - Add photo_url to people table
-- - Add compliance_items table for detailed compliance tracking
-- - Add new enums for compliance item management
-- Created: 2026-01-22
-- ============================================

-- ============================================
-- NEW ENUMS
-- ============================================

-- Compliance item status (different from compliance_status - this is for individual items)
CREATE TYPE compliance_item_status AS ENUM ('overdue', 'pending', 'completed');

-- Compliance item priority
CREATE TYPE compliance_item_priority AS ENUM ('high', 'medium', 'low');

-- Compliance item category
CREATE TYPE compliance_item_category AS ENUM ('reporting', 'contracts', 'education', 'disclosure', 'approval', 'other');

-- ============================================
-- ALTER EXISTING TABLES
-- ============================================

-- Add photo_url column to people table
ALTER TABLE people
ADD COLUMN photo_url TEXT;

-- Add description column to upcoming_tasks for richer task info
ALTER TABLE upcoming_tasks
ADD COLUMN description TEXT;

-- ============================================
-- NEW TABLES
-- ============================================

-- Compliance Items table (detailed compliance tasks/items)
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

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_compliance_items_athlete_id ON compliance_items(athlete_id);
CREATE INDEX idx_compliance_items_status ON compliance_items(status);
CREATE INDEX idx_compliance_items_due_date ON compliance_items(due_date);
CREATE INDEX idx_compliance_items_priority ON compliance_items(priority);
CREATE INDEX idx_compliance_items_athlete_status ON compliance_items(athlete_id, status);

-- ============================================
-- TRIGGERS
-- ============================================

-- Apply updated_at trigger to compliance_items
CREATE TRIGGER update_compliance_items_updated_at BEFORE UPDATE ON compliance_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- UPDATE SEED DATA
-- ============================================

-- Update people with photo URLs (matching frontend mockData)
UPDATE people SET photo_url = 'https://randomuser.me/api/portraits/women/44.jpg'
WHERE id = '10000000-0000-0000-0003-000000000001';

UPDATE people SET photo_url = 'https://randomuser.me/api/portraits/men/32.jpg'
WHERE id = '10000000-0000-0000-0003-000000000002';

UPDATE people SET photo_url = 'https://randomuser.me/api/portraits/men/52.jpg'
WHERE id = '10000000-0000-0000-0003-000000000003';

UPDATE people SET photo_url = 'https://randomuser.me/api/portraits/women/68.jpg'
WHERE id = '10000000-0000-0000-0003-000000000004';

UPDATE people SET photo_url = 'https://randomuser.me/api/portraits/men/85.jpg'
WHERE id = '10000000-0000-0000-0003-000000000005';

UPDATE people SET photo_url = 'https://randomuser.me/api/portraits/women/90.jpg'
WHERE id = '10000000-0000-0000-0003-000000000006';

-- Insert compliance items (matching frontend mockData compliance.items)
INSERT INTO compliance_items (id, athlete_id, title, description, due_date, status, priority, category, created_at) VALUES
('10000000-0000-0000-0004-000000000001', '10000000-0000-0000-0000-000000000001', 'Q1 NIL Report Due', 'Submit quarterly NIL earnings report to compliance office', '2025-03-20', 'overdue', 'high', 'reporting', CURRENT_TIMESTAMP),
('10000000-0000-0000-0004-000000000002', '10000000-0000-0000-0000-000000000001', 'Auto Dealership Contract', 'Upload signed contract for review', '2025-03-25', 'pending', 'high', 'contracts', CURRENT_TIMESTAMP),
('10000000-0000-0000-0004-000000000003', '10000000-0000-0000-0000-000000000001', 'NIL Education Module', 'Complete annual compliance training', '2025-04-01', 'pending', 'medium', 'education', CURRENT_TIMESTAMP),
('10000000-0000-0000-0004-000000000004', '10000000-0000-0000-0000-000000000001', 'Financial Disclosure', 'Update financial disclosure form', '2025-03-18', 'overdue', 'high', 'disclosure', CURRENT_TIMESTAMP),
('10000000-0000-0000-0004-000000000005', '10000000-0000-0000-0000-000000000001', 'Social Media Post Approval', 'Get pre-approval for upcoming brand posts', '2025-03-28', 'completed', 'medium', 'approval', CURRENT_TIMESTAMP);

-- Update compliance table status to reflect items (action_required since there are overdue items)
UPDATE compliance
SET status = 'warning', notes = 'Has overdue compliance items'
WHERE athlete_id = '10000000-0000-0000-0000-000000000001';

-- ============================================
-- VIEWS
-- ============================================

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
-- COMMENTS
-- ============================================

COMMENT ON TABLE compliance_items IS 'Individual compliance tasks and requirements for athletes';
COMMENT ON COLUMN people.photo_url IS 'Profile photo URL for team member display';
