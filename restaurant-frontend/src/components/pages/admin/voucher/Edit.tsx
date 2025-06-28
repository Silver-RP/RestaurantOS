import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoucherForm from './VoucherForm';
import { useVoucherById, useUpdateVoucher } from '../../../../hooks/useVouchers';
import { Voucher } from '../../../../types/Voucher.type';
import { addUsersToVoucher } from '../../../../api/VoucherApi';
import { toast } from 'react-hot-toast';

const EditVoucher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      <VoucherForm initialData={voucher} onSubmit={handleSubmit} onAddUsers={handleAddUsers} />
    </div>
  );
};

export default EditVoucher; 