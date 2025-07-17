import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from './CategoryForm';
import { CategoryCreatePayload } from '@/types/Category.type';
import { useAddCategory } from '@/hooks/useCategories';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { showOverlayLoading, hideOverlayLoading } from '@/redux/feature/loadingUI/uiSlice';
const CreateCategoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addNewCategory, error, successMessage } = useAddCategory();

  const handleSubmit = async (data: CategoryCreatePayload) => {
    dispatch(showOverlayLoading()); 
    await addNewCategory(data, () => {
      toast.success('Thêm danh mục thành công!');
      navigate('/admin/categories');
    });
    dispatch(hideOverlayLoading()); 
  };

  return (
    <div className="relative">
      <button
        onClick={() => navigate('/admin/categories')}
        type="button"
        className="absolute top-0 left-0 text-admintext hover:underline text-sm"
      >
        ← Quay lại danh sách
      </button>

      <CategoryForm
        initialData={undefined}
        submitLabel={'Thêm danh mục'}
        onSubmit={handleSubmit}
        loading={false}
        error={error}
        successMessage={successMessage}
      />
    </div>
  );
};

export default CreateCategoryPage;
