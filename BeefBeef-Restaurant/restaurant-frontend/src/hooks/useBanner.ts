import { useState, useCallback } from 'react';
import BannerApi, { IBanner } from '../api/BannerApi';
import { AxiosError } from 'axios';

// Hook lấy danh sách banner
export const useGetBanners = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BannerApi.getAllBanners();
      
      if (response?.data.data) {
        setBanners(response.data.data);
      } else {
        setBanners([]);
        setError('Dữ liệu danh sách banner không hợp lệ');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Lỗi khi tải danh sách banner');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { banners, loading, error, fetchBanners };
};

// Hook lấy banner hoạt động
export const useGetActiveBanners = () => {
  const [activeBanners, setActiveBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BannerApi.getActiveBanners();
      
      if (response?.data.data) {
        setActiveBanners(response.data.data);
      } else {
        setActiveBanners([]);
        setError('Dữ liệu banner hoạt động không hợp lệ');
      }
    } catch (error) {
      console.error('Error fetching active banners:', error);
      setError('Lỗi khi tải danh sách banner hoạt động');
      setActiveBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { activeBanners, loading, error, fetchActiveBanners };
};

// Hook lấy banner theo ID
export const useGetBannerById = () => {
  const [selectedBanner, setSelectedBanner] = useState<IBanner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBannerById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await BannerApi.getBannerById(id);

      if (response?.data.data) {
        setSelectedBanner(response.data.data);
        return response.data.data;
      } else {
        setSelectedBanner(null);
        setError('Không tìm thấy thông tin banner');
        return null;
      }
    } catch (error) {
      console.error('Error fetching banner by ID:', error);
      setSelectedBanner(null);
      setError('Lỗi khi tải thông tin banner');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { selectedBanner, loading, error, getBannerById };
};

// Hook tạo banner mới
export const useCreateBanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBanner = async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await BannerApi.createBanner(formData);
      
      if (response?.data) {
        return response.data;
      } else {
        const errorMessage = 'Có lỗi xảy ra khi tạo banner';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        setError(error.response.data.message);
        throw new Error(error.response.data.message);
      }
      setError('Có lỗi xảy ra khi tạo banner');
      throw new Error('Có lỗi xảy ra khi tạo banner');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createBanner };
};

// Hook cập nhật banner
export const useUpdateBanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBanner = async (id: string, formData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await BannerApi.updateBanner(id, formData);
      
      if (response?.data) {
        return response.data;
      } else {
        const errorMessage = 'Có lỗi xảy ra khi cập nhật banner';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        setError(error.response.data.message);
        throw new Error(error.response.data.message);
      }
      setError('Có lỗi xảy ra khi cập nhật banner');
      throw new Error('Có lỗi xảy ra khi cập nhật banner');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateBanner };
};

// Hook xóa banner
export const useDeleteBanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBanner = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await BannerApi.deleteBanner(id);

      if (response?.data) {
        return response.data;
      } else {
        const errorMessage = 'Có lỗi xảy ra khi xóa banner';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        setError(error.response.data.message);
        throw new Error(error.response.data.message);
      }
      setError('Có lỗi xảy ra khi xóa banner');
      throw new Error('Có lỗi xảy ra khi xóa banner');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, deleteBanner };
}; 