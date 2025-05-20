import { createFoodApi } from '@/api/FoodApi';
import { useNavigate } from 'react-router-dom';
import { showOverlayLoading, hideOverlayLoading } from '@/redux/feature/loadingUI/uiSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export const useCUDFoods = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const createFood = async (formData: FormData) => {
        dispatch(showOverlayLoading());
        try {
            await createFoodApi(formData); 
            toast.success('Thêm món ăn thành công');
            navigate('/admin/foods');
        } catch (error) {
            toast.error('Thêm món ăn thất bại');
            console.error('Lỗi khi thêm món ăn:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    };
    return {
        createFood,
    };
}