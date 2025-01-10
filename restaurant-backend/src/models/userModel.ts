import mongoose, { Schema, Document , Model } from "mongoose"; 
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IUser extends Document {
    userName: string;
    email: string;
    password: string | null;
    birthday?: Date | null;
    avatar?: string | null;
    phone: string | null;
    Active_code?: number | null;
    googleId?: string | null;
    facebookId?: string | null;
    otp?: string | null;
    otpExpiry?: Date | null;
    roles?: mongoose.Schema.Types.ObjectId[]; 
    gender?: string | null;
    status?: string | null;
    default_address_id?: mongoose.Schema.Types.ObjectId[]; 
    isEmailVerifided: boolean; 
    otpSentCount: number;
    expireAt: Date; 
    isVerified: boolean;
    lastOtpSentAt: Date; 
}

const userSchema = new mongoose.Schema({
    userName: {
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
    roles: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Roles', 
        required: false,
    }, 
    gender: {
        type: String, 
        required: false, 
    },
    status: {
        type: String, 
        required: true, 
        enum: ["active", "inactive", "block"],
    },
    default_address_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Address', 
        required: false
    },
    isEmailVerifided: {
        type: Boolean, 
        required: false, 
        default: false, 
    }, 
    exprireAt: {
        type: Date,
        required: false, 
    }, 
    isVerified: {
        type: Boolean, 
        required: false,
    }, 
    otpSentCount: {
        type: Number, 
        default: 0. 
    }, 
    lastOtpSentAt: {
        type: Date, 
        default: Date.now, 
    }
},{
    timestamps: true

})

userSchema.plugin(mongoosePaginate);

export type UserModel = mongoose.PaginateModel<IUser>;

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;