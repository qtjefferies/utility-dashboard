# Frontend to Backend Field Mapping

This document maps frontend mock data fields to their corresponding PostgreSQL database columns.

## Table of Contents
- [Athlete](#athlete)
- [Deals](#deals)
- [Transactions / Cash Flow](#transactions--cash-flow)
- [People](#people)
- [Tax Vault](#tax-vault)
- [Quarterly Tax Payments](#quarterly-tax-payments)
- [Compliance](#compliance)
- [Compliance Items](#compliance-items)
- [Upcoming Tasks](#upcoming-tasks)
- [User Settings](#user-settings)

---

## Athlete

**Frontend Location**: `homeData.athlete`
**Database Table**: `athletes`

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| `firstName` | `first_name` | VARCHAR(100) | Required |
| `fullName` | `full_name` | VARCHAR(200) | Auto-generated (first_name + last_name) |
| `sport` | `sport` | VARCHAR(50) | e.g., "Football" |
| `year` | `year` | VARCHAR(50) | e.g., "Sophomore" |
| `initials` | `initials` | VARCHAR(10) | Auto-generated via trigger |
| - | `last_name` | VARCHAR(100) | Required |
| - | `email` | VARCHAR(255) | Required, unique |
| - | `phone` | VARCHAR(20) | Optional |
| - | `university` | VARCHAR(200) | Optional |
| - | `profile_image_url` | TEXT | Optional |
| - | `is_active` | BOOLEAN | Default true |

---

## Deals

**Frontend Location**: `dealsData.deals`
**Database Table**: `deals`

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| `id` | `id` | UUID | Primary key |
| `status` | `status` | ENUM | 'active', 'pending', 'completed', 'cancelled' |
| `dealName` | `deal_name` | VARCHAR(255) | Required |
| `source` | `source` | VARCHAR(100) | "Brand Direct", "Collective", etc. |
| `amount` | `amount` | DECIMAL(12,2) | Required, positive |
| `amountType` | `amount_type` | ENUM | 'one-time', 'monthly', 'quarterly', 'yearly', 'per-instance' |
| `nextAction` | `next_action` | TEXT | Nullable |
| - | `athlete_id` | UUID | Foreign key to athletes |
| - | `start_date` | DATE | Optional |
| - | `end_date` | DATE | Optional |
| - | `contract_url` | TEXT | Optional |
| - | `notes` | TEXT | Optional |
| - | `created_at` | TIMESTAMP | Auto-generated |
| - | `updated_at` | TIMESTAMP | Auto-updated |

**Deal Summary View** (`deal_summary`)

| Frontend Field | View Column | Notes |
|----------------|-------------|-------|
| `summary.totalDeals` | `total_deals` | COUNT(*) |
| `summary.activeDeals` | `active_deals` | COUNT WHERE status='active' |
| `summary.pendingDeals` | `pending_deals` | COUNT WHERE status='pending' |
| `summary.completedDeals` | `completed_deals` | COUNT WHERE status='completed' |

---

## Transactions / Cash Flow

**Frontend Location**: `cashFlowData.allTransactions`
**Database Table**: `transactions`

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| `id` | `id` | UUID | Primary key |
| `type` | `type` | ENUM | 'income', 'expense', 'tax_transfer' |
| `category` | `category` | VARCHAR(100) | "Collective", "Brand Deal", "Business", etc. |
| `description` | `description` | TEXT | Required |
| `date` | `transaction_date` | DATE | Required |
| `month` | - | - | Derived from transaction_date |
| `amount` | `amount` | DECIMAL(12,2) | Positive for income, negative for expenses |
| - | `athlete_id` | UUID | Foreign key to athletes |
| - | `deal_id` | UUID | Optional link to deals table |
| - | `receipt_url` | TEXT | Optional |
| - | `notes` | TEXT | Optional |
| - | `created_at` | TIMESTAMP | Auto-generated |
| - | `updated_at` | TIMESTAMP | Auto-updated |

**Cash Flow Summary** (`transaction_summary` view)

| Frontend Field | View/Query | Notes |
|----------------|------------|-------|
| `summary.totalIncome` | SUM(amount) WHERE type='income' | Aggregate |
| `summary.totalExpenses` | ABS(SUM(amount)) WHERE type='expense' | Aggregate |
| `summary.netCashFlow` | total_income + total_expenses | Calculated |
| `summary.taxesSaved` | `tax_vault.current_amount` | From tax_vault table |

**Monthly Trend** (`transaction_summary` view)

| Frontend Field | View Column | Notes |
|----------------|-------------|-------|
| `monthlyTrend[].month` | DATE_TRUNC('month', transaction_date) | Grouped |
| `monthlyTrend[].income` | `total_income` | Monthly sum |
| `monthlyTrend[].expenses` | ABS(`total_expenses`) | Monthly sum |
| `monthlyTrend[].net` | `net_cash_flow` | income - expenses |

**Income By Source** (`income_by_source` view)

| Frontend Field | View Column | Notes |
|----------------|-------------|-------|
| `incomeBySource[].name` | `source` (category) | Grouped |
| `incomeBySource[].value` | `total_income` | SUM(amount) |
| `incomeBySource[].color` | - | Frontend-only (from categoryColorPalette) |

**Expenses By Category** (`expenses_by_category` view)

| Frontend Field | View Column | Notes |
|----------------|-------------|-------|
| `expensesByCategory[].name` | `category` | Grouped |
| `expensesByCategory[].value` | `total_expenses` | SUM(ABS(amount)) |
| `expensesByCategory[].color` | - | Frontend-only (from categoryColorPalette) |

---

## People

**Frontend Location**: `peopleData.people`
**Database Tables**: `people` + `person_roles`

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| `id` | `id` | UUID | Primary key |
| `name` | `name` | VARCHAR(200) | Required |
| `roles` | `person_roles.role` | ENUM[] | Many-to-many via person_roles table |
| `email` | `email` | VARCHAR(255) | Optional |
| `phone` | `phone` | VARCHAR(20) | Optional |
| `accessLevel` | `access_level` | ENUM | 'admin', 'read-only', 'none' |
| `initials` | `initials` | VARCHAR(10) | Can be auto-generated |
| `photoUrl` | `photo_url` | TEXT | **NEW** - Profile photo URL |
| - | `athlete_id` | UUID | Foreign key to athletes |
| - | `notes` | TEXT | Optional |
| - | `created_at` | TIMESTAMP | Auto-generated |
| - | `updated_at` | TIMESTAMP | Auto-updated |

**Person Roles** (junction table)

| Field | Database Column | Type | Notes |
|-------|-----------------|------|-------|
| - | `person_id` | UUID | Foreign key to people |
| - | `role` | ENUM | 'Family', 'Agent', 'Deal Rep', 'Coach', 'Accountant', 'Other' |

---

## Tax Vault

**Frontend Location**: `taxesData.taxVault`
**Database Table**: `tax_vault`

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| `currentAmount` | `current_amount` | DECIMAL(12,2) | Auto-updated on income |
| `goalAmount` | `goal_amount` | DECIMAL(12,2) | Target amount |
| `progressPercentage` | - | - | Calculated: (current/goal)*100 |
| `projectedTotal` | - | - | Calculated projection |
| `onTrackMessage` | - | - | Frontend display string |
| - | `athlete_id` | UUID | Foreign key (unique, 1-to-1) |
| - | `tax_rate` | DECIMAL(5,4) | Default 0.28 (28%) |
| - | `last_updated_at` | TIMESTAMP | Auto-updated |

**Tax Strategy** (from `user_settings`)

| Frontend Field | Database Column | Table | Notes |
|----------------|-----------------|-------|-------|
| `strategy.currentRate` | `default_tax_rate` | user_settings | DECIMAL(5,4) |
| `strategy.minRate` | - | - | Frontend constant (0.20) |
| `strategy.maxRate` | - | - | Frontend constant (0.35) |
| `strategy.options` | - | - | Frontend constant array |

---

## Quarterly Tax Payments

**Frontend Location**: `taxesData.quarterlyPayments`
**Database Table**: `quarterly_tax_payments`

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| `id` | `id` | UUID | Primary key |
| `quarter` | `quarter` | VARCHAR(20) | "Q1 2025" format |
| `amount` | `amount` | DECIMAL(12,2) | Payment amount |
| `dueDate` | `due_date` | DATE | Payment due date |
| `status` | `status` | ENUM | 'paid', 'due', 'estimated', 'overdue' |
| - | `athlete_id` | UUID | Foreign key to athletes |
| - | `year` | INTEGER | Year extracted from quarter |
| - | `quarter_number` | INTEGER | 1-4 |
| - | `paid_date` | DATE | When payment was made |
| - | `payment_reference` | TEXT | Payment confirmation |
| - | `created_at` | TIMESTAMP | Auto-generated |
| - | `updated_at` | TIMESTAMP | Auto-updated |

---

## Compliance

**Frontend Location**: `homeData.compliance` (summary only)
**Database Table**: `compliance`

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| `dealsReported` | `deals_reported` | INTEGER | Count of reported deals |
| `status` | `status` | ENUM | 'all_clear', 'pending', 'warning', 'violation' |
| - | `athlete_id` | UUID | Foreign key to athletes |
| - | `last_reported_at` | TIMESTAMP | Last report submission |
| - | `notes` | TEXT | Optional |
| - | `updated_at` | TIMESTAMP | Auto-updated |

**Note**: Frontend `status: "action_required"` maps to database `status: "warning"`

---

## Compliance Items

**Frontend Location**: `homeData.compliance.items`
**Database Table**: `compliance_items` **(NEW)**

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| `id` | `id` | UUID | Primary key |
| `title` | `title` | VARCHAR(255) | Required |
| `description` | `description` | TEXT | Optional |
| `dueDate` | `due_date` | DATE | Required |
| `status` | `status` | ENUM | 'overdue', 'pending', 'completed' |
| `priority` | `priority` | ENUM | 'high', 'medium', 'low' |
| `category` | `category` | ENUM | 'reporting', 'contracts', 'education', 'disclosure', 'approval', 'other' |
| - | `athlete_id` | UUID | Foreign key to athletes |
| - | `related_deal_id` | UUID | Optional link to deals |
| - | `completed_at` | TIMESTAMP | When marked complete |
| - | `created_at` | TIMESTAMP | Auto-generated |
| - | `updated_at` | TIMESTAMP | Auto-updated |

**Compliance Items Summary View** (`compliance_items_summary`)

| Field | View Column | Notes |
|-------|-------------|-------|
| - | `total_items` | COUNT(*) |
| - | `overdue_items` | COUNT WHERE status='overdue' |
| - | `pending_items` | COUNT WHERE status='pending' |
| - | `completed_items` | COUNT WHERE status='completed' |
| - | `high_priority_pending` | COUNT WHERE priority='high' AND status!='completed' |

---

## Upcoming Tasks

**Frontend Location**: `homeData.upcoming`
**Database Table**: `upcoming_tasks`

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| `id` | `id` | UUID | Primary key |
| `label` | `label` | VARCHAR(255) | Required |
| `date` | `due_date` | DATE | Required |
| - | `description` | TEXT | **NEW** - Optional description |
| - | `athlete_id` | UUID | Foreign key to athletes |
| - | `task_type` | VARCHAR(50) | 'deal', 'tax', 'compliance', etc. |
| - | `related_deal_id` | UUID | Optional link to deals |
| - | `is_completed` | BOOLEAN | Default false |
| - | `completed_at` | TIMESTAMP | When marked complete |
| - | `created_at` | TIMESTAMP | Auto-generated |
| - | `updated_at` | TIMESTAMP | Auto-updated |

---

## User Settings

**Frontend Location**: Settings page state
**Database Table**: `user_settings`

| Frontend Field | Database Column | Type | Notes |
|----------------|-----------------|------|-------|
| Notifications | | | |
| `emailNotifications` | `email_notifications` | BOOLEAN | Default true |
| `smsNotifications` | `sms_notifications` | BOOLEAN | Default false |
| `pushNotifications` | `push_notifications` | BOOLEAN | Default true |
| `dealReminders` | `deal_reminders` | BOOLEAN | Default true |
| `taxAlerts` | `tax_alerts` | BOOLEAN | Default true |
| `paymentNotifications` | `payment_notifications` | BOOLEAN | Default true |
| Security | | | |
| `twoFactorEnabled` | `two_factor_enabled` | BOOLEAN | Default false |
| - | `two_factor_secret` | VARCHAR(255) | Encrypted secret |
| Financial | | | |
| `defaultTaxRate` | `default_tax_rate` | DECIMAL(5,4) | Default 0.28 |
| `preferredCurrency` | `preferred_currency` | VARCHAR(3) | Default 'USD' |
| Appearance | | | |
| `theme` | `theme` | ENUM | 'dark', 'light' |
| `dateFormat` | `date_format` | ENUM | 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD' |
| `language` | `language` | ENUM | 'en', 'es', 'fr' |
| - | `athlete_id` | UUID | Foreign key (unique, 1-to-1) |
| - | `created_at` | TIMESTAMP | Auto-generated |
| - | `updated_at` | TIMESTAMP | Auto-updated |

---

## Recent Activity

**Frontend Location**: `homeData.recentActivity`
**Database Source**: `transactions` table (recent records)

| Frontend Field | Database Column | Notes |
|----------------|-----------------|-------|
| `id` | `id` | UUID |
| `type` | `type` | ENUM |
| `label` | `description` | TEXT |
| `date` | `transaction_date` | Formatted for display |
| `amount` | `amount` | DECIMAL |

---

## KPIs (Dashboard)

**Frontend Location**: `homeData.kpis`
**Database Source**: Multiple tables/views

| Frontend Field | Source | Query/Calculation |
|----------------|--------|-------------------|
| `totalEarned` | transactions | SUM(amount) WHERE type='income' |
| `taxVault` | tax_vault | current_amount |
| `available` | calculated | totalEarned - taxVault |
| `taxRate` | user_settings | default_tax_rate |
| `earnedMoM` | calculated | Month-over-month percentage change |

---

## Data Type Mapping Summary

| PostgreSQL Type | TypeScript Type | Notes |
|-----------------|-----------------|-------|
| UUID | string | Use uuid-ossp extension |
| VARCHAR(n) | string | Max length n characters |
| TEXT | string | Unlimited length |
| DECIMAL(p,s) | number | Precision p, scale s |
| INTEGER | number | 32-bit integer |
| BOOLEAN | boolean | true/false |
| DATE | Date / string | YYYY-MM-DD format |
| TIMESTAMP WITH TIME ZONE | Date | ISO 8601 format |
| ENUM | union type | e.g., 'a' \| 'b' \| 'c' |

---

## Enum Value Mappings

### Deal Status
| Frontend | Database | Notes |
|----------|----------|-------|
| `"active"` | `'active'` | Currently active deal |
| `"pending"` | `'pending'` | Awaiting approval/action |
| `"completed"` | `'completed'` | Deal finished |
| - | `'cancelled'` | Deal cancelled (DB only) |

### Amount Type
| Frontend | Database | Notes |
|----------|----------|-------|
| `"one-time"` | `'one-time'` | Single payment |
| `"monthly"` | `'monthly'` | Recurring monthly |
| - | `'quarterly'` | Recurring quarterly |
| - | `'yearly'` | Recurring yearly |
| - | `'per-instance'` | Per occurrence |

### Transaction Type
| Frontend | Database | Notes |
|----------|----------|-------|
| `"income"` | `'income'` | Money received |
| `"expense"` | `'expense'` | Money spent |
| `"tax_transfer"` | `'tax_transfer'` | Tax vault transfer |

### Compliance Status
| Frontend | Database | Notes |
|----------|----------|-------|
| `"action_required"` | `'warning'` | **Mapping required** |
| - | `'all_clear'` | No issues |
| - | `'pending'` | Awaiting review |
| - | `'violation'` | Compliance issue |

### Compliance Item Status
| Frontend | Database | Notes |
|----------|----------|-------|
| `"overdue"` | `'overdue'` | Past due date |
| `"pending"` | `'pending'` | Not yet completed |
| `"completed"` | `'completed'` | Done |

### Access Level
| Frontend | Database | Notes |
|----------|----------|-------|
| `"admin"` | `'admin'` | Full access |
| `"read-only"` | `'read-only'` | View only |
| - | `'none'` | No dashboard access |

### Person Role
| Frontend | Database | Notes |
|----------|----------|-------|
| `"Family"` | `'Family'` | Family member |
| `"Agent"` | `'Agent'` | Sports agent |
| `"Deal Rep"` | `'Deal Rep'` | Deal representative |
| `"Coach"` | `'Coach'` | Athletic coach |
| `"Accountant"` | `'Accountant'` | Financial advisor |
| `"Other"` | `'Other'` | Other relationship |

---

## Migration History

| Migration | Description | Date |
|-----------|-------------|------|
| 001_initial_schema.sql | Base schema with all core tables | Initial |
| 002_seed_data.sql | Demo data for Marcus Thompson | Initial |
| 003_add_missing_fields.sql | Add photo_url, compliance_items table | 2026-01-22 |
