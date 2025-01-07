import { accessToken, refreshToken } from "../services/generateToken";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../@types/express";
import { IUser } from "../models/UserModel"; 
import Roles from "../models/RoleModel"; 
class AuthMiddleWare {
    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) return res.sendStatus(401);
            jwt.verify(token, process.env.ACCESS_TOKEN as string, (err: any, user: any) => {
                if (err) return res.sendStatus(403);
                req.user = user;
                next();
            });

        } catch (error: any) {
            throw new Error(error);
        }
    }
    
    
    async verifyRefreshToken(req: Request, res: Response, next: NextFunction): Promise<any>{
        try {
            const refreshToken = req.body.token;
            if (refreshToken == null) return res.sendStatus(401);
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN as string, (err: any, user: any) => {
                if (err) return res.sendStatus(403);
                next();
            });
        } catch (error: any) {
            throw new Error(error);
        }
    }
    // verifyRole(roles: string[]): any {
    //     return async (req: Request, res: Response, next: NextFunction) => {
    //         try {
               
    //             // Đảm bảo rằng req.user đã được gán sau khi jwt.verify() hoàn tất
    //             if (!req.user) {
    //                 return res.status(401).json({ message: "User not authenticated" });
    //             }
    
    //             const user = req.user as IUser;
    //             console.log('User in req:', user);  // Log thông tin người dùng để kiểm tra
    
    //             // Kiểm tra xem người dùng có vai trò không
    //             if (!user.roles) {
    //                 return res.status(401).json({ message: "User role not found" });
    //             }
    
    //             // Kiểm tra quyền truy cập theo vai trò
    //             const role = await Roles.findOne({ role: user.roles }).exec();

    //             if (!role) {
    //                 return res.status(404).json({ message: "Role not found" });
    //             }
    
    //             // Kiểm tra trực tiếp vai trò trong token
    //             if (roles.includes(user.roles)) {
    //                 return next();  // Vai trò hợp lệ, cho phép truy cập
    //             } else {
    //                 return res.status(403).json({ message: "Permission denied: Insufficient role" });
    //             }
    
    //         } catch (error: any) {
    //             return res.status(500).json({ message: "Internal server error", error: error.message });
    //         }
    //     };
    // }
    verifyRole(roles: string[]): any {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Đảm bảo rằng req.user đã được gán sau khi jwt.verify() hoàn tất
                if (!req.user) {
                    return res.status(401).json({ message: "User not authenticated" });
                }
    
                const user = req.user as IUser;
                console.log('User in req:', user);  
               
                if (!user.roles || user.roles.length === 0) {
                    return res.status(401).json({ message: "User role not found" });
                }
    
                if (roles.some(role => user.roles.includes(role))) {
                    return next(); 
                } else {
                    return res.status(403).json({ message: "Permission denied: Insufficient role" });
                }
    
            } catch (error: any) {
                return res.status(500).json({ message: "Internal server error", error: error.message });
            }
        };
    }
    
    
    }
export default new AuthMiddleWare(); 
