import api from './axiosInstance';

export interface IBanner {
  success: boolean;
  message: string;
  _id: string;
  title: string;
  image: string;
  description?: string;
  order: number;
  status: 'active' | 'inactive';
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBannerData {
  title: string;
  image: File;
  description?: string;
  order: number;
  status?: 'active' | 'inactive';
  start_date?: Date;
  end_date?: Date;
}

export interface UpdateBannerData extends Partial<CreateBannerData> {
  image?: File;
}

const BannerApi = {
  // Lấy banner hoạt động
  getActiveBanners: () => {
    return api.get<IBanner[]>('/banner/getActiveBanners');    
  },

  // Lấy danh sách banner
  getAllBanners: () => {
    return api.get<IBanner[]>('/banner/getAllBanners');
  },

  // Lấy banner theo ID
  getBannerById: (id: string) => {
    return api.get<IBanner>(`/banner/getBannerById/${id}`);
  },

  // Tạo banner mới
  createBanner: (data: FormData) => {
    return api.post<IBanner>('/banner/createBanner', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Cập nhật banner
  updateBanner: (id: string, data: FormData) => {
    return api.put<IBanner>(`/banner/updateBanner/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Xóa banner
  deleteBanner: (id: string) => {
    return api.delete<IBanner>(`/banner/deleteBanner/${id}`);
  },
};

export default BannerApi; 