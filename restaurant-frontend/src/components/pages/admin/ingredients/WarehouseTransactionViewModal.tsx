import React from 'react';
import { IngredientInputPanel } from './IngredientInputPanel';
import { useWarehouseImport } from '@/hooks/useWarehouse';
import { Dialog, DialogTitle } from '@mui/material';
import TimeDisplay from '@/components/common/TimeDisplay';
import { useIngredientInput } from '@/hooks/useIngredientsAdminLogic';
import { JSX } from 'react/jsx-runtime';

export const WarehouseTransactionViewModal: React.FC = () => {

  return (
    <Dialog maxWidth="md" fullWidth open={false}>
     
    </Dialog>
  );
};
