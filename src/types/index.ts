export type OrderCategory =
  | 'Electronics'
  | 'Apparel'
  | 'Home & Kitchen'
  | 'Books'
  | 'Fitness';

export type OrderStatus = 'Completed' | 'Pending' | 'Processing' | 'Cancelled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  category: OrderCategory;
  amount: number;
  status: OrderStatus;
  date: string;
  country: string;
}

export interface User {
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface TableColumnSort {
  id: string;
  desc: boolean;
}

export interface TablePagination {
  pageIndex: number;
  pageSize: number;
}

export interface TableState {
  data: OrderRecord[];
  globalFilter: string;
  categoryFilter: string;
  statusFilter: string;
  sorting: TableColumnSort[];
  pagination: TablePagination;
}

export interface CategoryRevenueStat {
  category: string;
  revenue: number;
  orders: number;
}

export interface OrderFilters {
  global: string;
  category: string;
  status: string;
}
