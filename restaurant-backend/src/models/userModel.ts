import mongoose, { Schema, Document } from "mongoose"; 
export interface IUser extends Document {
    userName: string; 
    email: string; 
    password: string; 
    birthday?: Date; 
    avatar?: string; 
    phone: String; 
    Active_code?: number; 
    isAdmin: boolean; 
    isCashier: boolean; 
    googId: string; 
    facebookId: string; 
}
const userSchema: Schema = new Schema({
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
        required: false, 
    },
    Active_code: {
        type: Number, 
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
        required: true, 
    }
},{
    timestamps: true

})
const User = mongoose.model<IUser>("User", userSchema); 
export default User;