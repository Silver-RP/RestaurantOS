import { createFoodApi, updateFoodApi } from '@/api/FoodApi';
import { useNavigate } from 'react-router-dom';
import { showOverlayLoading, hideOverlayLoading } from '@/redux/feature/loadingUI/uiSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import { Category } from 'types/Category.type';
import { FoodDetail } from 'types/Dish.types';

export const useCUDFoods = () => {
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

    return {
        createFood, updateFood
    };
}

// Foods create page logic
interface UseFoodFormProps {
    initialData?: FoodDetail;
    categories: Category[];
    onSubmit: (formData: FormData) => void;
}

export function useFoodLogic({ initialData, categories, onSubmit }: UseFoodFormProps) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState<'hidden' | 'available' | 'soldout'>('available');
    const [price, setPrice] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [discountUntil, setDiscountUntil] = useState<Date | null>(null);
    const [isDishNew, setIsDishNew] = useState(false);
    const [newUntil, setNewUntil] = useState<Date | null>(null);
    const [description, setDescription] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [images, setImages] = useState<(File | string)[]>([]);
    const [countInStock, setCountInStock] = useState(0);
    const [origin, setOrigin] = useState('');
    const [alcoholType, setAlcoholType] = useState('');
    const [alcoholContent, setAlcoholContent] = useState(0);
    const [volume, setVolume] = useState(0);

    const selectedCategory = categories.find((c) => c._id === categoryId);
    const isAlcoholCategory = selectedCategory?.Cate_name.toLowerCase().includes('đồ uống có cồn');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setSlug(initialData.slug);
            setCategoryId(initialData.categories?.[0]?._id || '');
            setStatus(initialData.status);
            setPrice(initialData.price);
            setDiscountPrice(initialData.discount_price || 0);
            setDiscountUntil(initialData.discountUntil || null);
            setIsDishNew(initialData.isDishNew || false);
            setNewUntil(initialData.newUntil || null);
            setDescription(initialData.description || '');
            setShortDescription(initialData.shortDescription || '');
            setIngredients(initialData.ingredients || '');
            setImages(initialData.imagesPreview || []);
            setCountInStock(initialData.countInStock);
            setOrigin(initialData.origin || '');
            setAlcoholType(initialData.alcohol_type || '');
            setAlcoholContent(initialData.alcohol_content || 0);
            setVolume(initialData.volume || 0);
        }
    }, [initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList) return;
        const newFiles = Array.from(fileList);
        if (images.length + newFiles.length > 5) {
            toast.error('Chỉ được tải lên tối đa 5 ảnh');
            return;
        }
        setImages((prev) => [...prev, ...newFiles]);
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const generateSlug = (value: string) => slugify(value, { lower: true, strict: true });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || name.length < 3) return toast.error('Tên món ăn phải có ít nhất 3 ký tự');
        if (price < 0) return toast.error('Giá phải lớn hơn hoặc bằng 0');
        if (discountPrice < 0 || discountPrice > price)
            return toast.error('Giá khuyến mãi phải nhỏ hơn hoặc bằng giá gốc và >= 0');
        if (countInStock < 0) return toast.error('Số lượng tồn kho phải >= 0');
        if (!description.trim()) return toast.error('Mô tả không được để trống');
        if (!categoryId) return toast.error('Phải chọn danh mục');
        if (!['hidden', 'available', 'soldout'].includes(status)) return toast.error('Trạng thái không hợp lệ');
        if (isDishNew && newUntil && newUntil <= new Date())
            return toast.error('Ngày kết thúc món mới phải lớn hơn hiện tại');
        if (discountPrice > 0 && discountUntil && discountUntil <= new Date())
            return toast.error('Ngày kết thúc khuyến mãi phải lớn hơn hiện tại');
        if (images.length === 0) return toast.error('Phải chọn ít nhất 1 ảnh');
        if (images.length > 5) return toast.error('Tối đa 5 ảnh');
        if (alcoholContent < 0 || alcoholContent > 100)
            return toast.error('Nồng độ cồn phải từ 0 đến 100');
        if (volume && volume < 0) return toast.error('Thể tích phải >= 0');

        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('slug', slug.trim());
        formData.append('price', String(price));
        formData.append('discount_price', String(discountPrice));
        formData.append('countInStock', String(countInStock));
        formData.append('description', description.trim());
        formData.append('shortDescription', shortDescription.trim());
        formData.append('ingredients', ingredients.trim());
        formData.append('category', categoryId);
        formData.append('status', status);
        formData.append('isDishNew', String(isDishNew));
        if (isDishNew && newUntil) formData.append('newUntil', newUntil.toISOString());
        if (discountPrice > 0 && discountUntil) formData.append('discountUntil', discountUntil.toISOString());
        if (isAlcoholCategory) {
            formData.append('origin', origin.trim());
            formData.append('alcohol_type', alcoholType.trim());
            formData.append('alcohol_content', String(alcoholContent));
            formData.append('volume', String(volume));
        }
        const existing = images.filter((img) => typeof img === 'string') as string[];
        const newImages = images.filter((img) => typeof img !== 'string') as File[];
        formData.append('existingImages', JSON.stringify(existing));
            newImages.forEach((file) => {
                formData.append('images', file);
        });
       
        onSubmit(formData);
    };

    return {
        // States
        name, setName, slug, setSlug, categoryId, setCategoryId, status, setStatus,
        price, setPrice, discountPrice, setDiscountPrice, discountUntil, setDiscountUntil,
        isDishNew, setIsDishNew, newUntil, setNewUntil, description, setDescription,
        shortDescription, setShortDescription, ingredients, setIngredients, images,
        handleImageChange, handleRemoveImage, countInStock, setCountInStock,
        origin, setOrigin, alcoholType, setAlcoholType, alcoholContent, setAlcoholContent,
        volume, setVolume,
        handleSubmit, generateSlug,
        isAlcoholCategory,
    };
}
