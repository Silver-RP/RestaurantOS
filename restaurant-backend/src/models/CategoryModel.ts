import mongoose from 'mongoose';
 export interface ICategory extends Document {
    name: string;
    image: string | null;
    classify: 'post' | 'food';
    sub: string | null;
 }

    const categorySchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: false,
        },
        classify: {
            type: String,
            required: true,
            enum: ['post', 'food'],
        },
        sub: {
            type: String,
            required: false,
        },
    });

    const Category = mongoose.model<ICategory>('categories', categorySchema);
    export default Category;