import { toast } from 'react-toastify';
import { 
  warehouseImportIngredientsApi,
  warehouseExportIngredientApi,
  warehouseAuditApi,
} from '@/api/WarehouseApi';
import { IngredientInputItem } from "@/hooks/useIngredientsAdminLogic";

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

export function useWarehouseExport({
  items,
  onSuccess,
}: {
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

export function useWarehouseAudit({
  items,
  onSuccess,
}: {
  items: IngredientInputItem[];
  onSuccess: () => void;
}) {
  const handleSubmit = async () => {
     
    if (items.length === 0) {
      toast.error('Chưa có nguyên liệu nào để kiểm kê kho!');
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

      await warehouseAuditApi(payload);
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

