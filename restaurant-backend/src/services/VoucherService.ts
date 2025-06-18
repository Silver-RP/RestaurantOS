import Voucher, { IVoucher } from '../models/VoucherModel';
import { Types } from 'mongoose';

export default class VoucherService {
  static async createVoucher(data: Partial<IVoucher>) {
    const status = this.calcVoucherStatus(data);
    return Voucher.create({ ...data, status });
  }

  static async getAllVouchers() {
    return Voucher.find();
  }

  static async getVoucherById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error('Invalid voucher id');
    return Voucher.findById(id);
  }

  static async updateVoucher(id: string, data: Partial<IVoucher>) {
    if (!Types.ObjectId.isValid(id)) throw new Error('Invalid voucher id');
    const status = this.calcVoucherStatus(data);
    return Voucher.findByIdAndUpdate(id, { ...data, status }, { new: true });
  }

  static async deleteVoucher(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error('Invalid voucher id');
    return Voucher.findByIdAndDelete(id);
  }

  static calcVoucherStatus(data: Partial<IVoucher>): 'active' | 'inactive' | 'expired' | 'out_of_stock' {
    const now = new Date();

    // 1. Out of stock (highest priority) - nếu used >= quantity và quantity > 0
    if (typeof data.quantity === 'number' && typeof data.used === 'number' && data.quantity > 0 && data.used >= data.quantity) {
      return 'out_of_stock';
    }

    // 2. Expired - nếu hiện tại > end_date
    if (data.end_date && now > new Date(data.end_date)) {
      return 'expired';
    }

    // 3. Inactive - nếu hiện tại < start_date
    if (data.start_date && now < new Date(data.start_date)) {
      return 'inactive';
    }

    // 4. Active - nếu còn hiệu lực và còn lượt sử dụng
    return 'active';
  }
} 