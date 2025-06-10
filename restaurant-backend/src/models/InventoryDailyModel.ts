import mongoose from 'mongoose';

export interface IInventoryDaily extends Document {
    inventory_date: Date;
    initial_quantity: number;
    imported_quantity: number;
    exported_quantity: number;
    actual_remaining_quantity: number;
    notes?: string;
    ingredient_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
  }
  
  const inventoryDailySchema = new mongoose.Schema({
    inventory_date: { type: Date, required: true },
    initial_quantity: { type: Number, required: true },
    imported_quantity: { type: Number, default: 0 },
    exported_quantity: { type: Number, default: 0 },
    actual_remaining_quantity: { type: Number, required: true },
    notes: { type: String },
    ingredient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }, { timestamps: true });
  
  inventoryDailySchema.index({ ingredient_id: 1, inventory_date: 1 }, { unique: true });
  
  inventoryDailySchema.pre('save', function(next) {
    const calculated = this.initial_quantity + this.imported_quantity - this.exported_quantity;
    if (this.actual_remaining_quantity !== calculated) {
      this.notes = `Warning: actual_remaining_quantity (${this.actual_remaining_quantity}) != calculated (${calculated})`;
    }
    next();
  });
  
  export const InventoryDaily = mongoose.model<IInventoryDaily>('InventoryDaily', inventoryDailySchema);
  