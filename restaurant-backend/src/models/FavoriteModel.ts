import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
  },
  {
    timestamps: true, 
  },
);

favoriteSchema.index({ userId: 1, foodId: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);
