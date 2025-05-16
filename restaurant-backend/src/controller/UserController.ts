import UserService from '../services/UserService';
import { Request, Response } from 'express';

class UserController {
  async getAllUser(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, keyword = '' } = req.query;

      const result = await UserService.getAllUser({
        page: Number(page),
        limit: Number(limit),
        keyword: String(keyword),
      });

      res.status(200).json({
        status: 'OK',
        message: 'Fetched users successfully',
        data: result, // docs, totalDocs, totalPages, page, limit
      });
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({
        status: 'ERROR',
        message: 'Failed to fetch users',
        error: error.message || 'Internal Server Error',
      });
    }
  }

  async getAllUserByUserRole(req: Request, res: Response): Promise<void> {
    try {
      const getAllUserByUserRole = await UserService.getAllUserByUserRole();
      res.status(200).json(getAllUserByUserRole);
    } catch (error: any) {
      console.error('Error fetching users by role:', error.message);
      res.status(500).json({
        status: 'ERROR',
        message: 'Failed to fetch users with role user',
        error: error.message || 'Internal Server Error',
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const getUserById = await UserService.getUserById(userId);
      res.status(200).json(getUserById);
    } catch (error: any) {
      console.error('Error fetching user by id:', error.message);
      res.status(500).json({
        status: 'ERROR',
        message: 'Failed to fetch user by id',
        error: error.message || 'Internal Server Error',
      });
    }
  }

  async blockUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const blockUser = await UserService.blockUser(userId);
      res.status(200).json(blockUser);
    } catch (error: any) {
      console.error('Error blocking user:', error.message);
      res.status(500).json({
        status: 'ERROR',
        message: 'Failed to block user',
        error: error.message || 'Internal Server Error',
      });
    }
  }

  async filterUser(req: Request, res: Response) {
    try {
      const filterOptions = {
        nameSort: req.query.nameSort as string, // 'A->Z', 'Z->A'
        emailSort: req.query.emailSort as string, // 'A->Z', 'Z->A'
        gender: req.query.gender as string, // 'male', 'female', 'other'
        status: req.query.status as string, // 'active', 'inactive', 'blocked'
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
      };

      const result = await UserService.filterUsers(filterOptions);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        status: 'ERROR',
        message: error.message,
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const updateData = req.body;

      const result = await UserService.updateUserInfo(userId, updateData);
      res.status(200).json(result); // ❌ không return
    } catch (error: any) {
      res.status(500).json({
        status: 'ERROR',
        message: error.message,
      });
    }
  }

  async changeUserPassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const { currentPassword, newPassword } = req.body;
      const result = await UserService.changeUserPassword(userId, currentPassword, newPassword);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 'ERROR',
        message: error.message,
      });
    }
  }
  async addUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const result = await UserService.addUser(userData);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 'ERROR',
        message: error.message,
      });
    }
  }
}

export default new UserController();
