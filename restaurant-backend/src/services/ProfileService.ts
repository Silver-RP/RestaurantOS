import User from '../models/UserModel';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
class ProfileService {
  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async updateUserProfile(userId: string, data: any) {
    try {
      const user = await User.findByIdAndUpdate(userId, data, { new: true });
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async changePasswordProfile(userId: string, data: any) {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(
        data.oldPassword,
        user.password || '',
      );
      if (!isPasswordValid) {
        throw new Error('Old password is incorrect');
      }
      user.password = data.newPassword;
      await user.save();
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
export default new ProfileService();
