// Loyalty Tier
export interface LoyaltyTier {
  _id: string;
  tier_name: 'bronze' | 'silver' | 'gold' | 'diamond';
  min_spent: number;
  discount: number;
  benefits?: string;
  sort_order: number;
  [key: string]: any;
}

// Account Info
export interface LoyaltyAccountInfo {
  total_points: number;
  total_spent: number;
  current_tier: LoyaltyTier | null;
  yearly_spending: { [year: string]: number };
  [key: string]: any; // Cho phép nhận mọi trường khác từ BE
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
  [key: string]: any;
} 