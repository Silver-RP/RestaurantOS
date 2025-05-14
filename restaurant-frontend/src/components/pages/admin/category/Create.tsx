import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from './CategoryForm';
// import { useAddCategory } from '@hooks/useAddCategory';
import { CategoryCreatePayload } from '@/types/Category.type';
import { useAddCategory } from '@/hooks/useCategories';
import { toast } from 'react-toastify';
const CreateCategoryPage = () => {
  const navigate = useNavigate();
  const { addNewCategory, loading, error, successMessage } = useAddCategory();

  const handleSubmit = async (data: CategoryCreatePayload) => {
  await addNewCategory(data, () => {
    toast.success('Thêm danh mục thành công!'); 
    navigate('/admin/categories');
  });
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
        submitLabel={loading ? 'Đang thêm...' : 'Thêm danh mục'}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </div>
  );
};

export default CreateCategoryPage;
