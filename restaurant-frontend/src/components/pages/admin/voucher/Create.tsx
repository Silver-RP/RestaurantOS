import React from 'react';
import VoucherForm from './VoucherForm';
import { useCreateVoucher } from '../../../../hooks/useVouchers';
import { useNavigate } from 'react-router-dom';
import { Voucher } from '../../../../types/Voucher.type';

const CreateVoucher: React.FC = () => {
  const createVoucherMutation = useCreateVoucher();
  const navigate = useNavigate();

  const handleSubmit = (data: Partial<Voucher>) => {
    createVoucherMutation.mutate(data, {
      onSuccess: () => {
        navigate('/admin/vouchers');
      },
    });
  };

  return (
    <div className="p-6">
      <VoucherForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateVoucher; 