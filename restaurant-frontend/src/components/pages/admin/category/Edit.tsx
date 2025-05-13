import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCategoryDetail } from '@hooks/useCategories';
import CategoryForm from './CategoryForm';

const EditCategoryPage = () => {
  const { id } = useParams();
  const { category, loading, error } = useCategoryDetail(id || '');
  const navigate = useNavigate();
  console.log(id)
  if (loading) return <p>Đang tải danh mục...</p>;
  if (error || !category) return <p className="text-red-500">Không tìm thấy danh mục.</p>;

  const handleSubmit = (formData: FormData) => {
    console.log('Submited form', formData);
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
        initialData={category}
        submitLabel="Cập nhật danh mục"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditCategoryPage;