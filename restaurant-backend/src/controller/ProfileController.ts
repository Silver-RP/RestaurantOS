import ProfileService from '../services/ProfileService';
import { Request, Response } from 'express';
class ProfileController {
    // Get user profile
    async getUserProfile(req: Request, res: Response) {
        try {
            const userId = req.params._id; 
            const user = await ProfileService.getUserProfile(userId);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
    async updateUserProfile(req: Request, res: Response) {
        try {
            const userId = req.params._id;
            const user = await ProfileService.updateUserProfile(userId, req.body);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
    async changePasswordProfile(req: Request, res: Response) {
        try {
            const userId = req.params._id;
            const user = await ProfileService.changePasswordProfile(userId, req.body);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
export default new ProfileController();