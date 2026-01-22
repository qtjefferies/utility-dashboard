// TypeScript types matching the PostgreSQL schema
// Use these types in your backend API and frontend code

export type DealStatus = 'active' | 'pending' | 'completed' | 'cancelled';
export type AmountType = 'one-time' | 'monthly' | 'quarterly' | 'yearly' | 'per-instance';
export type TransactionType = 'income' | 'expense' | 'tax_transfer';
export type AccessLevel = 'admin' | 'read-only' | 'none';
export type PersonRole = 'Family' | 'Agent' | 'Deal Rep' | 'Coach' | 'Accountant' | 'Other';
export type PaymentStatus = 'paid' | 'due' | 'estimated' | 'overdue';
export type ComplianceStatus = 'all_clear' | 'pending' | 'warning' | 'violation';
export type ComplianceItemStatus = 'overdue' | 'pending' | 'completed';
export type ComplianceItemPriority = 'high' | 'medium' | 'low';
export type ComplianceItemCategory = 'reporting' | 'contracts' | 'education' | 'disclosure' | 'approval' | 'other';
export type ThemePreference = 'dark' | 'light';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type LanguageCode = 'en' | 'es' | 'fr';

export interface Athlete {
  id: string;
  email: string;
  email_verified: boolean;
  phone?: string;
  first_name: string;
  last_name: string;
  full_name: string; // Generated column
  initials?: string;
  sport?: string;
  year?: string;
  university?: string;
  profile_image_url?: string;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  is_active: boolean;
}

export interface Deal {
  id: string;
  athlete_id: string;
  deal_name: string;
  status: DealStatus;
  source: string;
  amount: number;
  amount_type: AmountType;
  next_action?: string;
  start_date?: Date;
  end_date?: Date;
  contract_url?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Person {
  id: string;
  athlete_id: string;
  name: string;
  email?: string;
  phone?: string;
  access_level: AccessLevel;
  initials?: string;
  photo_url?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  roles?: PersonRole[]; // Populated from person_roles table
}

export interface PersonRoleRecord {
  id: string;
  person_id: string;
  role: PersonRole;
  created_at: Date;
}

export interface Transaction {
  id: string;
  athlete_id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  transaction_date: Date;
  deal_id?: string;
  receipt_url?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaxVault {
  id: string;
  athlete_id: string;
  current_amount: number;
  goal_amount: number;
  tax_rate: number;
  last_updated_at: Date;
}

export interface QuarterlyTaxPayment {
  id: string;
  athlete_id: string;
  quarter: string;
  year: number;
  quarter_number: number;
  amount: number;
  due_date: Date;
  status: PaymentStatus;
  paid_date?: Date;
  payment_reference?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Compliance {
  id: string;
  athlete_id: string;
  deals_reported: number;
  status: ComplianceStatus;
  last_reported_at?: Date;
  notes?: string;
  updated_at: Date;
}

export interface ComplianceItem {
  id: string;
  athlete_id: string;
  title: string;
  description?: string;
  due_date: Date;
  status: ComplianceItemStatus;
  priority: ComplianceItemPriority;
  category: ComplianceItemCategory;
  related_deal_id?: string;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UpcomingTask {
  id: string;
  athlete_id: string;
  label: string;
  description?: string;
  due_date: Date;
  task_type?: string;
  related_deal_id?: string;
  is_completed: boolean;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserSettings {
  id: string;
  athlete_id: string;
  // Notifications
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  deal_reminders: boolean;
  tax_alerts: boolean;
  payment_notifications: boolean;
  // Security
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  // Financial
  default_tax_rate: number;
  preferred_currency: string;
  // Appearance
  theme: ThemePreference;
  date_format: DateFormat;
  language: LanguageCode;
  created_at: Date;
  updated_at: Date;
}

export interface BankAccount {
  id: string;
  athlete_id: string;
  bank_name: string;
  account_type: string;
  last_four_digits: string;
  is_connected: boolean;
  plaid_item_id?: string;
  plaid_account_id?: string;
  last_synced_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ConnectedAccount {
  id: string;
  athlete_id: string;
  platform: string;
  username?: string;
  is_connected: boolean;
  access_token?: string; // Encrypted
  refresh_token?: string; // Encrypted
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// View types (from database views)
export interface DealSummary {
  athlete_id: string;
  total_deals: number;
  active_deals: number;
  pending_deals: number;
  completed_deals: number;
  active_deals_total: number;
}

export interface TransactionSummary {
  athlete_id: string;
  month: Date;
  total_income: number;
  total_expenses: number;
  net_cash_flow: number;
}

export interface IncomeBySource {
  athlete_id: string;
  source: string;
  total_income: number;
}

export interface ExpensesByCategory {
  athlete_id: string;
  category: string;
  total_expenses: number;
}

export interface ComplianceItemsSummary {
  athlete_id: string;
  total_items: number;
  overdue_items: number;
  pending_items: number;
  completed_items: number;
  high_priority_pending: number;
}

// API Request/Response types
export interface CreateDealRequest {
  deal_name: string;
  status: DealStatus;
  source: string;
  amount: number;
  amount_type: AmountType;
  next_action?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  transaction_date: string;
  deal_id?: string;
  receipt_url?: string;
  notes?: string;
}

export interface CreatePersonRequest {
  name: string;
  email?: string;
  phone?: string;
  access_level: AccessLevel;
  roles: PersonRole[];
  photo_url?: string;
  notes?: string;
}

export interface CreateComplianceItemRequest {
  title: string;
  description?: string;
  due_date: string;
  status?: ComplianceItemStatus;
  priority?: ComplianceItemPriority;
  category: ComplianceItemCategory;
  related_deal_id?: string;
}

export interface UpdateComplianceItemRequest {
  title?: string;
  description?: string;
  due_date?: string;
  status?: ComplianceItemStatus;
  priority?: ComplianceItemPriority;
  category?: ComplianceItemCategory;
  related_deal_id?: string;
}

export interface UpdateUserSettingsRequest {
  email_notifications?: boolean;
  sms_notifications?: boolean;
  push_notifications?: boolean;
  deal_reminders?: boolean;
  tax_alerts?: boolean;
  payment_notifications?: boolean;
  two_factor_enabled?: boolean;
  default_tax_rate?: number;
  preferred_currency?: string;
  theme?: ThemePreference;
  date_format?: DateFormat;
  language?: LanguageCode;
}
