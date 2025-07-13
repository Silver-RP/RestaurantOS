import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoucherForm from './VoucherForm';
import { useVoucherById, useUpdateVoucher } from '../../../../hooks/useVouchers';
import { Voucher } from '../../../../types/Voucher.type';
import { useQueryClient } from '@tanstack/react-query';

const EditVoucher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: voucher, isLoading, isError } = useVoucherById(id || '');
  const updateVoucherMutation = useUpdateVoucher();
  const queryClient = useQueryClient();

  const handleSubmit = (data: Partial<Voucher>) => {
    return new Promise<void>((resolve) => {
      if (id) {
        updateVoucherMutation.mutate(
          { id, data },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['vouchers'] });
              queryClient.invalidateQueries({ queryKey: ['voucher', id] });
              navigate('/admin/vouchers');
              resolve();
            },
            onError: () => {
              resolve();
            },
          }
        );
      } else {
        resolve();
      }
    });
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
      <VoucherForm key={voucher?._id} initialData={voucher} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditVoucher; 