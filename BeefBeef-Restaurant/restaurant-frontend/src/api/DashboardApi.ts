
import api from './axiosInstance';
import {
  DashboardRequest,
  DashboardResponse,
  RevenueResponse,
  RevenueRequest,
  RecentTransactionsResponse,
} from '../types/Dashboard.type';

export async function getDashboardMetrics(
  params?: DashboardRequest,
): Promise<DashboardResponse> {
  const res = await api.get('/dashboard/metrics', { params });
  return res.data;
}

export async function getRevenueChart(params?: RevenueRequest): Promise<RevenueResponse> {
  const res = await api.get('/dashboard/revenue-chart', {params});
  return res.data
}

export async function getRecentTransactions(): Promise<RecentTransactionsResponse> {
  const res = await api.get('/dashboard/recent-transactions');
  return res.data;
}