import { Request, Response } from 'express';
import LoyaltyService from '../services/LoyaltyService';

const LoyaltyController = {
  // Lấy điểm hiện tại, tổng chi tiêu, hạng của user
  async getAccountInfo(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id || (req.user as any)?._id || req.params.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const info = await LoyaltyService.getAccountInfo(userId);
      res.json(info);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  // Lấy lịch sử cộng/trừ điểm
  async getTransactionHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id || (req.user as any)?._id || req.params.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const history = await LoyaltyService.getTransactionHistory(userId);
      res.json(history);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  // Cộng điểm và tổng chi tiêu (khi đơn hàng thành công)
  async addPoints(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id || (req.user as any)?._id || req.body.userId;
      const { orderId, amount } = req.body;
      if (!userId || !orderId || !amount) {
        res.status(400).json({ message: 'Thiếu thông tin' });
        return;
      }
      const result = await LoyaltyService.addPoints(userId, orderId, amount);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  // Lấy danh sách tất cả các tier
  async getAllTiers(req: Request, res: Response): Promise<void> {
    try {
      const tiers = await LoyaltyService.getAllTiers();
      res.json(tiers);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default LoyaltyController; 