import React, { useState } from 'react';
import { usePublicActiveVouchers, useSaveVoucher, useUserVouchers } from '@/hooks/useVouchers';
import { Voucher, UserVoucherDisplay } from '@/types/Voucher.type';
import Pagination from '@/components/common/Pagination';

const VoucherList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const { data, isLoading } = usePublicActiveVouchers({ page, limit });
  const saveVoucherMutation = useSaveVoucher();
  const { data: userVouchersData } = useUserVouchers();
  const userVouchers: UserVoucherDisplay[] = Array.isArray(userVouchersData) ? userVouchersData as UserVoucherDisplay[] : [];
  const savedVoucherIds = new Set(userVouchers.map(v => v._id));
  const vouchers: Voucher[] = data?.docs || [];

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const totalPages = data?.totalPages && data.totalPages > 0 ? data.totalPages : 1;

  return (
    <section className="bg-bodyBackground w-full text-white py-16">
      <div className="w-container95 mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin text-white">
            Danh sách Voucher
          </h1>
        </div>
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Đang tải...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 min-h-[400px]">
              {vouchers.length > 0 ? (
                vouchers.map((voucher: Voucher) => {
                  let buttonLabel = 'Lưu mã';
                  let buttonDisabled = false;
                  if (voucher.status === 'out_of_stock') {
                    buttonLabel = 'Hết lượt';
                    buttonDisabled = true;
                  } else if (savedVoucherIds.has(voucher._id)) {
                    buttonLabel = 'Đã lưu';
                    buttonDisabled = true;
                  } else if (saveVoucherMutation.isPending && saveVoucherMutation.variables === voucher._id) {
                    buttonLabel = 'Đang lưu...';
                    buttonDisabled = true;
                  }
                  return (
                    <div
                      key={voucher._id}
                      className={`rounded-xl bg-[#0A1F2C] text-white p-5 shadow-lg flex flex-col gap-2 h-[180px] justify-between ${voucher.status === 'out_of_stock' ? 'opacity-50 relative' : ''}`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-base font-semibold tracking-wide text-[#FFDA95]">{voucher.code}</span>
                          <button
                            className={`px-2 py-1 text-xs border border-secondaryColor bg-transparent text-secondaryColor transition rounded ${buttonDisabled && buttonLabel === 'Đã lưu' ? '' : 'hover:bg-secondaryColor hover:text-headerBackground'}`}
                            onClick={() => saveVoucherMutation.mutate(voucher._id!)}
                            disabled={buttonDisabled}
                          >
                            {buttonLabel}
                          </button>
                        </div>
                        <div className="text-xs mb-1">
                          <span className="font-semibold text-gray-300">Ưu đãi: </span>
                          {voucher.discount_type === 'percent'
                            ? `Giảm ${voucher.discount_value}%`
                            : `Giảm ${voucher.discount_value.toLocaleString()} VNĐ`}
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
                      {voucher.status === 'out_of_stock' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded">Voucher đã hết lượt sử dụng</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-xl font-light text-secondaryColor">
                  Hiện chưa có voucher nào.
                </p>
              )}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              limit={limit}
              onLimitChange={handleLimitChange}
              showLimit={true}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default VoucherList; 