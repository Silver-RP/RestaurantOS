

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface DashboardMetric {
  title: string;
  value: string;
  displayValue: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  percent: number;
  chartData: ChartData;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardMetric[];
}

export type TimeRange = 'daily' | 'weekly' | 'monthly';

export interface DashboardRequest {
  timeRange?: TimeRange;
}

export interface RevenueData {
  month: string;
  orderRevenue: number;
  orderCount: number;
  reservationRevenue: number;
  reservationCount: number;
}

export interface RevenueResponse {
  success: boolean;
  message: string;
  data: RevenueData[];
}

export interface RevenueRequest {
  year: number
}

export interface RecentTransaction {
  id: string;
  customerName: string;
  phone: string;
  createdAt: string;
  total: string;
  status: string;
  type: 'order' | 'booking';
}
export interface RecentTransactionsResponse {
  success: boolean;
  message: string;
  data: RecentTransaction[];
}

