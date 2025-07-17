import React from 'react';
import VoucherForm from './VoucherForm';
import { useCreateVoucher } from '../../../../hooks/useVouchers';
import { useNavigate } from 'react-router-dom';
import { Voucher } from '../../../../types/Voucher.type';
import { useQueryClient } from '@tanstack/react-query';

const CreateVoucher: React.FC = () => {
  const createVoucherMutation = useCreateVoucher();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = (data: Partial<Voucher>) => {
    return new Promise<void>((resolve) => {
      createVoucherMutation.mutate(data, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['vouchers'] });
          navigate('/admin/vouchers');
          resolve();
        },
        onError: () => {
          resolve();
        },
      });
    });
  };

  return (
    <div className="p-6">
      <VoucherForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateVoucher; 