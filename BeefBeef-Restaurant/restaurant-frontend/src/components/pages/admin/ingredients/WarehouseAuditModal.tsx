// components/warehouse/WarehouseModal.tsx
import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { InventoryAuditPanel } from './InventoryAuditPanel';
import TimeDisplay from '@/components/common/TimeDisplay';
import { useInventoryAuditInput } from '@/hooks/useIngredientsAdminLogic';
import { useWarehouseAudit } from '@/hooks/useWarehouse';

type WarehouseModalType = 'audit' | 'transaction';

interface Props {
  open: boolean;
  type: WarehouseModalType;
  onClose: () => void;
}


export const WarehouseAuditModal: React.FC<Props> = ({ open, type, onClose }) => {
  const ingredientInput = useInventoryAuditInput();

  const handleAudit = useWarehouseAudit({
    items: ingredientInput.items,
    onSuccess: () => {
      ingredientInput.reset();
      onClose();
    },
  }).handleSubmit;

  const handleSubmit = () => {
    if (type === 'audit') return handleAudit();
  };

  

  if (!open) return null;



  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle className="bg-gray-50 flex justify-between items-center">
        <span className="text-xl font-bold">Kiểm kê kho nguyên liệu</span>
        <TimeDisplay />
      </DialogTitle>
      <div className="p-4 bg-white">
          <>
            <InventoryAuditPanel {...ingredientInput} />
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
