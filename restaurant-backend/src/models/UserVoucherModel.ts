import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserVoucher extends Document {
  user_id: Types.ObjectId;
  voucher_id: Types.ObjectId;
  used_at?: Date;
<<<<<<< Updated upstream
  status: 'saved' | 'used' | 'expired' | 'out_of_stock';
=======
  status: 'saved' | 'used' | 'expired';
>>>>>>> Stashed changes
}
const UserVoucherSchema = new Schema<IUserVoucher>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    voucher_id: { type: Schema.Types.ObjectId, ref: 'Voucher', required: true },
    used_at: { type: Date, default: null },
<<<<<<< Updated upstream
    status: { type: String, enum: ['saved', 'used', 'expired', 'out_of_stock'], required: true },
=======
    status: { type: String, enum: ['saved', 'used', 'expired'], required: true },
>>>>>>> Stashed changes
  },
  {
  timestamps: true,
});

export default mongoose.model<IUserVoucher>('UserVoucher', UserVoucherSchema); 