import  mongoose, { FilterQuery } from "mongoose";
import Roles from "../models/RoleModel";
import  User, { IUser } from "../models/UserModel";

class SearchService{
    async searchUsers(keyword: string, page: number, pageSize: number) {
        try {
            const query = {
                $or: [
                    { userName: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },   
                    { phoneNumber: { $regex: keyword, $options: 'i' } } 
                ]
            };
    
            const skip = (page - 1) * pageSize;
    
            const [users, totalDocuments] = await Promise.all([
                User
                    .find(query)
                    .select('-password') 
                    .sort({ userName: 1 })
                    .skip(skip)
                    .limit(pageSize),
                User.countDocuments(query)
            ]);
    
            return {
                status: "SUCCESS",
                data: {
                    users,
                    metadata: {
                        total: totalDocuments,
                        page: page,
                        pageSize: pageSize,
                        totalPages: Math.ceil(totalDocuments / pageSize),
                    }
                }
            };
        } catch (error: any) {
            throw new Error(`Error searching users: ${error.message}`);
        }
    }
}


export default new SearchService();