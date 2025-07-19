import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoucherForm from './VoucherForm';
import { useVoucherById, useUpdateVoucher } from '../../../../hooks/useVouchers';
import { Voucher } from '../../../../types/Voucher.type';
<<<<<<< Updated upstream
import { useQueryClient } from '@tanstack/react-query';
=======
import { addUsersToVoucher } from '../../../../api/VoucherApi';
import { toast } from 'react-hot-toast';
>>>>>>> Stashed changes

const EditVoucher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
<<<<<<< Updated upstream
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
=======
  const { data: voucher, isLoading, isError, refetch } = useVoucherById(id || '');
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

  // Hàm thêm user mới vào voucher
  const handleAddUsers = async (userIds: string[]) => {
    if (!id || userIds.length === 0) return;
    try {
      await addUsersToVoucher(id, userIds);
      await refetch();
      // eslint-disable-next-line no-undef
      toast.success('Thêm user vào voucher thành công!');
    } catch (err: any) {
      // eslint-disable-next-line no-undef
      toast.error(err?.response?.data?.error || 'Thêm user thất bại!');
    }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      <VoucherForm key={voucher?._id} initialData={voucher} onSubmit={handleSubmit} />
=======
      <VoucherForm initialData={voucher} onSubmit={handleSubmit} onAddUsers={handleAddUsers} />
>>>>>>> Stashed changes
    </div>
  );
};

export default EditVoucher; 