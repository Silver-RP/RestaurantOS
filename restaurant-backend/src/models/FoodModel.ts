import mongoose from 'mongoose';
export interface IProduct extends mongoose.Document {
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
    countInStock: number;
    rating: number;
    categories: mongoose.Schema.Types.ObjectId[]; 
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
    }, 
    categories: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'categories',
        ObjectId: true, 
        required: true
    }]

},{
    timestamps: true, 
});
foodSchema.index({name: "text"});

export const Food = mongoose.model<IProduct>("Food", foodSchema);