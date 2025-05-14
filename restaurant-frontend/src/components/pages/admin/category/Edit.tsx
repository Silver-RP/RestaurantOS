import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCategoryDetail, useUpdateCategory } from '@hooks/useCategories';
import CategoryForm from './CategoryForm';
import { CategoryCreatePayload } from '@/types/Category.type';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { showOverlayLoading, hideOverlayLoading } from '@/redux/feature/loadingUI/uiSlice';
const EditCategoryPage = () => {
  const { id } = useParams();
  const { category, error } = useCategoryDetail(id || '');
  const { updateExistingCategory, loading: updating } = useUpdateCategory();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  if (updating) return <p>Đang tải danh mục...</p>;
  if (error || !category) return <p className="text-red-500">Không tìm thấy danh mục.</p>;

  const handleSubmit = async (data: CategoryCreatePayload) => {
    if (!id) return;
    dispatch(showOverlayLoading()); 
    await updateExistingCategory(id, data, () => {
      toast.success('Cập nhật danh mục thành công!');
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
        initialData={category}
        loading={updating}
        submitLabel={updating ? 'Đang cập nhật...' : 'Cập nhật danh mục'}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditCategoryPage;
