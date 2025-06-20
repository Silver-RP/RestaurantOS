import React from 'react';
import { useUserVouchers } from '@/hooks/useVouchers';
import { UserVoucherDisplay } from '@/types/Voucher.type';

const statusMap: Record<string, string> = {
  saved: 'Chưa sử dụng',
  used: 'Đã sử dụng',
  expired: 'Hết hạn',
};

const UserVoucherList: React.FC = () => {
  const { data, isLoading } = useUserVouchers();
  const vouchers: UserVoucherDisplay[] = Array.isArray(data) ? data as UserVoucherDisplay[] : [];

  return (
    <section className="bg-bodyBackground w-full text-white py-16">
      <div className="w-container95 mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin text-white">
            Voucher của bạn
          </h1>
        </div>
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Đang tải...</div>
        ) : vouchers.length === 0 ? (
          <div className="text-center text-lg text-secondaryColor">Bạn chưa lưu voucher nào.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 min-h-[400px]">
            {vouchers.map((voucher) => (
              <div
                key={voucher.user_voucher_id || voucher._id}
                className="rounded-xl bg-[#0A1F2C] text-white p-5 shadow-lg flex flex-col gap-2 h-[180px] justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-semibold tracking-wide text-[#FFDA95]">{voucher.code}</span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-700">
                      {statusMap[voucher.user_voucher_status] || voucher.user_voucher_status}
                    </span>
                  </div>
                  <div className="text-xs mb-1">
                    <span className="font-semibold text-gray-300">Ưu đãi: </span>
                    {voucher.discount_type === 'percent'
                      ? `Giảm ${voucher.discount_value}%`
                      : `Giảm ${voucher.discount_value?.toLocaleString()} VNĐ`}
                    {voucher.max_discount_value && voucher.discount_type === 'percent' && (
                      <span> (Tối đa {voucher.max_discount_value.toLocaleString()} VNĐ)</span>
                    )}
                  </div>
                  {voucher.min_order_value && (
                    <div className="text-xs mb-1">
                      <span className="font-semibold text-gray-300">Đơn tối thiểu: </span>
                      {voucher.min_order_value.toLocaleString()} VNĐ
                    </div>
                  )}
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-gray-300">HSD: </span>
                  {voucher.end_date ? new Date(voucher.end_date).toLocaleDateString() : 'Không giới hạn'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserVoucherList; 