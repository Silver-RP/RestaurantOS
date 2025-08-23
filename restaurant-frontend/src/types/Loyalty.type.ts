import { Voucher } from './Voucher.type';

// Loyalty Tier
export interface LoyaltyTier {
  _id: string;
  tier_name: 'new' | 'bronze' | 'silver' | 'gold' | 'diamond';
  min_spent: number;
  discount: number;
  benefits?: string;
  is_active?: boolean;
}

// Milestone Definition
export interface MilestoneDefinition {
  _id: string;
  milestone_amount: number;
  milestone_name: string;
  description: string;
  voucher_id: string;
  voucher?: Voucher;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Account Info
export interface LoyaltyAccountInfo {
  total_points: number;
  total_spent: number;
  current_tier: LoyaltyTier | null;
  yearly_spending: { [year: string]: number };
}

// Transaction
export interface LoyaltyTransaction {
  _id: string;
  account_id: string;
  order_id?: string;
  points: number;
  amount: number;
  type: 'earn' | 'spend';
  note?: string;
  created_at?: string;
} 