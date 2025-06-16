import React from 'react';
import { IngredientInputPanel } from './IngredientInputPanel';
import { useWarehouseImport } from '@/hooks/useWarehouse';
import { Dialog, DialogTitle } from '@mui/material';
import TimeDisplay from '@/components/common/TimeDisplay';
import { useIngredientInput } from '@/hooks/useIngredientsAdminLogic';


interface WarehouseImportModalProps {
  open: boolean;
  onClose: () => void;
}

export const WarehouseImportModal: React.FC<WarehouseImportModalProps> = ({
  open,
  onClose,
}) => {
  const ingredientInput = useIngredientInput();

  const { handleSubmit } = useWarehouseImport({
    items: ingredientInput.items,
    onSuccess: () => {
      ingredientInput.reset();
      onClose();
    },
  });

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-gray-50 flex justify-between items-center">
        <span className="text-xl font-bold">Nhập kho nguyên liệu</span>
        <TimeDisplay />
      </DialogTitle>
      <div className="p-4 bg-white rounded shadow max-w-full mx-auto">
        <IngredientInputPanel {...ingredientInput} />
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => {
              ingredientInput.reset();
              onClose();
            }}
          >
            Huỷ
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </Dialog>
  );
};
