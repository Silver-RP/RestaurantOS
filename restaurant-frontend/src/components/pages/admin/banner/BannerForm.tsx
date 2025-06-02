import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploadPreview from '../ImageUploadPreview';
import { IBanner } from '../../../../api/BannerApi';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface BannerFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: IBanner | null;
  loading?: boolean;
  existingBanners?: IBanner[];
}

interface FormErrors {
  title?: string;
  description?: string;
  order?: string;
  start_date?: string;
  end_date?: string;
  image?: string;
}

const BannerForm: React.FC<BannerFormProps> = ({ onSubmit, initialData, loading = false, existingBanners = [] }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState<(File | string)[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1,
    status: 'active',
    start_date: '',
    end_date: ''
  });

  const [showOrderConflictModal, setShowOrderConflictModal] = useState(false);
  const [orderConflictMessage, setOrderConflictMessage] = useState('');
  const [isConfirmedSubmit, setIsConfirmedSubmit] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        order: initialData.order,
        status: initialData.status,
        start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : ''
      });
      setImages([initialData.image]);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề';
    }

    if (!initialData && images.length === 0) {
      newErrors.image = 'Vui lòng chọn hình ảnh';
    }

    if (formData.order < 1) {
      newErrors.order = 'Thứ tự phải lớn hơn 0';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (startDate > endDate) {
        newErrors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    if (!isConfirmedSubmit && existingBanners && existingBanners.length > 0) {
      const conflictingBanner = existingBanners.find(banner => 
        banner.order === formData.order && (!initialData || banner._id !== initialData._id)
      );

      if (conflictingBanner) {
        setOrderConflictMessage(`Thứ tự ${formData.order} đã được sử dụng bởi banner "${conflictingBanner.title}". Bạn có muốn thay đổi thứ tự của banner hiện tại và điều chỉnh các banner khác không?`);
        setShowOrderConflictModal(true);
        return;
      }
    }

    try {
      const submitData = new FormData();
      
      if (images.length > 0) {
        const image = images[0];
        if (image instanceof File) {
          submitData.append('image', image);
        }
      }
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('order', formData.order.toString());
      submitData.append('status', formData.status);
      
      if (formData.start_date === '') {
        submitData.append('start_date', 'null');
      } else if (formData.start_date) {
        submitData.append('start_date', formData.start_date);
      }

      if (formData.end_date === '') {
        submitData.append('end_date', 'null');
      } else if (formData.end_date) {
        submitData.append('end_date', formData.end_date);
      }

      if (isConfirmedSubmit) {
         submitData.append('confirm_order_adjustment', 'true');
      }

      await onSubmit(submitData);
      setIsConfirmedSubmit(false);
      setShowOrderConflictModal(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error submitting form:', error);
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      } else if (error instanceof Error) {
         toast.error(error.message);
      }

      setIsConfirmedSubmit(false);
    }
  };

  const handleConfirmOrderAdjustment = () => {
    setIsConfirmedSubmit(true);
    setShowOrderConflictModal(false);

    const formElement = document.getElementById('banner-form') as HTMLFormElement;
    if (formElement) {
       formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const handleCancelOrderAdjustment = () => {
    setIsConfirmedSubmit(false);
    setShowOrderConflictModal(false);
  };

  return (
    <form onSubmit={handleSubmit} id="banner-form" className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`border rounded px-4 py-2 w-full ${errors.title ? 'border-red-500' : ''}`}
          required
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
          Thứ tự
        </label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleChange}
          className={`border rounded px-4 py-2 w-full ${errors.order ? 'border-red-500' : ''}`}
          min="1"
          required
        />
        {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
          required
        >
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
            Ngày bắt đầu
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="border rounded px-4 py-2 w-full"
            min={today}
          />
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
            Ngày kết thúc
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className={`border rounded px-4 py-2 w-full ${errors.end_date ? 'border-red-500' : ''}`}
            min={formData.start_date || today}
          />
          {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
        </div>
      </div>

      <div>
        <ImageUploadPreview
          images={images}
          onChange={handleImageChange}
          onRemove={handleImageRemove}
        />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
      </div>

      <div className="flex gap-4">
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || isConfirmedSubmit}
        >
          {loading ? 'Đang xử lý...' : (initialData ? 'Cập nhật' : 'Thêm mới')}
        </button>
        <button 
          type="button" 
          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          onClick={() => navigate('/admin/banners')}
          disabled={loading || isConfirmedSubmit}
        >
          Hủy
        </button>
      </div>

      {/* Order Conflict Confirmation Modal */}
      {showOrderConflictModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Xung đột thứ tự</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {orderConflictMessage}
                </p>
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={handleCancelOrderAdjustment}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmOrderAdjustment}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Xác nhận thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default BannerForm; 