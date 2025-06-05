import mongoose from 'mongoose';

export interface IIngredient extends mongoose.Document {
  name: string;
  unit: string;
  price_per_unit: number;
}

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  price_per_unit: { type: Number, required: true },
});

ingredientSchema.index({ name: 1 }, { unique: true });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
