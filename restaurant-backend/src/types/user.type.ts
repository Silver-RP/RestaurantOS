import mongoose from "mongoose";

export interface IUser extends Document {
  id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string | null;
  birthday?: Date | null;
  avatar?: string | null;
  phone: string | null;
  googleId?: string | null;
  isEmailVerified: boolean;
  emailVerificationOtp?: string | null;
  emailVerificationOtpExpiry?: Date | null;
  changePasswordOtp?: string | null;
  changePasswordOtpExpiry?: Date | null;
  phoneOtp?: string | null;
  phoneOtpExpiry?: Date | null;
  roles?: mongoose.Schema.Types.ObjectId[];
  gender?: string | null;
  status?: string | null;
  default_address_id?: mongoose.Schema.Types.ObjectId[];
  expireAt: Date;
  otpSentCount: number;
  lastOtpSentAt: Date;
  otpVerifiedForChangePassword: boolean;
  isOnline: boolean;
}