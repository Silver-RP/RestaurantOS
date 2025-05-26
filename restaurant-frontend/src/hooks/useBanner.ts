import { useState, useCallback } from 'react';
import BannerApi, { IBanner } from '../api/BannerApi';
import { toast } from 'react-toastify';
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
      console.log('Fetching banners...');
      const response = await BannerApi.getAllBanners();
      console.log('Banner response:', response);
      
      if (response?.data?.success && Array.isArray(response.data.data)) {
        setBanners(response.data.data);
        console.log('Banners set:', response.data.data);
      } else {
        setBanners([]);
        console.warn('Invalid banner data received:', response);
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
      const response = await BannerApi.getActiveBanners();
      setActiveBanners(response.data || []);
    } catch (error) {
      console.error('Error fetching active banners:', error);
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
      const response = await BannerApi.getBannerById(id);
      setSelectedBanner(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching banner:', error);
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
      console.log('Sending form data:', Object.fromEntries(formData.entries()));
      
      const response = await BannerApi.createBanner(formData);
      console.log('Create banner response:', response);
      
      if (response.data && response.data.success === false) {
        const errorMessage = response.data.message;
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating banner:', error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo banner';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      throw error;
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
      console.log('Sending update data:', Object.fromEntries(formData.entries()));
      
      const response = await BannerApi.updateBanner(id, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating banner:', error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật banner';
        setError(errorMessage);
        throw error;
      }
      throw error;
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
      return response.data;
    } catch (error) {
      console.error('Error deleting banner:', error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa banner';
        setError(errorMessage);
        throw error;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, deleteBanner };
}; 