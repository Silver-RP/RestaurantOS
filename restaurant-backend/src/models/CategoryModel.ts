import mongoose from 'mongoose';
 export interface ICategory extends Document {
    name: string;
    slug: string;
    image: string | null;
    cate_type: 'post' | 'food';
    parent_cate: string | null;
 }

    const categorySchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: false,
        },
        cate_type: {
            type: String,
            required: true,
            enum: ['post', 'food'],
        },
        parent_cate: {
            type: String,
            required: false,
        },
    });

    const Category = mongoose.model<ICategory>('categories', categorySchema);
    export default Category;