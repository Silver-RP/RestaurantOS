import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBannerById, useUpdateBanner } from '../../../../hooks/useBanner';
import { toast } from 'react-toastify';
import BannerForm from './BannerForm';

const EditBannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedBanner, loading: loadingBanner, getBannerById, error: fetchError } = useGetBannerById();
  const { updateBanner, loading: updatingBanner } = useUpdateBanner();

  useEffect(() => {
    if (id) {
      getBannerById(id);
    } else {
      toast.error('Không tìm thấy ID banner');
      navigate('/admin/banners');
    }
  }, [id, getBannerById, navigate]);

  useEffect(() => {
    if (fetchError) {
      toast.error(fetchError);
    }
  }, [fetchError]);

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    
    try {
      const response = await updateBanner(id, formData);
      if (response.success === true) {
        toast.success('Cập nhật banner thành công');
        navigate('/admin/banners');
      } else {
         toast.error(response?.message || 'Có lỗi xảy ra khi cập nhật banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Có lỗi xảy ra khi cập nhật banner');
      }
    }
  };

  if (loadingBanner) {
    return <div>Đang tải...</div>;
  }
 
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chỉnh sửa Banner</h2>
        <BannerForm 
          onSubmit={handleSubmit} 
          initialData={selectedBanner} 
          loading={updatingBanner}
        />
      </div>
    </div>
  );
};

export default EditBannerPage; 