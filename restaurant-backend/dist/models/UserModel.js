"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: false,
    },
    birthday: {
        type: Date,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
        unique: true,
    },
    otp: {
        type: String,
        required: false,
    },
    otpExpiry: {
        type: Date,
        required: false,
    },
    googleId: {
        type: String,
        required: false,
    },
    roles: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Roles',
            required: false,
        },
    ],
    gender: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
        enum: ['active', 'inactive', 'block'],
    },
    default_address_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Address',
        required: false,
    },
    expireAt: {
        type: Date,
        required: false,
    },
    isVerified: {
        type: Boolean,
        required: false,
    },
    otpSentCount: {
        type: Number,
        default: 0,
    },
    lastOtpSentAt: {
        type: Date,
        default: Date.now,
    },
    confirmPassword: {
        type: String,
        required: false,
    },
    emailVerificationToken: {
        type: String,
        required: false
    },
    // emailVerificationToken: dùng để xác thực email qua link 
    emailVerificationExpires: {
        type: Date,
        required: false
    },
    // emailVerificationExpires	: thời gian hết hạn của token xác thực email
}, {
    timestamps: true,
});
userSchema.plugin(mongoose_paginate_v2_1.default);
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
