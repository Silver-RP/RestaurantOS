import mongoose from 'mongoose';

export interface IInventoryAdjustment extends Document {
    adjustment_date: Date;
    estimated_quantity: number;
    actual_quantity: number;
    difference: number;
    reason: string;
    daily_inventory_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
}

const inventoryAdjustmentSchema = new mongoose.Schema(
    {
        adjustment_date: { type: Date, required: true },
        estimated_quantity: { type: Number, required: true },
        actual_quantity: { type: Number, required: true },
        difference: { type: Number, required: true },

        reason: { type: String },

        daily_inventory_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DailyInventory',
            required: true,
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true },
);


const InventoryAdjustment = mongoose.model<IInventoryAdjustment>('InventoryAdjustment', inventoryAdjustmentSchema);

export default InventoryAdjustment;


/*
Ingredient:

name
unit
price_per_unit


InventoryAdjustment:

Adjustment_date
Estimated_quantity
Actual_quantity
Difference
Reason
Created_at
Updated_at
User_id
DailyIngredient_id
Ingredient_id 


DailyInventory:

Inventory_date (Ngày nhập)
Initial_quantity 
(Số lượng hiện tại ngày hôm đó)
Imported_quantity (Sl nhập)
Exported_quantity (Sl xuất)
Actual_remaining_quantity
(Thực tế khó còn lại)
Notes
Created_at
Updated_at
Ingredient_id
User_id


InventoryTransaction: 

Transaction_type
Quantity
Transaction_date
Notes
Created_at
Updated_at
Ingredient_id
User_id
Adjustment_id (nullable)


*/