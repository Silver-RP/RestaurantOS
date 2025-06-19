import Voucher, { IVoucher } from '../models/VoucherModel';
import { Types } from 'mongoose';
import { PaginateResult } from 'mongoose';
import UserVoucher, { IUserVoucher } from '../models/UserVoucherModel';

interface VoucherFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: 'active' | 'inactive' | 'expired' | 'out_of_stock';
  type?: 'public' | 'private';
  discount_type?: 'percent' | 'fixed';
  min_discount_value?: number;
  max_discount_value?: number;
  min_order_value?: number;
  max_order_value?: number;
}

export default class VoucherService {
  static async createVoucher(data: Partial<IVoucher>) {
    const status = this.calcVoucherStatus(data);
    return Voucher.create({ ...data, status });
  }

  static async getAllVouchers(params: VoucherFilterParams): Promise<PaginateResult<IVoucher>> {
    const {
      page = 1,
      limit = 12,
      search = '',
      sort = '',
      status,
      type,
      discount_type,
      min_discount_value,
      max_discount_value,
      min_order_value,
      max_order_value,
    } = params;

    const query: any = {};

    // Search by code or description
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by discount type
    if (discount_type) {
      query.discount_type = discount_type;
    }

    // Filter by discount value range
    if (min_discount_value !== undefined || max_discount_value !== undefined) {
      query.discount_value = {};
      if (min_discount_value !== undefined) {
        query.discount_value.$gte = min_discount_value;
      }
      if (max_discount_value !== undefined) {
        query.discount_value.$lte = max_discount_value;
      }
    }

    // Filter by order value range
    if (min_order_value !== undefined || max_order_value !== undefined) {
      query.min_order_value = {};
      if (min_order_value !== undefined) {
        query.min_order_value.$gte = min_order_value;
      }
      if (max_order_value !== undefined) {
        query.min_order_value.$lte = max_order_value;
      }
    }

    // Sort options
    const sortMapping: Record<string, Record<string, 1 | -1>> = {
      codeAZ: { code: 1 },
      codeZA: { code: -1 },
      typeAZ: { type: 1 },
      typeZA: { type: -1 },
      discountValueLow: { discount_value: 1 },
      discountValueHigh: { discount_value: -1 },
      orderValueLow: { min_order_value: 1 },
      orderValueHigh: { min_order_value: -1 },
      createdAtNew: { createdAt: -1 },
      createdAtOld: { createdAt: 1 },
      statusAZ: { status: 1 },
      statusZA: { status: -1 }
    };

    const sortOption = sortMapping[sort] || { createdAt: -1 };

    const result = await Voucher.paginate(query, {
      page,
      limit,
      sort: sortOption,
    });

    return result;
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
    if (
      typeof data.quantity === 'number' &&
      typeof data.used === 'number' &&
      data.quantity > 0 &&
      data.used >= data.quantity
    ) {
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

  static async getPublicActiveVouchers(page = 1, limit = 6) {
    const query = { type: 'public', status: 'active' };
    const sortOption = { createdAt: -1 };
    return Voucher.paginate(query, { page, limit, sort: sortOption });
  }

  static async saveVoucherForUser(userId: string, voucherId: string): Promise<IUserVoucher> {
    try {
      // Validate ObjectIds
      if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(voucherId)) {
        throw new Error('Invalid user ID or voucher ID');
      }

      // Check if voucher exists and is active
      const voucher = await Voucher.findById(voucherId);
      if (!voucher) {
        throw new Error('Voucher not found');
      }
      if (voucher.status !== 'active') {
        throw new Error('Voucher is not active');
      }
      if (voucher.type !== 'public') {
        throw new Error('This voucher is not available for public use');
      }

      // Check if user already has this voucher
      const existingRecord = await UserVoucher.findOne({
        user_id: new Types.ObjectId(userId),
        voucher_id: new Types.ObjectId(voucherId)
      });

      if (existingRecord) {
        if (existingRecord.status === 'used') {
          throw new Error('You have already used this voucher');
        }
        if (existingRecord.status === 'expired') {
          throw new Error('This voucher has expired');
        }
        return existingRecord; // Return existing record if status is 'saved'
      }

      // Create new record
      const record = await UserVoucher.create({
        user_id: new Types.ObjectId(userId),
        voucher_id: new Types.ObjectId(voucherId),
        status: 'saved'
      });

      return record;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to save voucher for user');
    }
  }
} 