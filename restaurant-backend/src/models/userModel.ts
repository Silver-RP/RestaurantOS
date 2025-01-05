import mongoose, { Schema, Document , Model } from "mongoose"; 
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
    roles: string; 
    isEmailVerifided: boolean; 
    exprireAt: Date; 
    isVerified: boolean;
}

const userSchema = new mongoose.Schema({
    userName: {
        type: String, 
        required: false, 
        unique: true,
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
    Active_code: {
        type: Number, 
        required: false, 
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
    facebookId:{
        type: String, 
        required: false, 
    }, 
    roles: {
        type: String,
        required: false, 
        ref: "Role", 
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
    }
},{
    timestamps: true

})
const User = mongoose.model("User", userSchema);
export default User;