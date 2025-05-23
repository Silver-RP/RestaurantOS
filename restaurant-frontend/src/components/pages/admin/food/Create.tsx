import React from 'react';
import { useCategories } from '@hooks/useCategories';
import FoodForm from './FoodForm';
import { useNavigate } from 'react-router-dom';
import { useCRUDFoods } from '../../../../hooks/useCRUDFoods';

const CreateFoodPage = () => {
  const { categories } = useCategories();
  const { createFood } = useCRUDFoods();
  const navigate = useNavigate();

  const handleSubmit = (formData: FormData) => {
    createFood(formData);
  };

  return (
    <div>
      <button
        onClick={() => navigate('/admin/foods')}
        type="button"
        className="relative mb-4 text-admintext text-sm hover:after:w-full after:transition-all after:duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-admintext"
      >
        ← Quay lại danh sách
      </button>

      <FoodForm
        initialData={undefined}
        categories={categories?.data || []}
        onSubmit={handleSubmit}
        submitLabel="Thêm món ăn"
      />
    </div>
  );
};

export default CreateFoodPage;
