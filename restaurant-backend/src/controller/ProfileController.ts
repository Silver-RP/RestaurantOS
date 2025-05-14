import ProfileService from '../services/ProfileService';
import { Request, Response } from 'express';
import { IUser } from '../models/UserModel';
import { Types } from 'mongoose';

class ProfileController {

  async getUserProfile(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userId = (req.user as IUser).id as Types.ObjectId;
      const user = await ProfileService.getUserProfile(userId.toString());
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUserProfile(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userId = (req.user as IUser).id as Types.ObjectId;
      const user = await ProfileService.updateUserProfile(userId.toString(), req.body);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async changePasswordProfile(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userId = (req.user as IUser).id as Types.ObjectId;
      const user = await ProfileService.changePasswordProfile(userId.toString(), req.body);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
export default new ProfileController();
