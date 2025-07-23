export interface Voucher {
  _id?: string;
  code: string;
  description?: string;
  type: 'public' | 'private' | 'gift';
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  max_discount_value?: number;
  min_order_value?: number;
  quantity: number;
  used: number;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'expired' | 'out_of_stock' | 'deleted';
  created_at?: string;
  updated_at?: string;
  is_saved?: boolean;
  saved_status?: 'saved' | 'used' | 'expired';
  userIds?: string[];
}

export interface UserVoucherDisplay extends Voucher {
  user_voucher_status: 'saved' | 'used' | 'expired';
  user_voucher_id: string;
  user_voucher_savedAt?: string;
  user_voucher_updatedAt?: string;
} 