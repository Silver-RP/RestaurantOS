import { accessToken, refreshToken } from '../services/GenerateToken';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../@types/express';
import { IUser } from '../models/UserModel';
import Roles from '../models/RoleModel';
import mongoose from 'mongoose';

class AuthMiddleWare {
  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
      if (!token) {
        res.status(401).json({ message: 'Access token not provided' });
        return;
      }
      const user = jwt.verify(token, process.env.ACCESS_TOKEN as string) as IUser;
      req.user = user;
      next();
    } catch (err: any) {
      console.error('Token verification failed:', err.message);
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }
  }

  async verifyRefreshToken(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        return res.status(401).json({ message: 'Refresh token not found' });
      }
      const user = (await jwt.verify(token, process.env.REFRESH_TOKEN as string)) as IUser;
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
  }

  async verifyRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const user = req.user as IUser;
      if (!user.roles || user.roles.length === 0) {
        return res.status(401).json({ message: 'User role not found' });
      }
  
      const userRoles = await Roles.find({ _id: { $in: user.roles } }).lean();
      if (!userRoles || userRoles.length === 0) {
        return res.status(404).json({ message: 'Roles not found in database' });
      }
  
      const roleNames = userRoles.map((role: any) => role.name);
  
      const hasRole = roleNames.some((role: string) => roleNames.includes(role));
      if (hasRole) {
        return next(); 
      } else {
        return res.status(403).json({ message: 'Permission denied: Insufficient role' });
      }
    } catch (err: any) {
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
  
  
}

export default new AuthMiddleWare();
