import { Request } from 'express';
import Banner, { IBanner } from '../models/BannerModel';
import UploadImageService from './UploadImageService';

class BannerService {
  async getActiveBanners(): Promise<IBanner[]> {
    const now = new Date();
    return await Banner.find({
      status: 'active',
      $and: [
        {
          $or: [
            { start_date: { $exists: false } },
            { start_date: { $lte: now } }
          ]
        },
        {
          $or: [
            { end_date: { $exists: false } },
            { end_date: { $gt: now } }
          ]
        }
      ]
    }).sort({ order: 1 });
  }

  async createBanner(req: Request): Promise<IBanner> {
    try {
      if (!req.file) {
        throw new Error('Vui lòng tải lên hình ảnh');
      }

      if (!req.body.title) {
        throw new Error('Vui lòng nhập tiêu đề banner');
      }

      const order = parseInt(req.body.order) || 1;
      
      // Kiểm tra order trùng lặp
      const existingBanner = await Banner.findOne({ order });
      if (existingBanner) {
        throw new Error(`Đã tồn tại banner với thứ tự ${order}. Vui lòng chọn thứ tự khác.`);
      }

      const { url } = await UploadImageService.UploadImage(req.file, 'banners');
      
      const bannerData = {
        title: req.body.title,
        description: req.body.description || '',
        image: url,
        order,
        status: req.body.status || 'active',
      };

      // Xử lý start_date
      if (req.body.start_date === 'null') {
        bannerData.start_date = undefined;
      } else if (req.body.start_date) {
        bannerData.start_date = new Date(req.body.start_date);
      }

      // Xử lý end_date
      if (req.body.end_date === 'null') {
        bannerData.end_date = undefined;
      } else if (req.body.end_date) {
        bannerData.end_date = new Date(req.body.end_date);
      }

      console.log('Creating banner with data:', bannerData);

      const banner = new Banner(bannerData);
      const savedBanner = await banner.save();
      console.log('Banner created successfully:', savedBanner);
      return savedBanner;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  }

  async getAllBanners(): Promise<IBanner[]> {
    return await Banner.find().sort({ order: 1 });
  }

  async getBannerById(id: string): Promise<IBanner | null> {
    return await Banner.findById(id);
  }

  async updateBanner(id: string, req: Request): Promise<IBanner | null> {
    try {
      if (!req.body.title) {
        throw new Error('Vui lòng nhập tiêu đề banner');
      }

      const order = parseInt(req.body.order) || 1;

      // Kiểm tra order trùng lặp (trừ banner hiện tại)
      const existingBanner = await Banner.findOne({ order, _id: { $ne: id } });
      if (existingBanner) {
        throw new Error(`Đã tồn tại banner với thứ tự ${order}. Vui lòng chọn thứ tự khác.`);
      }

      const updateData: any = {
        title: req.body.title,
        description: req.body.description || '',
        order,
        status: req.body.status || 'active',
      };

      // Xử lý start_date
      if (req.body.start_date === 'null') {
        updateData.$unset = { start_date: 1 };
      } else if (req.body.start_date) {
        updateData.start_date = new Date(req.body.start_date);
      }

      // Xử lý end_date
      if (req.body.end_date === 'null') {
        if (updateData.$unset) {
          updateData.$unset.end_date = 1;
        } else {
          updateData.$unset = { end_date: 1 };
        }
      } else if (req.body.end_date) {
        updateData.end_date = new Date(req.body.end_date);
      }
      
      if (req.file) {
        // Xóa ảnh cũ từ Cloudinary nếu tồn tại
        const oldBanner = await Banner.findById(id);
        if (oldBanner?.image) {
          const publicId = UploadImageService.extractPublicIdFromUrl(oldBanner.image);
          if (publicId) {
            await UploadImageService.DeleteImage(publicId);
          }
        }
        
        // Tải lên ảnh mới
        const { url } = await UploadImageService.UploadImage(req.file, 'banners');
        updateData.image = url;
      }

      const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedBanner) {
        throw new Error('Không tìm thấy banner');
      }
      return updatedBanner;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  }

  async deleteBanner(id: string): Promise<IBanner | null> {
    try {
      const banner = await Banner.findById(id);
      if (!banner) {
        throw new Error('Không tìm thấy banner');
      }

      if (banner.image) {
        const publicId = UploadImageService.extractPublicIdFromUrl(banner.image);
        if (publicId) {
          await UploadImageService.DeleteImage(publicId);
        }
      }
      return await Banner.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  }
}

export default new BannerService(); 