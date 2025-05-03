import mongoose, { Schema, Document, Model, Types } from 'mongoose';
export interface ICart extends Document {
  userId: Types.ObjectId;
  items: {
    dishId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: 'pending' | 'checked_out' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
const cartSchema = new mongoose.Schema<ICart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        dishId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Dish',
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'checked_out', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const Cart: mongoose.Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);
export default Cart;
