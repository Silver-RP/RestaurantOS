import mongoose, { Schema, Document , Model } from "mongoose"; 
export interface IUser extends Document {
    userName: string;
    email: string;
    password: string | null;
    birthday?: Date | null;
    avatar?: string | null;
    phone: string | null;
    Active_code?: number | null;
    isAdmin: boolean;
    isCashier: boolean;
    googleId?: string | null;
    facebookId?: string | null;
    otp?: string | null;
    otpExpiry?: Date | null;
}

const userSchema = new mongoose.Schema({
    userName: {
        type: String, 
        required: true, 
        unique: true,
        trim: true, 
    }, 
    email: {
        type: String, 
        required: true, 
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
        required: true, 
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
    isAdmin: {
        type: Boolean, 
        required: true, 
        default: false, 
    },
    isCashier: {
        type: Boolean, 
        required: true, 
        default: false, 
    },
    googleId: {
        type: String, 
        required: false, 
    }, 
    facebookId:{
        type: String, 
        required: false, 
    }
},{
    timestamps: true

})
console.log(typeof userSchema); 
const User = mongoose.model("User", userSchema);
export default User;