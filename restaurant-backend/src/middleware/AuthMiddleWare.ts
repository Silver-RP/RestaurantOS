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

  verifyRole(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ message: 'User not authenticated' });
          return;
        }
  
        const user = req.user as IUser;
        if (!user.roles || user.roles.length === 0) {
          res.status(401).json({ message: 'User role not found' });
          return;
        }
  
        const userRoles = await Roles.find({ _id: { $in: user.roles } }).lean();
        const roleNames = userRoles.map((role: any) => role.name);
        const hasRole = roles.some((role) => roleNames.includes(role));
        
        if (hasRole) {
          next();
        } else {
          res.status(403).json({ message: 'Permission denied: Insufficient role' });
        }
      } catch (err: any) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
      }
    };
  }
  
}

export default new AuthMiddleWare();
