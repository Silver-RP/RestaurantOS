import { createFoodApi, updateFoodApi, softDeleteFood, restoreFoodAPI, permanentlyDeleteFoodAPI } from '@/api/FoodApi';
import { useNavigate } from 'react-router-dom';
import { showOverlayLoading, hideOverlayLoading } from '@/redux/feature/loadingUI/uiSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';


export const useCRUDFoods = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const createFood = async (formData: FormData) => {
        dispatch(showOverlayLoading("Đang thêm món ăn..."));
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

    const updateFood = async (formData: FormData, foodId: string) => {
        dispatch(showOverlayLoading("Đang cập nhật món ăn..."));
        try {
            await updateFoodApi(formData, foodId);
            toast.success('Cập nhật món ăn thành công');
            navigate('/admin/foods');
        } catch (error) {
            toast.error('Cập nhật món ăn thất bại');
            console.error('Lỗi khi cập nhật món ăn:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const confirmDeleteDish = async (foodId: string) => {
        dispatch(showOverlayLoading("Đang xóa món ăn..."));
        try {
            await softDeleteFood(foodId);
            toast.success('Xóa món ăn thành công');
            navigate('/admin/foods');
        } catch (error) {
            toast.error('Xóa món ăn thất bại');
            console.error('Lỗi khi xóa món ăn:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const restoreFood = async (foodId: string) => {
        dispatch(showOverlayLoading("Đang khôi phục món ăn..."));
        try {
            console.log('RestoreFood foodId react: ', foodId);
            await restoreFoodAPI(foodId);
            toast.success('Khôi phục món ăn thành công');
            setTimeout(() => { navigate(0); }, 1500);
        } catch (error) {
            toast.error('Khôi phục món ăn thất bại');
            console.error('Lỗi khi khôi phục món ăn:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const permanentDeleteFood = async (foodId: string) => {
        dispatch(showOverlayLoading("Đang xóa vĩnh viễn món ăn..."));
        try {
            await permanentlyDeleteFoodAPI(foodId);
            toast.success('Xóa vĩnh viễn món ăn thành công');
            setTimeout(() => { navigate(0); }, 1500);
        } catch (error: any) {
            let errorMessage = 'Không thể xoá';
          
            if (error.response && error.response.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
          
            toast.error(errorMessage);
            console.error('Lỗi khi xóa vĩnh viễn món ăn:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    return {
        createFood, updateFood, confirmDeleteDish, restoreFood, permanentDeleteFood
    };
}

