import { toast } from 'react-toastify';
import { warehouseImportIngredientsApi } from '@/api/WarehouseApi';
import { IngredientInputItem } from "@/hooks/useIngredientsAdminLogic";

export function useWarehouseImport({
  items,
  onSuccess,
}: {
  items: IngredientInputItem[];
  onSuccess: () => void;
}) {
  const handleSubmit = async () => {
     
    const validItems = items.filter(
      (i) => i.ingredientId.trim() && Number(i.quantity) > 0 && i.unit.trim()
    );
    
    if (items.length === 0) {
      toast.error('Chưa có nguyên liệu nào để nhập kho!');
      return;
    }
    
    const hasInvalidItem = items.some(
      (i) => !i.ingredientId.trim() || Number(i.quantity) <= 0 || !i.unit.trim()
    );
    
    if (hasInvalidItem) {
      toast.error('Vui lòng nhập đầy đủ và hợp lệ: tên, số lượng > 0 và đơn vị cho tất cả nguyên liệu!');
      return;
    }

    try {
      const payload = {
        ingredients: items.map((i) => ({
          ingredient_id: i.ingredientId,
          quantity: Number(i.quantity),
          unit: i.unit,
          note: i.note || '',
        })),
      };

      await warehouseImportIngredientsApi(payload);
      toast.success('Nhập kho thành công!');
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error((err as any).response.data.message || 'Lỗi khi nhập kho!');
    }
  };

  return { handleSubmit };
}

