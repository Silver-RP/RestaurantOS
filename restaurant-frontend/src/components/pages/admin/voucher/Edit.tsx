import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoucherForm from './VoucherForm';
import { useVoucherById, useUpdateVoucher } from '../../../../hooks/useVouchers';
import { Voucher } from '../../../../types/Voucher.type';

const EditVoucher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: voucher, isLoading, isError } = useVoucherById(id || '');
  const updateVoucherMutation = useUpdateVoucher();

  const handleSubmit = (data: Partial<Voucher>) => {
    if (id) {
      updateVoucherMutation.mutate({ id, data }, {
        onSuccess: () => {
          navigate('/admin/vouchers');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-lg font-semibold">
        Đang tải...
      </div>
    );
  }

  if (isError || !voucher) {
    return <div className="text-center text-red-500">Không tìm thấy Voucher hoặc có lỗi xảy ra.</div>;
  }

  return (
    <div className="p-6">
      <VoucherForm initialData={voucher} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditVoucher; 