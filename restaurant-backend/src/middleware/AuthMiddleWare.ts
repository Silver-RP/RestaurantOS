import { accessToken, refreshToken } from "../services/GenerateToken";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../@types/express";
import { IUser } from "../models/UserModel"; 
import Roles from "../models/RoleModel"; 
import mongoose from "mongoose";
class AuthMiddleWare {
  async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) return res.sendStatus(401);
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN as string,
        (err: any, user: any) => {
          if (err) return res.sendStatus(403);
          req.user = user;
          next();
        },
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async verifyRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const refreshToken = req.body.token;
      if (refreshToken == null) return res.sendStatus(401);
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN as string,
        (err: any, user: any) => {
          if (err) return res.sendStatus(403);
          next();
        },
      );
    } catch (error: any) {
      throw new Error(error);
    }
    
  
  
    
    
    }
    async verifyRole(roles: string[]): any {
      return async (req: Request, res: Response, next: NextFunction) => {
          try {
              if (!req.user) {
                  return res.status(401).json({ message: "User not authenticated" });
              }
  
              const user = req.user as IUser;
              console.log('User in req:', user);
  
              if (!user.roles || user.roles.length === 0) {
                  return res.status(401).json({ message: "User role not found" });
              }
  
              // Chuyển các role string thành ObjectId của Mongoose
              const roleObjectIds = roles.map(role => new mongoose.Types.ObjectId(role));
  
              // Chuyển user roles thành chuỗi để so sánh
              const userRoleIds = user.roles.map(role => role.toString());  // Convert ObjectId to string
  
              // So sánh các ObjectId trong user với roleObjectIds
              const isRoleValid = userRoleIds.some(role => roleObjectIds.some(roleId => roleId.toString() === role));
  
              if (isRoleValid) {
                  return next(); // Nếu có quyền, tiếp tục
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
