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
    
  
   verifyRole(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          res.status(401).json({ message: "User not authenticated" });
          return;
        }

        const user = req.user as IUser;
        if (!user.roles || user.roles.length === 0) {
          res.status(401).json({ message: "User role not found" });
          return;
        }

        // Kiểm tra các vai trò của người dùng có tồn tại trong database hay không
        const userRoles = await Roles.find({
          _id: { $in: user.roles }
        }).lean(); // Sử dụng lean() để nhận dữ liệu dưới dạng JSON thuần

        if (!userRoles || userRoles.length === 0) {
          res.status(401).json({ message: "No valid roles found" });
          return;
        }

        // Kiểm tra xem người dùng có quyền hợp lệ không
        const roleNames = userRoles.map((role: any) => role.name); // Lấy tên của các vai trò
        const hasRole = roles.some(role => roleNames.includes(role)); // Kiểm tra vai trò

        if (hasRole) {
          return next(); 
        } else {
          res.status(403).json({ message: "Permission denied: Insufficient role" });
          return;
        }
      } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
        return;
      }
    };
  }
  
  }
export default new AuthMiddleWare(); 
