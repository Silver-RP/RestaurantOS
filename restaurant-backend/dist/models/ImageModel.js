"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    width: Number,
    height: Number,
    url: { type: String, required: true },
    default_image: { type: Boolean, default: false },
    image_type: { type: String, enum: ['Dish', 'Post'], required: true },
    dish_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Dish' },
    post_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' }
});
imageSchema.index({ dish: 1 });
const Image = (0, mongoose_1.model)('Image', imageSchema);
