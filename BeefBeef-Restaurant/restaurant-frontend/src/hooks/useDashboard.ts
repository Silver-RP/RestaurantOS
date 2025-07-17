import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardMetrics,
  getRevenueChart,
  getRecentTransactions,
} from '@/api/DashboardApi';
import {
  DashboardRequest,
  DashboardResponse,
  RevenueResponse,
  RevenueRequest,
  RecentTransactionsResponse,
} from '../types/Dashboard.type';
import { checkIsLoggedIn } from './useCart';

export const useDashboardMetrics = (params?: DashboardRequest) => {
  return useQuery<DashboardResponse>({
    queryKey: ['dashboard-metrics', params],
    queryFn: () => {
        if (!checkIsLoggedIn()) {
            return Promise.resolve({
            success: false,
            message: 'User not logged in',
            data: [],
            });
        }
        return getDashboardMetrics(params);
    },
    
  });
};

export const useRevenueChart = (params?: RevenueRequest) => {
  return useQuery<RevenueResponse>({
    queryKey: ['revenue-chart', params],
    queryFn: () => {
        if (!checkIsLoggedIn()) {
            return Promise.resolve({
            success: false,
            message: 'User not logged in',
            data: [],
            });
        }
        return getRevenueChart(params);
    },
  });
};

export const useRecentTransactions = () => {
  return useQuery<RecentTransactionsResponse>({
    queryKey: ['recent-transactions'],
    queryFn: () => {
        if (!checkIsLoggedIn()) {
            return Promise.resolve({
            success: false,
            message: 'User not logged in',
            data: [],
            });
        }
        return getRecentTransactions();
    },
  });
};
