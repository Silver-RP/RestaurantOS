import mongoose from "mongoose"; 
import User from "../models/userModel";

class UserService{
    async getAllUser(): Promise<any>{
        try {
            const allUser = await User.find({}); 
            return {
                status: "OK", 
                message: "getAllUser success", 
                data: allUser
            }
        } catch (error: any) {
             throw new Error(error);             
        }

    }
}
export default new UserService(); 
