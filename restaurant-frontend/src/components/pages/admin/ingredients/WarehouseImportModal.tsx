import React from 'react';
import { IngredientInputTable } from './IngredientInputTable';
import { useWarehouseImport } from '@/hooks/useWarehouse';
import { Dialog, DialogTitle } from '@mui/material';
import TimeDisplay from '@/components/common/TimeDisplay';


interface WarehouseImportModalProps {
  open: boolean;
  onClose: () => void;
}

export const WarehouseImportModal: React.FC<WarehouseImportModalProps> = ({
  open,
  onClose,
}) => {
  const {
    items,
    ingredientOptions,
    updateItem,
    deleteItem,
    reset,
    handleSubmit,
    addNewItem,
  } = useWarehouseImport(onClose);

  if (!open) return null;
    console.log('WarehouseImportModal items:', items);
    console.log('WarehouseImportModal open:', open);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle className="bg-gray-50 flex justify-between items-center">
      <span className="text-xl font-bold">Nhập kho nguyên liệu</span>
      <TimeDisplay />
    </DialogTitle>
    <div className="p-4 bg-white rounded shadow max-w-full mx-auto">
      <IngredientInputTable
        items={items}
        ingredientOptions={ingredientOptions}
        onChange={updateItem}
        onDelete={deleteItem}
      />

      <div className="text-center py-4">
        <button
          className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          onClick={addNewItem}
        >
          + Thêm
        </button>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => {
            reset();
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
