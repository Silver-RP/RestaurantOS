export type DeliveryStatus = 
  | 'PENDING_PICKUP' 
  | 'PICKED_UP' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'FAILED';

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'RETURNED';

export type PaymentMethod = 
  | 'CASH' 
  | 'CREDIT_CARD' 
  | 'BANK_TRANSFER' 
  | 'MOMO' 
  | 'ZALOPAY';

export type DeliveryType = 
  | 'DELIVERY' 
  | 'PICKUP';

export type OrderType = 
  | 'ONLINE' 
  | 'IN_STORE';

export type DeliveryTimeType = 
  | 'ASAP' 
  | 'SCHEDULED';

export interface OrderItem {
  _id: string;
  product_id: string;
  order_id: string;
  name: string;
  price: number;
  discount_price?: number;
  quantity: number;
  note?: string;
  image?: string;
  category?: string;
  options?: Array<{
    name: string;
    value: string;
    price?: number;
  }>;
}

export interface Order {
  _id: string;
  user_id: string;
  cashier_order_id: string | null;
  address_id: string;
  payment_method: PaymentMethod;
  delivery_type: DeliveryType;
  delivery_status: DeliveryStatus;
  status: OrderStatus;
  shipping_fee: number;
  vat_amount: number;
  items_price: number;
  total_price: number;
  total_quantity: number;
  is_paid: boolean;
  paid_at: string | null;
  note: string | null;
  cancelled_reason: string | null;
  cancelled_at: string | null;
  returned_at: string | null;
  delivered_at: string | null;
  order_type: OrderType;
  createdAt: string;
  updatedAt: string;
  __v: number;
  delivery_time_type: DeliveryTimeType;
  scheduled_time: string | null;
  items?: OrderItem[];
  
  // Additional fields that might be populated
  address?: {
    address: string;
    name: string;
    phone: string;
  };
}

export interface OrdersResponse {
  orders: Order[];
  totalOrders: number;
  currentPage: number;
  totalPages: number;
}

export interface OrderDetailResponse {
  order: Order;
}

export interface CreateOrderRequest {
  address_id: string;
  payment_method: PaymentMethod;
  delivery_type: DeliveryType;
  note?: string;
  items: Array<{
    product_id: string;
    quantity: number;
    note?: string;
    options?: Array<{
      name: string;
      value: string;
    }>;
  }>;
  delivery_time_type: DeliveryTimeType;
  scheduled_time?: string;
  voucher_id?: string;
}

export interface CancelOrderRequest {
  order_id: string;
  cancelled_reason: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  delivery_status?: DeliveryStatus;
  startDate?: string;
  endDate?: string;
  sort?: 'createdAt' | 'total_price' | 'updatedAt';
  order?: 'asc' | 'desc';
}