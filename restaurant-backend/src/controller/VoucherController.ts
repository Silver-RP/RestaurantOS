import { Request, Response } from 'express';
import VoucherService from '../services/VoucherService';

export default class VoucherController {
  static async createVoucher(req: Request, res: Response) {
    try {
      const {
        code,
        description,
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
      } = req.body;
      const voucher = await VoucherService.createVoucher({
        code,
        description,
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
      });
      res.status(201).json(voucher);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAllVouchers(req: Request, res: Response) {
    try {
      const vouchers = await VoucherService.getAllVouchers();
      res.json(vouchers);
    } catch (err: any) {
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
      res.json({ message: 'Voucher deleted' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
} 