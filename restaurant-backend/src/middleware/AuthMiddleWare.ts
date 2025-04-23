import { accessToken, refreshToken } from '../services/GenerateToken';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../@types/express';
import { IUser } from '../models/UserModel';
import Roles from '../models/RoleModel';
import mongoose from 'mongoose';

class AuthMiddleWare {
  async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const authHeader = req.headers['authorization'];
      const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
  
      if (!token) {
        return res.status(401).json({ message: 'Access token not provided' });
      }
  
      jwt.verify(token, process.env.ACCESS_TOKEN as string, (err: any, user: any) => {
        if (err) {
          console.error('Token verification failed:', err);
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
  
        req.user = user;
        next();
      });
    } catch (error: any) {
      return res.status(500).json({ message: 'Token middleware error', error: error.message });
    }
  }
  async verifyRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const token = req.cookies.refreshToken;
      if (!token)
        return res.status(401).json({ message: 'Refresh token not found' });

      jwt.verify(
        token,
        process.env.REFRESH_TOKEN as string,
        (err: any, user: any) => {
          if (err)
            return res
              .status(403)
              .json({ message: 'Invalid or expired refresh token' });
          req.user = user;
          next();
        },
      );
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  verifyRole(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
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
        const userRoles = await Roles.find({
          _id: { $in: user.roles },
        }).lean();
        if (!userRoles || userRoles.length === 0) {
          res.status(401).json({ message: 'No valid roles found' });
          return;
        }
        const roleNames = userRoles.map((role: any) => role.name);
        const hasRole = roles.some((role) => roleNames.includes(role));
        if (hasRole) {
          return next();
        } else {
          res
            .status(403)
            .json({ message: 'Permission denied: Insufficient role' });
          return;
        }
      } catch (error: any) {
        res
          .status(500)
          .json({ message: 'Internal server error', error: error.message });
        return;
      }
    };
  }
}
export default new AuthMiddleWare();
