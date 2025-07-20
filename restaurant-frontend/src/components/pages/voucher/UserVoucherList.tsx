import React from 'react';
import { useUserVouchers } from '@/hooks/useVouchers';
import { UserVoucherDisplay } from '@/types/Voucher.type';
import BreadCrumbComponents from '@/components/common/BreadCrumbComponents';
import Container from '@/components/common/Container';
import ProfileSidebar from '@/components/pages/proflie/ProfileSidebar';

const statusMap: Record<string, string> = {
  saved: 'Chưa sử dụng',
  used: 'Đã sử dụng',
  expired: 'Hết hạn',
  deleted: 'Đã bị thu hồi',
};

const UserVoucherList: React.FC = () => {
  const { data, isLoading } = useUserVouchers();
  const vouchers: UserVoucherDisplay[] = Array.isArray(data) ? data as UserVoucherDisplay[] : [];

  return (
    <div className="flex flex-col bg-bodyBackground text-white font-sans">
      <BreadCrumbComponents />
      <Container className="flex gap-6 py-10">
        <div className="w-1/3 hidden md:block">
          <ProfileSidebar />
        </div>
        <div className="flex-1 w-2/3 bg-bodyBackground p-10 border border-[#FFE0A0]">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin text-white">
              Voucher của bạn
            </h1>
          </div>
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Đang tải...</div>
          ) : vouchers.length === 0 ? (
            <div className="text-center text-lg text-secondaryColor">Bạn chưa có voucher nào.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8 min-h-[400px]">
              {vouchers.map((voucher) => {
                const now = new Date();
                const isOutOfStockButValid =
                  voucher.type === 'public' &&
                  voucher.status === 'out_of_stock' &&
                  (!voucher.start_date || new Date(voucher.start_date) <= now) &&
                  (!voucher.end_date || now <= new Date(voucher.end_date));
                const isDeleted = voucher.status === 'deleted';
                return (
                  <div
                    key={voucher.user_voucher_id || voucher._id}
                    className={`rounded-xl bg-[#0A1F2C] text-white p-5 shadow-lg flex flex-col gap-2 h-[150px] justify-between ${isOutOfStockButValid || isDeleted ? 'opacity-50 relative' : ''}`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-semibold tracking-wide text-[#FFDA95]">{voucher.code}</span>
                        <span className={`text-xs px-2 py-1 rounded ${isDeleted ? 'bg-red-700' : 'bg-gray-700'}`}>
                          {isDeleted ? 'Đã bị thu hồi' : (statusMap[voucher.user_voucher_status] || voucher.user_voucher_status)}
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
                    {(isOutOfStockButValid || isDeleted) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {isDeleted ? (
                          <span className="bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded">Voucher này đã bị admin thu hồi và không còn hiệu lực</span>
                        ) : (
                          <span className="bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded">Đã hết lượt</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default UserVoucherList; 