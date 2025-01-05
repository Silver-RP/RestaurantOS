import { accessToken, refreshToken } from "../services/generateToken";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
class AuthMiddleWare {
    // async verifyToken(req: Request, res: Response, next: NextFunction): Promise<any> {
    //     try {
    //         const authHeader = req.headers['authorization'];
    //         const token = authHeader && authHeader.split(' ')[1];
    //         if (token == null) return res.sendStatus(401);
    //         jwt.verify(token, process.env.ACCESS_TOKEN as string, (err: any, user: any) => {
    //             if (err) return res.sendStatus(403);
    //             next();
    //         });
    //     } catch (error: any) {
    //         throw new Error(error);
    //     }
    // }
    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            
            if (token == null) {
                return res.sendStatus(401); // Token không tồn tại -> gửi phản hồi và dừng
            }
    
            jwt.verify(token, process.env.ACCESS_TOKEN as string, (err: any, user: any) => {
                if (err) {
                    return res.sendStatus(403); // Token không hợp lệ -> gửi phản hồi và dừng
                }
                
                req.user = user; // Lưu thông tin người dùng vào req
                next(); // Gọi middleware tiếp theo
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message }); // Xử lý lỗi và gửi phản hồi
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
    verifyRole(roles: string[]) {
        return (req: Request, res: Response, next: NextFunction): void => {
            if (!req.user) {
                res.status(403).json({ message: "User not authenticated" });
            }
            // Kiểm tra xem user có quyền truy cập không
            const userRole = req.body.roles; // Giả sử thông tin vai trò người dùng được lưu trong token
            
            if (!roles.includes(userRole)) {
                res.status(403).json({ message: "You do not have permission to access this resource" });
            }
            
            next(); // Nếu người dùng có quyền, tiếp tục
        };
    }


}
export default new AuthMiddleWare(); 
