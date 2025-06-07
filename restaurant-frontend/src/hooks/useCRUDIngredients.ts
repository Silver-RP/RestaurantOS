import { useNavigate } from 'react-router-dom';
import { showOverlayLoading, hideOverlayLoading } from '@/redux/feature/loadingUI/uiSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    createIngredientApi, 
    updateIngredientApi, 
    softDeleteIngredientApi, 
    restoreIngredientAPI, 
    permanentlyDeleteIngredientAPI 
} from '@/api/IngredientsApi';


export const useCRUDIngredients = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const createIngredient = async (data:{
        name: string;
        slug: string;
        unit: string;
        price_per_unit: number;
    }) => {
        dispatch(showOverlayLoading("Đang thêm nguyên liệu..."));
        try {
            await createIngredientApi(data);
            toast.success('Thêm nguyên liệu thành công');
            navigate('/admin/ingredients');
        } catch (error) {
            toast.error('Thêm nguyên liệu thất bại');
            console.error('Lỗi khi thêm nguyên liệu:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    };

    const updateIngredient = async (data:{
        name: string;
        slug: string;
        unit: string;
        price_per_unit: number;
    }, foodId: string) => {
        dispatch(showOverlayLoading("Đang cập nhật nguyên liệu..."));
        try {
            await updateIngredientApi(data, foodId);
            toast.success('Cập nhật nguyên liệu thành công');
            navigate('/admin/ingredients');
        } catch (error) {
            toast.error('Cập nhật nguyên liệu thất bại');
            console.error('Lỗi khi cập nhật nguyên liệu:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const confirmDeleteIngredient = async (foodId: string) => {
        dispatch(showOverlayLoading("Đang xóa nguyên liệu..."));
        try {
            await softDeleteIngredientApi(foodId);
            toast.success('Xóa nguyên liệu thành công');
            navigate('/admin/ingredients');
        } catch (error) {
            toast.error('Xóa nguyên liệu thất bại');
            console.error('Lỗi khi xóa nguyên liệu:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const restoreIngredient = async (foodId: string) => {
        dispatch(showOverlayLoading("Đang khôi phục nguyên liệu..."));
        try {
            console.log('RestoreFood foodId react: ', foodId);
            await restoreIngredientAPI(foodId);
            toast.success('Khôi phục nguyên liệu thành công');
            setTimeout(() => { navigate(0); }, 1500);
        } catch (error) {
            toast.error('Khôi phục nguyên liệu thất bại');
            console.error('Lỗi khi khôi phục nguyên liệu:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const permanentDeleteIngredient = async (foodId: string) => {
        dispatch(showOverlayLoading("Đang xóa vĩnh viễn nguyên liệu..."));
        try {
            await permanentlyDeleteIngredientAPI(foodId);
            toast.success('Xóa vĩnh viễn nguyên liệu thành công');
            setTimeout(() => { navigate(0); }, 1500);
        } catch (error: any) {
            let errorMessage = 'Không thể xoá';
          
            if (error.response && error.response.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
          
            toast.error(errorMessage);
            console.error('Lỗi khi xóa vĩnh viễn nguyên liệu:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    return {
        createIngredient, updateIngredient, confirmDeleteIngredient, restoreIngredient, permanentDeleteIngredient
    };
}

