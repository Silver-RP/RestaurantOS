import { Schema, model, Types } from 'mongoose';
import { IAddress } from '../types/address.type';

const AddressSchema = new Schema<IAddress>(
  {
    user_id: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },

    province: { type: String, required: true },
    district: { type: String }, 
    ward: { type: String, required: true },
    street_address: { type: String, required: true },

    postcode: { type: String }, 
    display_name: { type: String }, 

    address_type: {
      type: String,
      enum: ['HOME', 'WORK', 'OTHER'],
      default: 'HOME',
    },
    is_default: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Chỉ cho phép 1 địa chỉ mặc định cho mỗi user
AddressSchema.index(
  { user_id: 1, is_default: 1 },
  { unique: true, partialFilterExpression: { is_default: true } },
);

// Định dạng khi trả JSON
AddressSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Address = model<IAddress>('Address', AddressSchema);
