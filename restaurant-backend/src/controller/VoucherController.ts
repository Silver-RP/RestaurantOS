import { Request, Response } from 'express';
import VoucherService from '../services/VoucherService';
import { Types } from 'mongoose';
import Voucher from '../models/VoucherModel';

export default class VoucherController {
  static async createVoucher(req: Request, res: Response) {
    try {
      const {
        code,
        description,
        type,
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
        userIds,
      } = req.body;
      
      if (type === 'private' && Array.isArray(userIds)) {
        if (quantity > 0 && userIds.length > quantity) {
          return res
            .status(400)
            .json({ error: 'Số lượng user nhận voucher không được vượt quá số lượng voucher!' });
        }
      }
      
      const voucher = await VoucherService.createVoucher({
        code,
        description,
        type: type || 'public',
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
      });
      
      // Nếu là private, tạo UserVoucher và gửi email
      if (type === 'private' && Array.isArray(userIds) && userIds.length > 0) {
        await VoucherService.assignVoucherToUsers(voucher, userIds);
      }
      
      res.status(201).json(voucher);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAllVouchers(req: Request, res: Response) {
    try {
      const {
        page,
        limit,
        search,
        sort,
        status,
        type,
        discount_type,
        min_discount_value,
        max_discount_value,
        min_order_value,
        max_order_value,
      } = req.query;

      // Xử lý params an toàn hơn
      const params: any = {};
      
      if (page) params.page = Number(page);
      if (limit) params.limit = Number(limit);
      if (search) params.search = String(search);
      if (sort) params.sort = String(sort);
      if (status) params.status = String(status);
      if (type) params.type = String(type);
      if (discount_type) params.discount_type = String(discount_type);
      
      if (min_discount_value) {
        const value = Number(min_discount_value);
        if (!isNaN(value)) params.min_discount_value = value;
      }
      
      if (max_discount_value) {
        const value = Number(max_discount_value);
        if (!isNaN(value)) params.max_discount_value = value;
      }
      
      if (min_order_value) {
        const value = Number(min_order_value);
        if (!isNaN(value)) params.min_order_value = value;
      }
      
      if (max_order_value) {
        const value = Number(max_order_value);
        if (!isNaN(value)) params.max_order_value = value;
      }

      const vouchers = await VoucherService.getAllVouchers(params);
      res.json(vouchers);
    } catch (err: any) {
      console.error('Error in getAllVouchers:', err);
      res.status(500).json({ error: err.message });
    }
  }

  static async getVoucherById(req: Request, res: Response) {
    try {
      const voucher = await VoucherService.getVoucherById(req.params.id);
      if (!voucher) return res.status(404).json({ error: 'Voucher not found' });
      res.json(voucher);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateVoucher(req: Request, res: Response) {
    try {
      const {
        description,
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
        userIds,
      } = req.body;
      const voucher = await VoucherService.updateVoucher(req.params.id, {
        description,
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
        userIds,
      });
      if (!voucher) return res.status(404).json({ error: 'Voucher not found' });
      res.json(voucher);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteVoucher(req: Request, res: Response) {
    try {
      const voucher = await VoucherService.deleteVoucher(req.params.id);
      if (!voucher) return res.status(404).json({ error: 'Voucher not found' });
      res.json({ message: 'Voucher soft deleted' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async restoreVoucher(req: Request, res: Response) {
    try {
      const voucher = await VoucherService.restoreVoucher(req.params.id);
      res.json(voucher);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getPublicActiveVouchers(req: Request, res: Response) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const vouchers = await VoucherService.getPublicActiveVouchers(page, limit);
      res.json(vouchers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async saveVoucherForUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userId = (req.user as any)._id || (req.user as any).id;
      const { voucherId } = req.body;

      // Validate input
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated or token missing _id' });
      }
      if (!voucherId) {
        return res.status(400).json({ error: 'Voucher ID is required' });
      }
      if (!Types.ObjectId.isValid(voucherId)) {
        return res.status(400).json({ error: 'Invalid voucher ID format' });
      }

      // Check if voucher exists and is active
      const voucher = await VoucherService.getVoucherById(voucherId);
      if (!voucher) {
        return res.status(404).json({ error: 'Voucher not found' });
      }
      if (voucher.status !== 'active') {
        return res.status(400).json({ error: 'Voucher is not active' });
      }
      if (voucher.type !== 'public' && voucher.type !== 'gift') {
        return res.status(403).json({ error: 'This voucher is not available for saving' });
      }

      // Save voucher for user
      const record = await VoucherService.saveVoucherForUser(userId, voucherId);
      res.status(201).json(record);
    } catch (err: any) {
      console.error('Error in saveVoucherForUser:', err);
      res.status(500).json({ error: err.message });
    }
  }

  static async getUserVouchers(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userId = (req.user as any)._id || (req.user as any).id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated or token missing _id' });
      }
      const vouchers = await VoucherService.getUserVouchers(userId);
      res.json(vouchers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getTrashVouchers(req: Request, res: Response) {
    try {
      const {
        page,
        limit,
        search,
        sort,
        type,
        discount_type,
        min_discount_value,
        max_discount_value,
        min_order_value,
        max_order_value,
      } = req.query;

      const params: any = {};
      if (page) params.page = Number(page);
      if (limit) params.limit = Number(limit);
      if (search) params.search = String(search);
      if (sort) params.sort = String(sort);
      if (type) params.type = String(type);
      if (discount_type) params.discount_type = String(discount_type);
      if (min_discount_value) {
        const value = Number(min_discount_value);
        if (!isNaN(value)) params.min_discount_value = value;
      }
      if (max_discount_value) {
        const value = Number(max_discount_value);
        if (!isNaN(value)) params.max_discount_value = value;
      }
      if (min_order_value) {
        const value = Number(min_order_value);
        if (!isNaN(value)) params.min_order_value = value;
      }
      if (max_order_value) {
        const value = Number(max_order_value);
        if (!isNaN(value)) params.max_order_value = value;
      }
      const vouchers = await VoucherService.getTrashVouchers(params);
      res.json(vouchers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async forceDeleteVoucher(req: Request, res: Response) {
    try {
      await VoucherService.forceDeleteVoucher(req.params.id);
      res.json({ message: 'Voucher đã được xóa vĩnh viễn' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async addUsersToVoucher(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userIds } = req.body;
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'Danh sách userIds không hợp lệ!' });
      }
      // Lấy voucher để kiểm tra
      const voucher = await VoucherService.getVoucherById(id);
      if (!voucher) return res.status(404).json({ error: 'Voucher not found' });
      if (voucher.type !== 'private') return res.status(400).json({ error: 'Chỉ voucher private mới thêm user được!' });
      // Lấy danh sách user đã sở hữu
      const currentUserIds = Array.isArray(voucher.userIds) ? voucher.userIds : [];
      // Lọc user mới chưa sở hữu
      const newUserIds = userIds.filter((uid: string) => !currentUserIds.includes(uid));
      if (newUserIds.length === 0) {
        return res.status(400).json({ error: 'Tất cả user đã sở hữu voucher này!' });
      }
      // Thêm user mới và gửi email
      const voucherDoc = await Voucher.findById(id);
      if (!voucherDoc) return res.status(404).json({ error: 'Voucher not found' });
      await VoucherService.assignVoucherToUsers(voucherDoc, newUserIds);
      res.json({ added: newUserIds });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}