"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const mongoose_1 = require("mongoose");
const AddressSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    street_address: { type: String, required: true },
    address_type: {
        type: String,
        enum: ['HOME', 'WORK', 'OTHER'],
        default: 'HOME',
    },
    is_default: { type: Boolean, default: false },
    lat: { type: Number },
    lon: { type: Number },
}, { timestamps: true });
AddressSchema.index({ user_id: 1, is_default: 1 }, { unique: true, partialFilterExpression: { is_default: true } });
AddressSchema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Address = (0, mongoose_1.model)('Address', AddressSchema);
