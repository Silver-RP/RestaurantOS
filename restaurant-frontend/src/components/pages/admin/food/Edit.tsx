import { useFoodDetail } from '@hooks/useFoods';
import { useNavigate, useParams } from 'react-router-dom';
import FoodForm from './FoodForm';
import React from 'react';
import { useCategories } from '@hooks/useCategories';

const EditFoodPage = () => {
  const { slug } = useParams();
  const { food, loading, error } = useFoodDetail(slug || '');
  const { categories } = useCategories();
  const navigate = useNavigate();

  if (loading) return <p>Đang tải dữ liệu món ăn...</p>;
  if (error || !food) return <p className="text-red-500">Không tìm thấy món ăn.</p>;

  return (
    <div className="relative">
      <button
        onClick={() => navigate('/admin/foods')}
        type="button"
        className="absolute top-0 left-0 text-admintext hover:underline text-sm"
      >
        ← Quay lại danh sách
      </button>

      <FoodForm
        initialData={food}
        submitLabel="Cập nhật món ăn"
        categories={categories?.data || []}
        onSubmit={(formData) => {
          console.log('Submited form', formData);
        }}
      />
    </div>
  );
};

export default EditFoodPage;