export type Status =
  | 'ORDER_PLACED'
  | 'ORDER_CONFIRMED'
  | 'PENDING_PICKUP'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'DELIVERY_FAILED'
  | 'RETURN_REQUESTED'
  | 'RETURN_APPROVED'
  | 'RETURN_REJECTED'
  | 'RETURNED'
  | 'CANCELLED';

export type PaymentMethod =
  | 'CASH'
  | 'CREDIT_CARD'
  | 'BANK_TRANSFER'
  | 'MOMO'
  | 'ZALOPAY';

export type DeliveryType = 'DELIVERY' | 'PICKUP';

export type OrderType = 'ONLINE' | 'IN_STORE';

export type DeliveryTimeType = 'ASAP' | 'SCHEDULED';

export interface Dish {
  _id: string;
  name: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  price: number;
  discount_price?: number;
  slug: string;
  images: string[];
  status: string;
  views: number;
  ordered_count: number;
  average_rating: number;
  rating_count: number;
  favorites_count: number;
  rating: number;
  categories: string[];
  countInStock: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  discountUntil?: string | null;
  isNew: boolean;
  newUntil?: string | null;
  totalSoldQuantity: number;
  recommend: boolean;
}

export interface OrderItem {
  _id: string;
  order_id: string;
  dish_id: Dish;
  dish_name: string;
  dish_images: string[];
  categories: string[];
  unit_price: number;
  quantity: number;
  total_amount: number;
  dish_slug: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  roles: string[];
  otpVerifiedForChangePassword: boolean;
  otpSentCount: number;
  lastOtpSentAt: string;
  createdAt: string;
  updatedAt: string;
  birthday: string;
  gender: string;
  status: string;
}

export interface Order {
  postPayment: {
    redirectUrl?: string;
    bankingInfo?: {
      accountNumber: string;
      accountName: string;
      bankName: string;
    };
  };
  _id: string;
  user_id: User; // Sửa từ string thành User
  address_id: {
    _id: string;
    user_id: string;
    full_name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street_address: string;
    address_type: string;
    is_default: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
  } | null; // Cho phép null
  cashier_order_id: string | null;
  payment_method: string;
  delivery_type: string;
  delivery_status: string;
  status: string;
  shipping_fee: number;
  vat_amount: number;
  items_price: number;
  total_price: number;
  total_quantity: number;
  payment_status?: 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';
  paid_at: string | null;
  note: string | null;
  receiver: string | null;
  receiver_phone: string | null;
  cancelled_reason: string | null;
  cancelled_at: string | null;
  returned_at: string | null;
  delivered_at: string | null;
  order_type: string;
  delivery_time_type: string;
  scheduled_time: string | null;
  createdAt: string;
  updatedAt: string;
  order_items?: OrderItem[] | undefined;
  __v: number;
  discount_amount?: number;
  discount?: number;
  voucher_code?: string;
}

export interface OrdersResponse {
  message: string;
  orders: Order[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  filters?: { [key: string]: string };
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
  filters?: Record<string, string | number | boolean>;
  status?: Status[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  searchTerm?: string;
  sortType?: 'newest' | 'oldest';
}

export interface PlaceOrderRequest {
  payment_method: 'CASH' | 'BANKING' | 'VNPAY' | 'MOMO' | 'CREDIT_CARD';
  delivery_type: DeliveryType;
  order_type: OrderType;
  delivery_time_type: DeliveryTimeType;
  address?: {
    full_name: string;
    phone: string;
    ward: string;
    province: string;
    district: string;
    street_address: string;
  };
  address_id?: string;
  note?: string;
  voucher_id?: string;
  shipping_fee?: number;
  scheduled_time?: string;
  receiver?: string;
  receiver_phone?: string;
  items: Array<{
    dish_id: string;
    quantity: number;
    note?: string;
  }>;
  discount_amount?: number;
}

export interface AllOrder {
  _id: string;
  user_id: {
    _id: string;
    username: string;
    email: string;
    phone: string;
    isEmailVerified: boolean;
    roles: string[];
    otpVerifiedForChangePassword: boolean;
    otpSentCount: number;
    lastOtpSentAt: string;
    createdAt: string;
    updatedAt: string;
    birthday: string;
    gender: string;
    status: string;
  };
  address_id: {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street_address: string;
    address_type: string;
    is_default: boolean;
    lat: number;
    lon: number;
    createdAt: string;
    updatedAt: string;
  } | null; // Cho phép null
  cashier_order_id: string | null;
  payment_method: string;
  delivery_type: string;
  delivery_status: string;
  status: string;
  shipping_fee: number;
  vat_amount: number;
  items_price: number;
  total_price: number;
  discount?: number;
  total_quantity: number;
  paid_at: string | null;
  payment_status?: string; // Thêm trường payment_status (tùy chọn)
  note: string | null;
  receiver: string | null;
  receiver_phone: string | null;
  cancelled_reason: string | null;
  cancelled_at: string | null;
  returned_at: string | null;
  delivered_at: string | null;
  order_type: string;
  delivery_time_type: DeliveryTimeType;
  scheduled_time: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
