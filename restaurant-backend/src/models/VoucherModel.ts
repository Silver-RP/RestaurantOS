import mongoose, { Document, Schema } from 'mongoose';

export interface IVoucher extends Document {
  code: string;
  description?: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  max_discount_value?: number;
  min_order_value?: number;
  quantity: number;
  used: number;
  start_date?: Date;
  end_date?: Date;
  status: 'active' | 'inactive' | 'expired' | 'out_of_stock';
  created_at?: Date;
  updated_at?: Date;
}

const VoucherSchema = new Schema<IVoucher>(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discount_type: { type: String, required: true, enum: ['percent', 'fixed'] },
    discount_value: { type: Number, required: true },
    max_discount_value: { type: Number },
    min_order_value: { type: Number },
    quantity: { type: Number, required: true },
    used: { type: Number, default: 0 },
    start_date: { type: Date, required: false },
    end_date: { type: Date, required: false },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'out_of_stock'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model<IVoucher>('Voucher', VoucherSchema);