// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Accounts ────────────────────────────────────────────────────────────────
export type AccountType = 'cash' | 'bank' | 'ewallet';

export interface Account {
  id: number;
  user_id: number;
  name: string;
  type: AccountType;
  balance: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Categories ──────────────────────────────────────────────────────────────
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  user_id: number | null;
  name: string;
  type: TransactionType;
  icon: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export interface Transaction {
  id: number;
  user_id: number;
  account_id: number;
  category_id: number;
  goal_id: number | null;
  type: TransactionType;
  amount: string;
  description: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  account?: Account;
  category?: Category;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  category_id?: number;
  account_id?: number;
  type?: TransactionType;
  search?: string;
  page?: number;
  per_page?: number;
}

// ─── Budgets ─────────────────────────────────────────────────────────────────
export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  month: number;
  year: number;
  limit_amount: string;
  spent_amount?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// ─── Goals ───────────────────────────────────────────────────────────────────
export interface Goal {
  id: number;
  user_id: number;
  name: string;
  target_amount: string;
  current_amount: string;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Income Settings ─────────────────────────────────────────────────────────
export type PeriodType = 'weekly' | 'monthly';

export interface IncomeSetting {
  id: number;
  user_id: number;
  amount: string;
  period_type: PeriodType;
  is_active: boolean;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

// ─── Spending Threshold ──────────────────────────────────────────────────────
export interface SpendingThreshold {
  id: number;
  user_id: number;
  hemat_max_percent: string;
  boros_min_percent: string;
  created_at: string;
  updated_at: string;
}

// ─── Spending Status ─────────────────────────────────────────────────────────
export type SpendingStatus = 'hemat' | 'normal' | 'boros';

export interface SpendingStatusResponse {
  status: SpendingStatus;
  spent_percent: number;
  spent_amount: number;
  income_amount: number;
  period_type: PeriodType;
  period_label: string;
  message: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardSummary {
  total_balance: string;
  total_income_this_month: string;
  total_expense_this_month: string;
  spending_status: SpendingStatusResponse;
  expense_by_category: Array<{ category: string; amount: number; color?: string }>;
  recent_transactions: Transaction[];
}

// ─── Reports ─────────────────────────────────────────────────────────────────
export interface PeriodComparison {
  month: string;
  year: number;
  income: number;
  expense: number;
  savings: number;
}

// ─── API Generic Wrappers ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}
