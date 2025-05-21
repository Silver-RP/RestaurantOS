import { useFoodDetail } from '@hooks/useFoods';
import { useNavigate, useParams } from 'react-router-dom';
import FoodForm from './FoodForm';
import { useCategories } from '@hooks/useCategories';
import { useCRUDFoods } from '@/hooks/useCRUDFoods';

const EditFoodPage = () => {
  const { slug } = useParams();
  const { food, loading, error } = useFoodDetail(slug || '');
  const { categories } = useCategories();
  const { updateFood } = useCRUDFoods();
  const navigate = useNavigate();
  const foodId = food?._id;

  if (loading) return <p>Đang tải dữ liệu món ăn...</p>;
  if (error || !food)
    return <p className="text-red-500">Không tìm thấy món ăn.</p>;
    
  const initialData = {
    ...food,
    existingImages: JSON.stringify(food.images),
    imagesPreview: food.images,
  };

  const handleSubmit = (formData: FormData) => {
    updateFood(formData, foodId || '');
  };

  return (
    <div className="relative">
      <button
        onClick={() => navigate('/admin/foods')}
        type="button"
        className="relative mb-4 text-admintext text-sm hover:after:w-full after:transition-all after:duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-admintext"
      >
        ← Quay lại danh sách
      </button>

      <FoodForm
        initialData={initialData}
        submitLabel="Lưu chỉnh sửa"
        categories={categories?.data || []}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditFoodPage;
