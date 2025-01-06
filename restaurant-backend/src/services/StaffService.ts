
import  mongoose, { FilterQuery } from "mongoose";
import Roles from "../models/RoleModel";
import  User, { IUser } from "../models/UserModel";


class StaffService{
    
    async getAllStaff(page: number, pageSize: number): Promise<any> {
        try {
            const userRole = await Roles.findOne({ name: "user" });
            if (!userRole) {
                return {
                    status: "Error",
                    message: "Role 'user' not found"
                };
            }
    
            const query = { roles: { $ne: userRole._id } };
            console.log("query", query);
    
            const options = {
                page,
                limit: pageSize,
                select: "-password -otp -otpExpiry -googleId -facebookId -roles -default_address_id -isEmailVerifided -exprireAt -isVerified",
                sort: { createdAt: -1 }, 
                populate: {
                    path: 'roles',  
                    select: 'name', 
                },
            };
    
            const allStaff = await User.paginate(query, options);
            console.log("allStaff", allStaff);
            return {
                status: "SUCCESS",
                data: allStaff.docs,
                metadata: {
                    total: allStaff.totalDocs,
                    page: allStaff.page,
                    pageSize: allStaff.limit,
                    totalPages: allStaff.totalPages
                }
            };
        } catch (error: any) {
            throw new Error(`Error fetching staff: ${error.message}`);
        }
    }

    async createStaff(staff: IUser): Promise<IUser> {
        try {
            const user = new User(staff);
            user.roles = await Roles.findOne({ name: "staff" });
            return await user.save();
        }catch(error: any){
            throw new Error(`Error creating staff: ${error.message}`);
        }
    

   
}





export default new StaffService(); 