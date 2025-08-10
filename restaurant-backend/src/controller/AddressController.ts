import { Request, Response } from 'express';
import AddressService from '../services/AddressService';
import { CreateAddressSchema, UpdateAddressSchema } from '../validators/addressValidator';
import mongoose from 'mongoose';
import { Address } from '../models/AddressModel';
import { Types } from 'mongoose';
import { IUser } from '../types/user.type';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from 'sub-vn';

class AddressController {
  async createAddress(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = CreateAddressSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errors = parseResult.error.format();
        res.status(400).json({ success: false, message: 'Kiểm tra dữ liệu không hợp lệ', errors });
        return;
      }
      let input = {
        ...parseResult.data,
        province_code: req.body.province_code,
        district_code: req.body.district_code,
        ward_code: req.body.ward_code,
        district: req.body.district,
      };
      const userId = (req.user as IUser).id as Types.ObjectId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Không có quyền truy cập' });
        return;
      }
      const addressCount = await Address.countDocuments({ user_id: userId });
      if (addressCount >= 5) {
        res.status(403).json({
          success: false,
          message: 'Bạn chỉ có thể lưu tối đa 5 địa chỉ.',
        });
        return;
      }

      const address = await AddressService.createAddress(
        { ...input, user_id: userId } as any,
        userId.toString(),
      );
      res.status(201).json({
        success: true,
        message: 'Địa chỉ lưu thành công',
        data: {
          id: address._id,
          full_name: address.full_name,
          phone: address.phone,
          district: address.district,
          province: address.province,
          ward: address.ward,
          street_address: address.street_address,
          is_default: address.is_default,
          address_type: address.address_type,
        },
      });
    } catch (error: any) {
      if (error.response?.data) {
        console.error('Lỗi từ server:', error.response.data);
      } else {
        console.error('Lỗi không rõ:', error);
      }
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi không xác định khi lưu địa chỉ',
      });
    }
  }
  async getAllAddresses(req: Request, res: Response): Promise<void> {
    try {
      const user_id = (req.user as IUser).id as Types.ObjectId;

      if (!user_id) {
        res.status(401).json({ success: false, message: 'Unauthorized: No user_id in token' });
        return;
      }
      const addresses = await AddressService.getAllAddresses(user_id.toString());
      res.status(200).json({
        success: true,
        message: 'Addresses retrieved successfully',
        data: addresses,
        total: addresses.length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error fetching addresses',
      });
    }
  }
  async updateAddress(req: Request, res: Response): Promise<void> {
    try {
      const addressId = req.params.id;
      const parseResult = UpdateAddressSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errors = parseResult.error.format();
        res.status(400).json({ success: false, message: 'Validation failed', errors });
        return;
      }

      let input = parseResult.data;
      const userId = (req.user as IUser)?.id;
      const updated = await AddressService.updateAddress(addressId, input, userId?.toString());

      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: updated,
      });
    } catch (error: any) {
      console.error('Update error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
  async deleteAddress(req: Request, res: Response): Promise<void> {
    try {
      const addressId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        res.status(400).json({ success: false, message: 'Invalid address ID format' });
        return;
      }
      const deleted = await AddressService.deleteAddress(addressId);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Address not found' });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
        deletedId: addressId,
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
  async setDefaultAddress(req: Request, res: Response): Promise<void> {
    try {
      const addressId = req.params.id;
      const userId = (req.user as IUser).id as Types.ObjectId;

      if (!userId) {
        res.status(403).json({ success: false, message: 'Forbidden: User not authenticated' });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        res.status(400).json({ success: false, message: 'Invalid address ID format' });
        return;
      }

      const updatedAddress = await AddressService.setDefaultAddress(addressId, userId.toString());

      if (!updatedAddress) {
        res.status(404).json({ success: false, message: 'Address not found or not owned by user' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Default address set successfully',
        data: updatedAddress,
      });
    } catch (error: any) {
      console.error('Set default address error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async getProvinces(req: Request, res: Response): Promise<void> {
    try {
      const provinces = getProvinces();
      res.json(provinces);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      res.status(500).json({ error: 'Lỗi lấy danh sách tỉnh/thành' });
    }
  }
  async getDistricts(req: Request, res: Response): Promise<void> {
    const { provinceCode } = req.query;
    if (!provinceCode || typeof provinceCode !== 'string') {
      res.status(400).json({ error: 'Thiếu hoặc sai mã tỉnh (provinceCode)' });
      return;
    }

    try {
      const districts = getDistrictsByProvinceCode(provinceCode);
      res.json(districts);
    } catch (error) {
      console.error('Error fetching districts:', error);
      res.status(500).json({ error: 'Lỗi lấy danh sách quận/huyện' });
    }
  }
  async getWards(req: Request, res: Response): Promise<void> {
    const { districtCode } = req.query;
    if (!districtCode || typeof districtCode !== 'string') {
      res.status(400).json({ error: 'Thiếu hoặc sai mã quận (districtCode)' });
      return;
    }
    try {
      const wards = getWardsByDistrictCode(districtCode);
      res.json(wards);
    } catch (error) {
      console.error('Error fetching wards:', error);
      res.status(500).json({ error: 'Lỗi lấy danh sách phường/xã' });
    }
  }
}

export default new AddressController();
