import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBanner, useGetBanners } from '../../../../hooks/useBanner';
import { toast } from 'react-toastify';
import BannerForm from './BannerForm';

const CreateBannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { createBanner, loading: creatingBanner } = useCreateBanner();
  const { banners, fetchBanners } = useGetBanners();

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await createBanner(formData);
      if (typeof response === 'object' && response !== null && 'conflict' in response) {
        return;
      }

      if (response) {
        toast.success('Thêm banner thành công');
        navigate('/admin/banners');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Có lỗi xảy ra khi thêm banner');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thêm Banner mới</h2>
        <BannerForm onSubmit={handleSubmit} loading={creatingBanner} existingBanners={banners} />
      </div>
    </div>
  );
};

export default CreateBannerPage; 