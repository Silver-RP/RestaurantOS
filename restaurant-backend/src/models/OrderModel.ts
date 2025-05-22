import { Schema, model, Document, Types, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IOrder extends Document {
  user_id: Types.ObjectId;
  cashier_order_id?: Types.ObjectId | null;
  address_id: Types.ObjectId;
  payment_method: 'CASH' | 'BANKING' | 'VNPAY' | 'MOMO' | 'CREDIT_CARD';
  delivery_type: 'DELIVERY' | 'PICKUP';
  delivery_status:
    | 'PENDING_PICKUP'
    | 'PICKED_UP'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'DELIVERY_FAILED'
    | 'RETURN_REQUESTED'
    | 'RETURNED'
    | 'CANCEL_REQUESTED'
    | 'CANCELLED';
  status:
    | 'PENDING'
    | 'PREPARING'
    | 'SHIPPING'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'CANCEL_REQUESTED'
    | 'RETURNED';
  shipping_fee: number;
  vat_amount: number;
  items_price: number;
  total_price?: number;
  total_quantity: number;
  is_paid?: boolean;
  paid_at?: Date | null;
  note?: string;
  cancelled_reason?: string | null;
  cancelled_at?: Date | null;
  returned_at?: Date | null;
  delivered_at?: Date | null;
  order_type: 'DINE_IN' | 'ONLINE';
  delivery_time_type: 'ASAP' | 'SCHEDULED';
  scheduled_time?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cashier_order_id: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    address_id: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
    payment_method: {
      type: String,
      enum: ['CASH', 'BANKING', 'VNPAY', 'MOMO'],
      required: true,
    },
    delivery_type: {
      type: String,
      enum: ['DELIVERY', 'PICKUP'],
      required: true,
    },
    delivery_status: {
      type: String,
      enum: [
        'PENDING',
        'PENDING_PICKUP',
        'PICKED_UP',
        'IN_TRANSIT',
        'DELIVERED',
        'DELIVERY_FAILED',
        'RETURN_REQUESTED',
        'RETURNED',
        'CANCEL_REQUESTED',
        'CANCELLED',
      ],
      default: 'PENDING_PICKUP',
    },
    status: {
      type: String,
      enum: [
        'PENDING',
        'PREPARING',
        'SHIPPING',
        'COMPLETED',
        'CANCELLED',
        'CANCEL_REQUESTED',
        'RETURNED',
      ],
      default: 'PENDING',
    },
    shipping_fee: { type: Number, required: true, default: 0 },
    vat_amount: { type: Number, required: true, default: 0 },
    items_price: { type: Number, required: true, default: 0 },
    total_price: { type: Number, default: 0 },
    total_quantity: { type: Number, required: true, default: 0 },
    is_paid: { type: Boolean, default: false },
    paid_at: { type: Date, default: null },
    note: { type: String, default: null },
    cancelled_reason: { type: String, default: null },
    cancelled_at: { type: Date, default: null },
    returned_at: { type: Date, default: null },
    delivered_at: { type: Date, default: null },
    order_type: { type: String, enum: ['DINE_IN', 'ONLINE'], required: true },
    delivery_time_type: {
      type: String,
      enum: ['ASAP', 'SCHEDULED'],
      required: true,
    },
    scheduled_time: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

OrderSchema.plugin(mongoosePaginate);
export type OrderDocument = PaginateModel<IOrder>;
export const Order = model<IOrder, OrderDocument>('Order', OrderSchema);
