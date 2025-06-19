import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  warehouseImportIngredientsApi,
  warehouseExportIngredientApi,
  warehouseAuditApi,
  warehouseTransactionsApi,
  downloadInventoryExcelApi,
  downloadInventoryCsvApi,
  downloadInventoryPdfApi,
} from '@/api/WarehouseApi';
import { getAllStaffApi } from '@/api/UserApi';
import { fetchAllIngredients } from '@/api/IngredientsApi';
import { IngredientInputItem, AuditItem } from "@/hooks/useIngredientsAdminLogic";
import { InventoryTransactionResponse, SortField } from '@/types/InventoryType';
import { downloadFileFromApi } from '@/utils/downloadUtil';
import { warehouseParseFiltersFromSearchParams } from '@/utils/paramsUtil';

type SortDirection = 'asc' | 'desc';

export function useWarehouseImport({
  items,
  onSuccess,
}: {
  items: IngredientInputItem[];
  onSuccess: () => void;
}) {
  const handleSubmit = async () => {

    if (items.length === 0) {
      toast.error('Chưa có nguyên liệu nào để nhập kho!');
      return;
    }

    const hasInvalidItem = items.some(
      (i) => !i.ingredientId.trim() || Number(i.quantity) <= 0 || !i.unit.trim()
    );

    if (hasInvalidItem) {
      toast.error('Vui lòng nhập đầy đủ và hợp lệ: tên và số lượng > 0 cho tất cả nguyên liệu!');
      return;
    }

    try {
      const payload = {
        ingredients: items.map((i) => ({
          ingredient_id: i.ingredientId,
          quantity: Number(i.quantity),
          note: i.note || '',
        })),
      };

      await warehouseImportIngredientsApi(payload);
      toast.success('Nhập kho thành công!');
      onSuccess();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error((err as any).response.data.message || 'Lỗi khi nhập kho!');
    }
  };

  return { handleSubmit };
}

export function useWarehouseExport({ items, onSuccess }: {
  items: IngredientInputItem[];
  onSuccess: () => void;
}) {
  const handleSubmit = async () => {

    if (items.length === 0) {
      toast.error('Chưa có nguyên liệu nào để xuất kho!');
      return;
    }

    const hasInvalidItem = items.some(
      (i) => !i.ingredientId.trim() || Number(i.quantity) <= 0 || !i.unit.trim()
    );

    if (hasInvalidItem) {
      toast.error('Vui lòng nhập đầy đủ và hợp lệ: tên và số lượng > 0 cho tất cả nguyên liệu!');
      return;
    }

    try {
      const payload = {
        ingredients: items.map((i) => ({
          ingredient_id: i.ingredientId,
          quantity: Number(i.quantity),
          note: i.note || '',
        })),
      };

      await warehouseExportIngredientApi(payload);
      toast.success('Nhập kho thành công!');
      onSuccess();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error((err as any).response.data.message || 'Lỗi khi nhập kho!');
    }
  };

  return { handleSubmit };
}

export function useWarehouseAudit({ items, onSuccess }: { items: AuditItem[]; onSuccess: () => void; }) {
  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error('Chưa có nguyên liệu nào để kiểm kê!');
      return;
    }

    const hasInvalidItem = items.some((i) => {
      const missingBasicFields =
        !i.ingredientId?.trim() ||
        i.estimatedQuantity == null || i.estimatedQuantity < 0 ||
        i.actualQuantity == null || i.actualQuantity < 0;

      const hasDifference = i.actualQuantity !== i.estimatedQuantity;
      const missingReason = hasDifference && (!i.reason || i.reason.trim() === '');

      return missingBasicFields || missingReason;
    });

    if (hasInvalidItem) {
      toast.error('Vui lòng nhập đầy đủ thông tin nguyên liệu và lý do cho sai lệch!');
      return;
    }

    try {
      const payload = {
        adjustment_date: new Date().toISOString(), // ISO để backend dễ parse
        items: items.map((i) => ({
          ingredient_id: i.ingredientId,
          actual_quantity: i.actualQuantity,
          reason: i.reason || '',
          notes: i.note?.trim() || '',
        })),
      };

      await warehouseAuditApi(payload);
      toast.success('Kiểm kê kho thành công!');
      onSuccess();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(
        (err as any)?.response?.data?.message || 'Lỗi khi kiểm kê kho!'
      );
    }
  };

  return { handleSubmit };
}

export function useWarehouseTransactionView() {
  const {
    transactions,
    loading,
    error,
    searchParams,
    setSearchParams,
  } = getWarahouseTransactionHistory();

  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState('');

  const transactionList = transactions?.docs || [];

  const sortMapping: Record<string, Record<SortDirection, string>> = {
    transaction_type: { asc: 'transaction_type_asc', desc: 'transaction_type_desc' },
    transaction_date: { asc: 'transaction_date_asc', desc: 'transaction_date_desc' },
    ingredient_name: { asc: 'ingredient_name_asc', desc: 'ingredient_name_desc' },
    units: { asc: 'unit_asc', desc: 'unit_desc' },
    quantity: { asc: 'quantity_asc', desc: 'quantity_desc' },
    user_name: { asc: 'user_name_asc', desc: 'user_name_desc' },
  };

  const updateSearchParams = (callback: (params: URLSearchParams) => void) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      callback(newParams);
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handleSort = (field: string) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field as SortField);
    setSortDirection(direction as SortDirection);
    const sortValue = sortMapping[field]?.[direction] ?? 'default';

    updateSearchParams((params) => {
      params.set('sort', sortValue);
    });
  };

  const applySearch = () => {
    updateSearchParams((params) => {
      if (search.trim()) {
        params.set('keyword', search.trim());
      } else {
        params.delete('keyword');
      }
    });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') applySearch();
  };

  const getSortIcon = (field: SortField) =>
    sortField === field ? sortDirection : null;

  const transactionTypeLabels: Record<string, string> = {
    import: 'Nhập kho',
    export: 'Xuất kho',
    adjustment: 'Kiểm kê',
  };

  const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
          setShowExportMenu(false);
      }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filters = warehouseParseFiltersFromSearchParams(searchParams);
  const handleDownloadInventoryExcel = async () => {
    const res = await downloadInventoryExcelApi(filters);
    const response = new Response(res);
    await downloadFileFromApi(response, 'inventory_transactions.xlsx');
  };

  const handleDownloadInventoryCsv = async () => {
    const res = await downloadInventoryCsvApi(filters);
    const response = new Response(res);
    await downloadFileFromApi(response, 'inventory_transactions.csv');
  };

  const handleDownloadInventoryPdf = async () => {
    const res = await downloadInventoryPdfApi(filters);
    const response = new Response(res);
    await downloadFileFromApi(response, 'inventory_transactions.pdf');
  };

  return {
    transactions,
    loading,
    error,
    searchParams,
    setSearchParams,
    sortField,
    sortDirection,
    showFilterPanel,
    setShowFilterPanel,
    showExportMenu,
    setShowExportMenu,
    exportMenuRef,
    search,
    setSearch,
    transactionList,
    handleSort,
    handleEnter,
    handleClick: applySearch,
    getSortIcon,
    transactionTypeLabels,
    handleDownloadInventoryExcel,
    handleDownloadInventoryCsv,
    handleDownloadInventoryPdf
  };
}

export function getWarahouseTransactionHistory() {
  const [transactions, setTransactions] = useState<InventoryTransactionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const filters = warehouseParseFiltersFromSearchParams(searchParams);
        const data = await warehouseTransactionsApi(filters);

        if (isMounted) {
          setTransactions(data as unknown as InventoryTransactionResponse);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Đã xảy ra lỗi khi tải lịch sử giao dịch');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  return {
    transactions,
    loading,
    error,
    searchParams,
    setSearchParams,
  };
}

export function useWarehouseTransactionFilterPanel() {
  const [staffs, setStaffs] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      const staffs = await getAllStaffApi();
      setStaffs(staffs as unknown as any[]);
    };

    const fetchIngredients = async () => {
      const ingredients = await fetchAllIngredients({ limit: 1000, page: 1, sort: 'nameAZ' });
      setIngredients(ingredients.docs as unknown as any[]);
    };

    fetchStaffs();
    fetchIngredients();
  }, []);

  return {
    staffs,
    ingredients,
  };
}
