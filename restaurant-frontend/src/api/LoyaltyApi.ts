import api from './axiosInstance';
import { LoyaltyAccountInfo, LoyaltyTransaction } from '../types/Loyalty.type';
import { LoyaltyTier } from '../types/Loyalty.type';

export async function getAccountInfo(): Promise<LoyaltyAccountInfo> {
  const res = await api.get<LoyaltyAccountInfo>('/loyalty/account');
  return res.data;
}

export async function getTransactionHistory(): Promise<LoyaltyTransaction[]> {
  const res = await api.get<LoyaltyTransaction[]>('/loyalty/transactions');
  return res.data;
}

export async function getAllTiers() {
  const res = await api.get<LoyaltyTier[]>('/loyalty/tiers');
  return res.data;
}

