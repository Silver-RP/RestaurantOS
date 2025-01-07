import mongoose from 'mongoose';
export interface IProduct extends mongoose.Document {
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
    countInStock: number;
    rating: number;
    categories: string; 
    favorites: number; 
}
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
    },
    favorites: {
        type: Number, 
        required: true, 
    }

});
export const Food = mongoose.model<IProduct>("Food", foodSchema);