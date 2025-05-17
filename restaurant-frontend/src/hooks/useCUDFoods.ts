import { createFoodApi } from '@/api/FoodApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useCUDFoods = () => {
    const navigate = useNavigate();
    const createFood = async (formData: FormData) => {
        try {
            await createFoodApi(formData); 
            toast.success('Thêm món ăn thành công');
            navigate('/admin/foods');
        } catch (error) {
            toast.error('Thêm món ăn thất bại');
            console.error('Lỗi khi thêm món ăn:', error);
        }
    };
    return {
        createFood,
    };
}