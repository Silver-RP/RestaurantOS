'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Food = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const foodSchema = new mongoose_1.default.Schema(
  {
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
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    favorites: {
      type: Number,
      required: true,
    },
    categories: [
      {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'categories',
        ObjectId: true,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);
foodSchema.index({ name: 'text' });
exports.Food = mongoose_1.default.model('Food', foodSchema);
