import { useNavigate, useParams } from 'react-router-dom';
import IngredientForm from './IngredientForm';
import { useCRUDIngredients } from '@/hooks/useCRUDIngredients';

const EditIngredientPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    ingredient,
    loading,
    error,
    updateIngredient,
  } = useCRUDIngredients(slug);

  if (loading) return <p>Đang tải dữ liệu nguyên liệu...</p>;
  if (error || !ingredient) {
    return <p className="text-red-500">Không tìm thấy nguyên liệu.</p>;
  }

  const initialData = {
    name: ingredient.name,
    slug: ingredient.slug,
    unit: ingredient.unit || 'kg',
    group: ingredient.group || '',
    subGroup: ingredient.subGroup || '',
    price_per_unit: ingredient.price_per_unit,
    lowStockThreshold: ingredient.lowStockThreshold || 0,
    _id: ingredient._id,
    createdAt: ingredient.createdAt,
    updatedAt: ingredient.updatedAt,
    isDeleted: ingredient.isDeleted,
    deletedAt: ingredient.deletedAt || null,
  };

  const handleSubmit = (data: {
    name: string;
    slug: string;
    unit: string;
    group?: string;
    subGroup?: string;
    price_per_unit: number;
    lowStockThreshold?: number;
  }) => {
    updateIngredient(data, ingredient._id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => navigate('/admin/ingredients')}
        type="button"
        className="relative mb-4 text-admintext text-sm hover:after:w-full after:transition-all after:duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-admintext"
      >
        ← Quay lại danh sách
      </button>

      <IngredientForm
        initialData={{
          ...initialData,
          currentStock: ingredient.currentStock,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditIngredientPage;
