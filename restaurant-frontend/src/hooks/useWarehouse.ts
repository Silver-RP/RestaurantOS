import { useEffect, useState } from 'react';
import { useIngredientInput } from './useIngredientsAdminLogic';
import { IngredientOption } from '@/types/IngredientType';
import { toast } from 'react-toastify';
import { fetchAllIngredients } from '../api/IngredientsApi';
import { warehouseImportIngredientsApi } from '@/api/WarehouseApi';

export function useWarehouseImport(onSuccess: () => void) {
  const {
    items,
    ingredientOptions,
    updateItem,
    deleteItem,
    reset,
    addNewItem,
  } = useIngredientInput();

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error('Chưa có nguyên liệu nào để nhập kho!');
      return;
    }

    try {
        const payload = {
            ingredients: items.map((i) => ({
                name: i.ingredientId, // Assuming ingredientId is used as name
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
        toast.error('Lỗi khi nhập kho!');
    }
  };

  return {
    items,
    ingredientOptions,
    updateItem,
    deleteItem,
    reset,
    handleSubmit,
    addNewItem,
  };
}

