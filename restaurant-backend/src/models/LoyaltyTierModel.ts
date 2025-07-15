import mongoose, { Document, Schema } from 'mongoose';

export interface ILoyaltyTier extends Document {
  tier_name: 'bronze' | 'silver' | 'gold' | 'diamond';
  min_spent: number; // Tổng tiền đã chi tối thiểu để đạt tier này
  discount: number;
  benefits: string;
  sort_order: number;
}

const LoyaltyTierSchema = new Schema<ILoyaltyTier>({
  tier_name: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'diamond'],
    required: true,
    unique: true,
  },
  min_spent: { type: Number, required: true },
  discount: { type: Number, required: true, default: 0 },
  benefits: { type: String, required: false },
  sort_order: { type: Number, required: true },
});

export default mongoose.model<ILoyaltyTier>('LoyaltyTier', LoyaltyTierSchema); 