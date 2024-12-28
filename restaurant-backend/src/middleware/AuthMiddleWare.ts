import { accessToken, refreshToken } from "../services/generateToken";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
class AuthMiddleWare {
    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) return res.sendStatus(401);
            jwt.verify(token, process.env.ACCESS_TOKEN as string, (err: any, user: any) => {
                if (err) return res.sendStatus(403);
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

     async checkRole(requiredRole: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.sendStatus(401); 
            }

            const userRole = req.user;
            if (userRole !== requiredRole) {
                return res.sendStatus(403); 
            }

            next();
        };
    }

    
}
export default new AuthMiddleWare(); 
