"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuery = buildQuery;
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
function buildQuery(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {};
        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
            ];
        }
        if (filters.category) {
            const categoryDoc = yield CategoryModel_1.default.findOne({ Cate_slug: filters.category }).lean();
            if (categoryDoc) {
                query.categories = { $in: [categoryDoc._id] };
            }
            else {
                query.categories = { $in: [] };
            }
        }
        const priceRange = parseNumberRange(filters.priceMin, filters.priceMax);
        if (priceRange !== undefined)
            query.price = priceRange;
        const discountRange = parseNumberRange(filters.discountMin, filters.discountMax);
        if (discountRange !== undefined)
            query.discount_price = discountRange;
        const stockRange = parseNumberRange(filters.stockMin, filters.stockMax);
        if (stockRange !== undefined)
            query.countInStock = stockRange;
        const viewsRange = parseNumberRange(filters.viewsMin, filters.viewsMax);
        if (viewsRange !== undefined)
            query.views = viewsRange;
        const orderedRange = parseNumberRange(filters.orderedMin, filters.orderedMax);
        if (orderedRange !== undefined)
            query.ordered_count = orderedRange;
        const ratingRange = parseNumberRange(filters.ratingMin, filters.ratingMax);
        if (ratingRange !== undefined)
            query.average_rating = ratingRange;
        if (filters.status !== undefined) {
            query.status = filters.status;
        }
        return query;
    });
}
function parseNumberRange(min, max) {
    const range = {};
    if (min !== undefined && !isNaN(Number(min)))
        range.$gte = Number(min);
    if (max !== undefined && !isNaN(Number(max)))
        range.$lte = Number(max);
    return Object.keys(range).length > 0 ? range : undefined;
}
