import mongoose, { Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IIngredient extends Document {
  name: string;
  unit: string;
  slug?: string;
  price_per_unit: number;
  lowStockThreshold?: number;
  isDeleted: boolean;
  deletedAt: Date | null;
}

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  price_per_unit: { type: Number, required: true, min: 0 },
  lowStockThreshold: { type: Number, default: 0, min: 0 },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

ingredientSchema.index({ name: 1 }, { unique: true });
ingredientSchema.plugin(mongoosePaginate);

export type IngredientModel = PaginateModel<IIngredient>;

const Ingredient = mongoose.model<IIngredient, IngredientModel>('Ingredient', ingredientSchema);

export default Ingredient;
