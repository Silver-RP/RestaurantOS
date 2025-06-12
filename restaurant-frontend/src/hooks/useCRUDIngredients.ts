import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { showOverlayLoading, hideOverlayLoading } from '@/redux/feature/loadingUI/uiSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
    createIngredientApi,
    getIngredientBySlugApi,
    updateIngredientApi,
    softDeleteIngredientApi,
    getIngredientTrashedApi,
    restoreIngredientAPI,
    permanentlyDeleteIngredientAPI
} from '@/api/IngredientsApi';
import { IngredientFilterParams } from '@/types/IngredientType';


export const useCRUDIngredients = (slug?: string) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ingredient, setIngredient] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(!!slug);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!slug) return;

        const fetchIngredient = async () => {
            dispatch(showOverlayLoading('Đang tải nguyên liệu...'));
            try {
                const response = await getIngredientBySlugApi(slug);
                if (!response) {
                    throw new Error('Không tìm thấy nguyên liệu');
                }
                setIngredient(response);
            } catch (err) {
                setError(true);
                console.error('Lỗi khi tải nguyên liệu:', err);
            } finally {
                dispatch(hideOverlayLoading());
                setLoading(false);
            }
        };

        fetchIngredient();
    }, [slug]);

    const createIngredient = async (data: {
        name: string;
        slug: string;
        unit: string;
        group?: string;
        subGroup?: string;
        price_per_unit: number;
        lowStockThreshold?: number;
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

    const getIngredientBySlug = async (slug: string) => {
        dispatch(showOverlayLoading("Đang tải nguyên liệu..."));
        try {
            const response = await getIngredientBySlugApi(slug);
            if (!response.docs || response.docs.length === 0) {
                throw new Error('Không tìm thấy nguyên liệu');
            }
            console.log('Ingredient data 1:', response.docs[0]);
            const data = response.docs[0];
            return data;
        } catch (error) {
            console.error('Lỗi khi tải nguyên liệu:', error);
            throw error;
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const updateIngredient = async (data: {
        name: string;
        slug: string;
        unit: string;
        price_per_unit: number;
        lowStockThreshold?: number;
    }, ingredientId: string) => {
        dispatch(showOverlayLoading("Đang cập nhật nguyên liệu..."));
        try {
            await updateIngredientApi(data, ingredientId);
            toast.success('Cập nhật nguyên liệu thành công');
            navigate('/admin/ingredients');
        } catch (error) {
            toast.error('Cập nhật nguyên liệu thất bại');
            console.error('Lỗi khi cập nhật nguyên liệu:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const confirmDeleteIngredient = async (ingredientId: string) => {
        dispatch(showOverlayLoading("Đang xóa nguyên liệu..."));
        try {
            await softDeleteIngredientApi(ingredientId);
            toast.success('Xóa nguyên liệu thành công');
            navigate('/admin/ingredients');
        } catch (error) {
            toast.error('Xóa nguyên liệu thất bại');
            console.error('Lỗi khi xóa nguyên liệu:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const getIngredientTrashed = async (params: IngredientFilterParams = {}) => {
        dispatch(showOverlayLoading("Đang tải nguyên liệu đã xóa..."));
        try {
            const response = await getIngredientTrashedApi(params);
            return response;
        } catch (error) {
            console.error("Lỗi khi tải nguyên liệu đã xóa:", error);
            throw error;
        } finally {
            dispatch(hideOverlayLoading());
        }
    };

    const restoreIngredient = async (ingredientId: string) => {
        dispatch(showOverlayLoading("Đang khôi phục nguyên liệu..."));
        try {
            await restoreIngredientAPI(ingredientId);
            toast.success('Khôi phục nguyên liệu thành công');
            setTimeout(() => { navigate(0); }, 1500);
        } catch (error) {
            toast.error('Khôi phục nguyên liệu thất bại');
            console.error('Lỗi khi khôi phục nguyên liệu:', error);
        } finally {
            dispatch(hideOverlayLoading());
        }
    }

    const permanentDeleteIngredient = async (ingredientId: string) => {
        dispatch(showOverlayLoading("Đang xóa vĩnh viễn nguyên liệu..."));
        try {
            await permanentlyDeleteIngredientAPI(ingredientId);
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
        ingredient,
        loading,
        error,
        createIngredient,
        getIngredientBySlug,
        updateIngredient,
        confirmDeleteIngredient,
        getIngredientTrashed,
        restoreIngredient,
        permanentDeleteIngredient
    };
}

