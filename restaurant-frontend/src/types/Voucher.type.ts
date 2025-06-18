export interface Voucher {
  _id?: string;
  code: string;
  description?: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  max_discount_value?: number;
  min_order_value?: number;
  quantity: number;
  used: number;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'expired' | 'out_of_stock';
  created_at?: string;
  updated_at?: string;
} 