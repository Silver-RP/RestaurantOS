import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import { Ingredient } from '@/types/IngredientType';
import { toast } from 'react-toastify';
import { useCRUDIngredients } from './useCRUDIngredients';

import { fetchAllIngredients } from '../api/IngredientsApi';
import { IngredientResponse, IngredientFilterParams } from '../types/IngredientType';
import { useSearchParams } from 'react-router-dom';
import { IngredientOption } from '../types/IngredientType';
import { ingredientUnits } from '@/types/ingredientUnitsType';


type SortField = 'name' | 'group' | 'unit' | 'price' | 'deletedAt' | 'currentStock' | 'stockStatus' | null;
type SortDirection = 'asc' | 'desc';

export function useIngredientsAdminLogic() {
    const { ingredients, loading, error, searchParams, setSearchParams } = useIngredientsAdmin();
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const ingredientList = ingredients?.docs || [];

    const sortMapping: Record<string, { asc: string; desc: string }> = {
        name: { asc: 'nameAZ', desc: 'nameZA' },
        group: { asc: 'groupAZ', desc: 'groupZA' },
        currentStock: { asc: 'currentLow', desc: 'currentHigh' },
        unit: { asc: 'unitAZ', desc: 'unitZA' },
        price: { asc: 'priceLow', desc: 'priceHigh' },
        stockStatus: { asc: 'stockStatusIn', desc: 'stockStatusOut' },
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

    const formatNumber = (num: number) => Number.isInteger(num) ? num.toString() : num.toFixed(1);

    const formatQuantity = (count: number, unit: string): string => {
        if (unit === 'mg') {
            if (count >= 1_000_000) {
                return `${formatNumber(count / 1_000_000)} Kilogram`;
            }
            if (count >= 1_000) {
                return `${formatNumber(count / 1_000)} Gram`;
            }
        }

        if (unit === 'gram') {
            if (count >= 1_000) {
                return `${formatNumber(count / 1_000)} Kilogram`;
            }
        }

        if (unit === 'ml') {
            if (count >= 1_000) {
                return `${formatNumber(count / 1_000)} Lít`;
            }
        }

        const unitLabel = ingredientUnits.find(u => u.value === unit)?.label || unit;
        return `${formatNumber(count)} ${unitLabel}`;
    };

    return {
        ingredients,
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
        ingredientList,
        handleSort,
        handleEnter,
        handleClick,
        getSortIcon,
        formatQuantity,
    };
}

// Ingredients admin page logic
export const useIngredientsAdmin = () => {
    const [ingredients, setIngredients] = useState<IngredientResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const parseFiltersFromSearchParams = (params: URLSearchParams): IngredientFilterParams => {
        const getNumber = (key: string) => {
            const value = params.get(key);
            return value ? Number(value) : undefined;
        };

        return {
            page: getNumber('page') || 1,
            limit: getNumber('limit') || 12,
            sort: params.get('sort') || 'default',
            search: params.get('keyword') || undefined,
            maxPrice: getNumber('maxPrice'),
            minPrice: getNumber('minPrice'),
            unit: params.get('unit') || undefined,
            group: params.get('group') || undefined,
            stockStatus: params.get('stockStatus') || undefined,
            isDeleted: params.get('isDeleted') === 'true' ? true : undefined,
        };
    };

    useEffect(() => {
        let isMounted = true;

        const loadIngredients = async () => {
            setLoading(true);
            setError(null);

            try {
                const filters = parseFiltersFromSearchParams(searchParams);
                const data = await fetchAllIngredients(filters);

                if (isMounted) {
                    setIngredients(data as IngredientResponse);
                }
            } catch (error) {
                if (isMounted) {
                    setError('Đã xảy ra lỗi khi tải nguyên liệu');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadIngredients();

        return () => {
            isMounted = false;
        };
    }, [searchParams]);

    return {
        ingredients,
        loading,
        error,
        searchParams,
        setSearchParams,
    };
};

// Ingredient create/update page logic
interface UseIngredientFormProps {
    initialData?: Ingredient;
    onSubmit: (data: {
        name: string;
        slug: string;
        unit: string;
        group?: string;
        subGroup?: string;
        price_per_unit: number;
        lowStockThreshold?: number;
    }) => void;
}

export function useIngredientLogic({ initialData, onSubmit }: UseIngredientFormProps) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [unit, setUnit] = useState('');
    const [group, setGroup] = useState('');
    const [subGroup, setSubGroup] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const [lowStockThreshold, setLowStockThreshold] = useState(0);
    const [isDeleted, setIsDeleted] = useState(false);
    const [deletedAt, setDeletedAt] = useState<Date | null>(null);

    const { confirmDeleteIngredient } = useCRUDIngredients();
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setSlug(initialData.slug);
            setUnit(initialData.unit || '');
            setGroup(initialData.group || '');
            setSubGroup(initialData.subGroup || '');
            setPricePerUnit(initialData.price_per_unit || 0);
            setLowStockThreshold(initialData.lowStockThreshold || 0);
            setIsDeleted(initialData.isDeleted || false);
            setDeletedAt(initialData.deletedAt ? new Date(initialData.deletedAt) : null);
        }
    }, [initialData]);

    const generateSlug = (value: string) => slugify(value, { lower: true, strict: true });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedSlug = slug.trim();
        const trimmedUnit = unit.trim();

        if (trimmedName.length < 3) return toast.error('Tên nguyên liệu phải có ít nhất 3 ký tự');
        if (trimmedName.length > 100) return toast.error('Tên nguyên liệu không được quá 100 ký tự');

        if (!trimmedSlug) return toast.error('Slug không được để trống');
        if (trimmedSlug.length < 3) return toast.error('Slug phải có ít nhất 3 ký tự');
        if (trimmedSlug.length > 100) return toast.error('Slug không được quá 100 ký tự');
        if (/\s/.test(trimmedSlug)) return toast.error('Slug không được chứa khoảng trắng');
        if (!/^[a-z0-9-]+$/.test(trimmedSlug)) {
            return toast.error('Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang');
        }

        if (!trimmedUnit) return toast.error('Đơn vị không được để trống');
        if (trimmedUnit.length > 50) return toast.error('Đơn vị không được quá 50 ký tự');

        if (pricePerUnit <= 0) return toast.error('Giá trên đơn vị phải lớn hơn 0');
        if (isNaN(pricePerUnit)) return toast.error('Giá trên đơn vị phải là một số hợp lệ');

        if (lowStockThreshold < 0) return toast.error('Ngưỡng tồn kho thấp không được nhỏ hơn 0');
        if (lowStockThreshold && isNaN(lowStockThreshold)) {
            return toast.error('Ngưỡng tồn kho thấp phải là một số hợp lệ');
        }

        if (isDeleted && !deletedAt) return toast.error('Vui lòng chọn ngày xóa món ăn');
        if (isDeleted && deletedAt && deletedAt > new Date()) {
            return toast.error('Ngày xóa phải là ngày trong quá khứ');
        }

        const data = {
            name: trimmedName,
            slug: trimmedSlug,
            unit: trimmedUnit,
            price_per_unit: pricePerUnit,
            group: group || undefined,
            subGroup: subGroup || undefined,
            lowStockThreshold: lowStockThreshold || 0,
        };

        onSubmit(data);
    };

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {

        if (!initialData?._id) {
            toast.error("Không tìm thấy ID món ăn");
            return;
        }
        await confirmDeleteIngredient(initialData._id);
        setShowConfirm(false);
        navigate('/admin/ingredients');
    };

    return {
        name, setName, slug, setSlug,
        unit, setUnit, group, setGroup,
        subGroup, setSubGroup,
        pricePerUnit, setPricePerUnit,
        lowStockThreshold, setLowStockThreshold,
        isDeleted, setIsDeleted, deletedAt, setDeletedAt,
        handleSubmit, generateSlug,
        handleDeleteClick, showConfirm, setShowConfirm, handleConfirmDelete,

    };
}

// Ingredients trash page logic
export function useIngredientsTrashLogic() {
    const [ingredients, setIngredients] = useState<IngredientResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [sortField, setSortField] = useState<'name' | 'unit' | 'group' | 'price' | 'deletedAt' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [search, setSearch] = useState('');
    const [ingredientIdToRestore, setIngredientIdToRestore] = useState<string | null>(null);
    const [ingredientIdToDelete, setIngredientIdToDelete] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        restoreIngredient,
        permanentDeleteIngredient,
        getIngredientTrashed,
    } = useCRUDIngredients();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const params: IngredientFilterParams = {
                    sort: searchParams.get('sort') || '',
                    page: Number(searchParams.get('page')) || 1,
                    limit: Number(searchParams.get('limit')) || 12,
                    search: searchParams.get('keyword') || '',
                };

                const data = await getIngredientTrashed(params);
                setIngredients(data);
            } catch (err) {
                setError("Không thể tải nguyên liệu đã xóa");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    const ingredientList = ingredients?.docs ?? [];

    const sortMapping: Record<string, { asc: string; desc: string }> = {
        name: { asc: 'nameAZ', desc: 'nameZA' },
        group: { asc: 'groupAZ', desc: 'groupZA' },
        unit: { asc: 'unitAZ', desc: 'unitZA' },
        price: { asc: 'priceLow', desc: 'priceHigh' },
        deletedAt: { asc: 'deletedAtOld', desc: 'deletedAtNew' },
    };

    const handleSort = (field: string) => {
        const direction =
            sortField === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';

        setSortField(field as 'name' | 'unit' | 'price' | 'deletedAt' | null);
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

    const handleRestoreClick = (ingredientId: string) => {
        setShowConfirm(true);
        setIngredientIdToRestore(ingredientId);
    }

    const handleConfirmRestore = async (ingredientId: string) => {
        if (!ingredientId) return;

        try {
            await restoreIngredient(ingredientId);
            setShowConfirm(false);
        } catch (error) {
        }
    }

    const handlePermanentDeleteClick = (ingredientId: string) => {
        setShowConfirm(true);
        setIngredientIdToDelete(ingredientId);
    }

    const handleConfirmPermanentDelete = async (ingredientId: string) => {
        if (!ingredientId) return;

        try {
            await permanentDeleteIngredient(ingredientId);
            setShowConfirm(false);
        } catch (error) {
        }
    }

    return {
        ingredients,
        loading,
        error,
        searchParams,
        setSearchParams,
        sortField,
        sortDirection,
        search,
        setSearch,
        navigate,
        ingredientList,
        handleSort,
        handleEnter,
        handleClick,
        getSortIcon,
        showConfirm,
        setShowConfirm,
        ingredientIdToRestore,
        setIngredientIdToRestore,
        ingredientIdToDelete,
        setIngredientIdToDelete,
        handleRestoreClick,
        handleConfirmRestore,
        handlePermanentDeleteClick,
        handleConfirmPermanentDelete,
    };
}

/* 
    Hook to manage warehouse logic
*/
export interface IngredientInputItem {
    ingredientId: string;
    quantity: string;
    unit: string;
    note: string;
}

export function useIngredientInput(initial: IngredientInputItem[] = []) {
    const [items, setItems] = useState<IngredientInputItem[]>(initial);
    const [ingredientOptions, setIngredientOptions] = useState<IngredientOption[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            const res = await fetchAllIngredients({ limit: 1000, sort: 'nameAZ' });
            setIngredientOptions(res.docs.map((ingredient: Ingredient) => ({
                id: ingredient._id,
                name: ingredient.name,
                unit: ingredient.unit,
                currentStock: ingredient.currentStock,
            })));
        };
        fetchOptions();
    }, []);

    const addNewItem = () => {
        setItems(prev => [
            ...prev,
            { ingredientId: '', quantity: '', unit: '', note: '' }
        ]);
    };

    const updateItem = (index: number, field: keyof IngredientInputItem, value: string) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const deleteItem = (index: number) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    };

    const reset = () => setItems(initial);

    return {
        items,
        ingredientOptions,
        setItems,
        addNewItem,
        updateItem,
        deleteItem,
        reset,
    };
}

export interface AuditItem {
    ingredientId: string;
    unit?: string;
    estimatedQuantity: number;
    actualQuantity: number;
    reason?: string;
    note?: string;
}

export function useInventoryAuditInput(initial: AuditItem[] = []) {
    const [items, setItems] = useState<AuditItem[]>(initial);
    const [ingredientOptions, setIngredientOptions] = useState<IngredientOption[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            const res = await fetchAllIngredients({ limit: 1000, sort: 'nameAZ' });
            setIngredientOptions(
                res.docs.map((ingredient: Ingredient) => ({
                    id: ingredient._id,
                    name: ingredient.name,
                    unit: ingredient.unit,
                    currentStock: ingredient.currentStock,

                }))
            );
        };
        fetchOptions();
    }, []);

    const addNewItem = () => {
        setItems((prev) => [
            ...prev,
            {
                ingredientId: '',
                unit: '',
                estimatedQuantity: 0,
                actualQuantity: 0,
                reason: '',
                note: '',
            },
        ]);
    };

    const updateItem = (index: number, field: keyof AuditItem, value: string | number) => {
        const updated = [...items];
        if (field === 'estimatedQuantity' || field === 'actualQuantity') {
            updated[index][field] = value as number;
        } else {
            updated[index][field] = value as string;
        }
        setItems(updated);
    };

    const deleteItem = (index: number) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    };

    const reset = () => setItems(initial);

    return {
        items,
        ingredientOptions,
        setItems,
        addNewItem,
        updateItem,
        deleteItem,
        reset,
    };
}

