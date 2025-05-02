'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const mongoose_paginate_v2_1 = __importDefault(require('mongoose-paginate-v2'));
const userSchema = new mongoose_1.default.Schema(
  {
    username: { type: String, trim: true },
    email: { type: String, unique: true, trim: true },
    password: { type: String },
    birthday: { type: Date },
    avatar: { type: String },
    phone: { type: String, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationOtp: { type: String },
    emailVerificationOtpExpiry: { type: Date },
    changePasswordOtp: { type: String },
    changePasswordOtpExpiry: { type: Date },
    phoneOtp: { type: String },
    phoneOtpExpiry: { type: Date },
    googleId: { type: String },
    roles: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Roles' }],
    gender: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'block'],
    },
    default_address_id: {
      type: mongoose_1.default.Schema.Types.ObjectId,
      ref: 'Address',
    },
    otpVerifiedForChangePassword: { type: Boolean, default: false },
    expireAt: { type: Date },
    otpSentCount: { type: Number, default: 0 },
    lastOtpSentAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.emailVerificationOtp;
        delete ret.emailVerificationOtpExpiry;
        delete ret.changePasswordOtp;
        delete ret.changePasswordOtpExpiry;
        delete ret.phoneOtp;
        delete ret.phoneOtpExpiry;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.emailVerificationOtp;
        delete ret.emailVerificationOtpExpiry;
        delete ret.changePasswordOtp;
        delete ret.changePasswordOtpExpiry;
        delete ret.phoneOtp;
        delete ret.phoneOtpExpiry;
        delete ret.__v;
        return ret;
      },
    },
  },
);
userSchema.plugin(mongoose_paginate_v2_1.default);
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
