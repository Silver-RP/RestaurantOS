import { useFoodsAdmin, useFoodsTrash } from './useFoods';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import { Category } from 'types/Category.type';
import { FoodDetail } from 'types/Dish.types';
import { toast } from 'react-toastify';
import { useCRUDFoods } from './useCRUDFoods';
import { fetchAllIngredients } from '../api/IngredientsApi';
import { Ingredient } from '@/types/IngredientType';

type SortField =
  | 'name'
  | 'price'
  | 'discount_price'
  | 'countInStock'
  | 'views'
  | 'category'
  | 'ordered_count'
  | 'average_rating'
  | 'status'
  | 'deletedAt'
  | null;

type SortDirection = 'asc' | 'desc';
type IngredientStatus = 'original' | 'edited' | 'deleted' ;
type IngredientField = {
  _id?: string;
  ingredientId?: string;
  name: string;
  quantity: string;
  unit: string;
  _status?: IngredientStatus;
};

// Foods index page logic
export function useFoodsAdminLogic() {
  const { foods, loading, error, searchParams, setSearchParams } = useFoodsAdmin();
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const foodList = foods?.docs || [];

  const sortMapping: Record<string, { asc: string; desc: string }> = {
    name: { asc: 'nameAZ', desc: 'nameZA' },
    price: { asc: 'priceLow', desc: 'priceHigh' },
    discount_price: { asc: 'discountLow', desc: 'discountHigh' },
    countInStock: { asc: 'stockHigh', desc: 'stockLow' },
    views: { asc: 'leastViews', desc: 'mostViewed' },
    ordered_count: { asc: 'leastOrdered', desc: 'mostOrdered' },
    average_rating: { asc: 'lowestRated', desc: 'highestRated' },
    category: { asc: 'categoryAZ', desc: 'categoryZA' },
    status: { asc: 'statusAZ', desc: 'statusZA' },
  };

  const handleSort = (field: string) => {
    const direction =
      sortField === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';

    setSortField(field as SortField);
    setSortDirection(direction);

    const sortValue = sortMapping[field]?.[direction] || 'default';

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', sortValue);
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (search.trim()) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set('keyword', search.trim());
          newParams.set('page', '1');
          return newParams;
        });
      } else {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.delete('keyword');
          newParams.set('page', '1');
          return newParams;
        });
      }
    }
  };

  const handleClick = () => {
    if (search.trim()) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('keyword', search.trim());
        newParams.set('page', '1');
        return newParams;
      });
    } else {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('keyword');
        newParams.set('page', '1');
        return newParams;
      });
    }
  };


  const getSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 'asc' : 'desc';
    }
    return null;
  };

  return {
    foods,
    loading,
    error,
    searchParams,
    setSearchParams,
    sortField,
    sortDirection,
    showFilterPanel,
    setShowFilterPanel,
    search,
    setSearch,
    navigate,
    foodList,
    handleSort,
    handleEnter,
    handleClick,
    getSortIcon,
  };
}

// Foods create/update page logic
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
  const [isRecommend, setIsRecommend] = useState(false);
  const [recommendUntil, setRecommendUntil] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [images, setImages] = useState<(File | string)[]>([]);
  const [countInStock, setCountInStock] = useState(0);
  const [origin, setOrigin] = useState('');
  const [alcoholType, setAlcoholType] = useState('');
  const [alcoholContent, setAlcoholContent] = useState(0);
  const [volume, setVolume] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const selectedCategory = categories.find((c) => c._id === categoryId);
  const isAlcoholCategory = selectedCategory?.Cate_name.toLowerCase().includes('đồ uống có cồn');
  const { confirmDeleteDish } = useCRUDFoods();
  const navigate = useNavigate();

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
      setIsRecommend(initialData.isRecommend || false);
      setRecommendUntil(initialData.recommendUntil || null);
      setDescription(initialData.description || '');
      setShortDescription(initialData.shortDescription || '');
      setIngredients(initialData.ingredients || '');
      setImages(initialData.imagesPreview || []);
      setCountInStock(initialData.countInStock);
      setOrigin(initialData.origin || '');
      setAlcoholType(initialData.alcohol_type || '');
      setAlcoholContent(initialData.alcohol_content || 0);
      setVolume(initialData.volume || 0);
      setIsDeleted(initialData.isDeleted || false);
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
    if (isRecommend && recommendUntil && recommendUntil <= new Date())
      return toast.error('Ngày kết thúc món đề xuất phải lớn hơn hiện tại');
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
    if (isDishNew && newUntil) {
      const date = new Date(newUntil); 
      formData.append('newUntil', date.toISOString());
    }
    formData.append('isRecommend', String(isRecommend));
    if (isRecommend && recommendUntil) {
      const date = new Date(recommendUntil);
      formData.append('recommendUntil', date.toISOString());
    }
    
    if (discountPrice > 0 && discountUntil) {
      formData.append('discountUntil', new Date(discountUntil).toISOString());
    }
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

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {

    if (!initialData?._id) {
      toast.error("Không tìm thấy ID món ăn");
      return;
    }
    await confirmDeleteDish(initialData._id);
    setShowConfirm(false);
    navigate('/admin/foods');
  };


  return {
    // States
    name, setName, slug, setSlug, categoryId, setCategoryId, status, setStatus,
    price, setPrice, discountPrice, setDiscountPrice, discountUntil, setDiscountUntil,
    isDishNew, setIsDishNew, newUntil, setNewUntil, isRecommend, setIsRecommend, recommendUntil, setRecommendUntil, description, setDescription,
    shortDescription, setShortDescription, ingredients, setIngredients, images,
    handleImageChange, handleRemoveImage, countInStock, setCountInStock,
    origin, setOrigin, alcoholType, setAlcoholType, alcoholContent, setAlcoholContent,
    volume, setVolume,
    handleSubmit, generateSlug,
    isAlcoholCategory, handleDeleteClick, showConfirm, setShowConfirm, handleConfirmDelete,

  };
}

// Foods trash page logic
export function useFoodsTrashLogic() {
  const { foods, loading, error, searchParams, setSearchParams } = useFoodsTrash();
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [search, setSearch] = useState('');
  const [foodIdToRestore, setFoodIdToRestore] = useState<string | null>(null);
  const [foodIdToDelete, setFoodIdToDelete] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { restoreFood, permanentDeleteFood } = useCRUDFoods();

  const navigate = useNavigate();

  const foodList = foods?.docs || [];

  const sortMapping: Record<string, { asc: string; desc: string }> = {
    name: { asc: 'nameAZ', desc: 'nameZA' },
    price: { asc: 'priceLow', desc: 'priceHigh' },
    category: { asc: 'categoryAZ', desc: 'categoryZA' },
    deletedAt: { asc: 'deletedAtOld', desc: 'deletedAtNew' },
    status: { asc: 'statusAZ', desc: 'statusZA' },
  };

  const handleSort = (field: string) => {
    const direction =
      sortField === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';

    setSortField(field as SortField);
    setSortDirection(direction);

    const sortValue = sortMapping[field]?.[direction] || 'default';

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', sortValue);
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (search.trim()) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set('keyword', search.trim());
          newParams.set('page', '1');
          return newParams;
        });
      } else {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.delete('keyword');
          newParams.set('page', '1');
          return newParams;
        });
      }
    }
  };

  const handleClick = () => {
    if (search.trim()) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('keyword', search.trim());
        newParams.set('page', '1');
        return newParams;
      });
    } else {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('keyword');
        newParams.set('page', '1');
        return newParams;
      });
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 'asc' : 'desc';
    }
    return null;
  };

  const handleRestoreClick = (foodId: string) => {
    setShowConfirm(true);
    setFoodIdToRestore(foodId);
  }

  const handleConfirmRestore = async (foodId: string) => {
    if (!foodId) return;

    try {
      await restoreFood(foodId);
      setShowConfirm(false);
    } catch (error) {
    }
  }

  const handlePermanentDeleteClick = (foodId: string) => {
    setShowConfirm(true);
    setFoodIdToDelete(foodId);
  }

  const handleConfirmPermanentDelete = async (foodId: string) => {
    if (!foodId) return;

    try {
      await permanentDeleteFood(foodId);
      setShowConfirm(false);
    } catch (error) {
    }
  }

  return {
    foods,
    loading,
    error,
    searchParams,
    setSearchParams,
    sortField,
    sortDirection,
    search,
    setSearch,
    navigate,
    foodList,
    handleSort,
    handleEnter,
    handleClick,
    getSortIcon,
    showConfirm,
    setShowConfirm,
    foodIdToRestore,
    setFoodIdToRestore,
    foodIdToDelete,
    setFoodIdToDelete,
    handleRestoreClick,
    handleConfirmRestore,
    handlePermanentDeleteClick,
    handleConfirmPermanentDelete,
  };
}

export function useDishIngredient(dishId: string, onClose: () => void) {
  const [dataDishIngredients, setDataDishIngredients] = useState<any[]>([]);
  const [dishData, setDishData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInputRows, setShowInputRows] = useState(false);
  const [ingredientOptions, setIngredientOptions] = useState<Ingredient[]>([]);
  const [newIngredients, setNewIngredients] = useState<IngredientField[]>([]);
  const { getDishIngredients, addDishIngredient, updateDishIngredient, deleteDishIngredient } = useCRUDFoods();

  const fetchData = async (dishId: string) => {
    try {
      setIsLoading(true);
      const data = await getDishIngredients(dishId);
      const ingredientList = await fetchAllIngredients({ limit: 1000, sort: 'nameAZ' });
      setIngredientOptions(ingredientList.docs);

      if (!data?.dish) {
        throw new Error('Dish not found');
      }

      setDishData(data.dish);
      setDataDishIngredients(data.ingredients || []);

    } catch (err) {
      setError('Lỗi khi tải nguyên liệu món ăn');
      console.error('Lỗi khi tải nguyên liệu món ăn:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dishId);
  }, [dishId]);

 
  const handleDeleteNewIngredient = (index: number) => {
    const updated = [...newIngredients];
    updated.splice(index, 1);
    setNewIngredients(updated);
  
    if (updated.length === 0) setShowInputRows(false); // ẩn lại nếu không còn dòng
  };

  const handleNewIngredientChange = (
    index: number,
    field: keyof IngredientField,
    value: string
  ) => {
    const updated = [...newIngredients];
  
    if (field === '_status') {
      if (['original', 'edited', 'deleted'].includes(value)) {
        updated[index]._status = value as IngredientStatus;
      }
    } else {
      updated[index][field] = value;
    }
  
    setNewIngredients(updated);
  };

  const handleSave = async () => {
    for (const item of newIngredients) {
      if (!item.ingredientId || !item.quantity || !item.unit) {
        toast.error('Vui lòng điền đầy đủ thông tin nguyên liệu!');
        return;
      }
    }

    const toUpdate = dataDishIngredients.filter((i: { _status: string; }) => i._status === 'edited');
    const toDelete = dataDishIngredients.filter((i: { _status: string; }) => i._status === 'deleted');

    if (newIngredients.length === 0 && toUpdate.length === 0 && toDelete.length === 0) {
      toast.info('Không có thay đổi nào để lưu');
      return;
    }
    
    try {
      if (newIngredients.length > 0) {
        const payload = newIngredients.map((item) => ({
          _id: item._id,
          ingredientId: item.ingredientId,
          quantity: Number(item.quantity),
          unit: item.unit,
        }));
        await addDishIngredient(payload, dishId);
      }
    
      if (toUpdate.length > 0) {
        const payload = toUpdate.map((item) => ({
          _id: item._id,
          ingredientId: item.ingredientId,
          quantity: Number(item.quantity),
          unit: item.unit,
        }));
        await updateDishIngredient(payload, dishId);
      }
    
      if (toDelete.length > 0) {
        const ids = toDelete.map((item) => item._id); 
        await deleteDishIngredient(ids, dishId);
      }
    
      await fetchData(dishId); 
    
      setDataDishIngredients([]); 
      setNewIngredients([]);
      setShowInputRows(false);
      toast.success('Cập nhật nguyên liệu thành công');
      onClose();
    } catch (err) {
      setError('Lỗi khi cập nhật nguyên liệu món ăn');
      console.error('Lỗi khi lưu nguyên liệu món ăn:', err);
    }
  };

  const handleStartEdit = (id: string) => {
    setDataDishIngredients((prev: any[]) =>
      prev.map((item) => {
        if (item._id !== id) return item;
  
        const { _status, _original, ...cleanItem } = item; 
  
        return {
          ...item,
          _original: { ...cleanItem }, 
          _status: 'edited' as IngredientStatus,
        };
      })
    );
  };

  const handleUpdateIngredient = (
    id: string,
    field: keyof IngredientField,
    value: string,
  ) => {
    setDataDishIngredients((prev: any[]) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, [field]: value, _status: 'edited' as IngredientStatus }
          : item,
      ),
    );
  };

  const handleCancelEdit = (id: string) => {
    setDataDishIngredients((prev: any[]) =>
      prev.map((item) => {
        if (item._id === id && item._original) {
          const { _original } = item;
          return {
            ..._original,
            _status: 'original' as IngredientStatus,
          };
        }
        return item;
      })
    );
  };
  
  const handleSoftDelete = (id: string) => {
    setDataDishIngredients((prev: any[]) =>
      prev.map((item) => {
        if (item._id !== id) return item;
  
        const { _status, _original, ...cleanItem } = item;
  
        return {
          ...item,
          _status: 'deleted' as IngredientStatus,
          _original: _original || { ...cleanItem },
        };
      })
    );
  };
  
  const handleUndoDelete = (id: string) => {
    setDataDishIngredients((prev: any[]) =>
      prev.map((item) => {
        if (item._id !== id) return item;
  
        if (item._original) {
          return {
            ...item._original,
            _status: 'original' as IngredientStatus,
          };
        }
  
        return {
          ...item,
          _status: 'original' as IngredientStatus,
        };
      })
    );
  };
  
  const hasIngredients = dataDishIngredients && dataDishIngredients.length > 0;

  return { dataDishIngredients, isLoading, error, 
    handleUpdateIngredient, dishData,
    showInputRows, ingredientOptions, handleSave,
    setShowInputRows, handleDeleteNewIngredient, 
    setNewIngredients, hasIngredients, newIngredients, 
    handleNewIngredientChange, handleSoftDelete, 
    handleUndoDelete, handleStartEdit, handleCancelEdit,
  };
}


