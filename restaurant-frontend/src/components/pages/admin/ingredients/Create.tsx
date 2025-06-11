import React from 'react';
import IngredientForm from './IngredientForm';
import { useNavigate } from 'react-router-dom';
import { useCRUDIngredients } from '../../../../hooks/useCRUDIngredients';

const CreateFoodPage = () => {
  const { createIngredient } = useCRUDIngredients();
  const navigate = useNavigate();

  const handleSubmit = (data: {
    name: string;
    slug: string;
    unit: string;
    price_per_unit: number;
    lowStockThreshold?: number;
  }) => {
    createIngredient(data);
  };
  
  return (
    <div>
      <button
        onClick={() => navigate('/admin/ingredients')}
        type="button"
        className="relative mb-4 text-admintext text-sm hover:after:w-full after:transition-all after:duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-admintext"
      >
        ← Quay lại danh sách
      </button>

      <IngredientForm
        initialData={undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateFoodPage;
