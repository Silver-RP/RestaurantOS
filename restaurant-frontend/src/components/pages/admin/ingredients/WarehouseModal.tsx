// components/warehouse/WarehouseModal.tsx
import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { IngredientInputPanel } from './IngredientInputPanel';
import TimeDisplay from '@/components/common/TimeDisplay';
import { useIngredientInput } from '@/hooks/useIngredientsAdminLogic';
import {
  useWarehouseImport,
  useWarehouseExport,
} from '@/hooks/useWarehouse';

type WarehouseModalType = 'import' | 'export' | 'transaction';

interface Props {
  open: boolean;
  type: WarehouseModalType;
  onClose: () => void;
}

const getDialogTitle = (type: WarehouseModalType) => {
  switch (type) {
    case 'import':
      return 'Nhập kho nguyên liệu';
    case 'export':
      return 'Xuất kho nguyên liệu';
    case 'transaction':
      return 'Lịch sử giao dịch';
  }
};

export const WarehouseModal: React.FC<Props> = ({ open, type, onClose }) => {
  const ingredientInput = useIngredientInput();

  const handleImport = useWarehouseImport({
    items: ingredientInput.items,
    onSuccess: () => {
      ingredientInput.reset();
      onClose();
    },
  }).handleSubmit;

  const handleExport = useWarehouseExport({
    items: ingredientInput.items,
    onSuccess: () => {
      ingredientInput.reset();
      onClose();
    },
  }).handleSubmit;

  const handleSubmit = () => {
    if (type === 'import') return handleImport();
    if (type === 'export') return handleExport();
  };



  if (!open) return null;



  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-gray-50 flex justify-between items-center">
        <span className="text-xl font-bold">{getDialogTitle(type)}</span>
        <TimeDisplay />
      </DialogTitle>
      <div className="p-4 bg-white">
          <>
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
          </>
      </div>
    </Dialog>
  );
};
