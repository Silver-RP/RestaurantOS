import { Schema, model, Document, Types } from 'mongoose';

export interface IAddress extends Document {
  user_id: Types.ObjectId;
  full_name: string;
  phone: string;
  province: string;
  district: string;
  street_address: string;
  address_type: 'HOME' | 'WORK' | 'OTHER';
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    street_address: { type: String, required: true },
    address_type: {
      type: String,
      enum: ['HOME', 'WORK', 'OTHER'],
      default: 'HOME',
    },
  },
  { timestamps: true },
);

export const Address = model<IAddress>('Address', AddressSchema);
