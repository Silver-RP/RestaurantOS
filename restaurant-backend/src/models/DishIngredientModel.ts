import mongoose from 'mongoose';

export interface IDishIngredient extends mongoose.Document {
    dishId: mongoose.Schema.Types.ObjectId
    ingredientId: mongoose.Schema.Types.ObjectId
    quantity: number
    unit: string
  }
  

const dishIngredientSchema = new mongoose.Schema({
    dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
    ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
  })
  
  const DishIngredient = mongoose.model('DishIngredient', dishIngredientSchema)
  