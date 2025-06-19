import React, { useState } from 'react';
import { GoGift } from "react-icons/go";
import { FaDiamond, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { usePublicActiveVouchers, useSaveVoucher } from '@/hooks/useVouchers';

const VoucherModal = ({ open, onClose, page, setPage }: { open: boolean, onClose: () => void, page: number, setPage: (p: number) => void }) => {
  const { data, isLoading } = usePublicActiveVouchers({ page });
  const saveVoucherMutation = useSaveVoucher();
  const vouchers = data?.docs || [];
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleSaveVoucher = (voucherId: string) => {
    saveVoucherMutation.mutate(voucherId);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-bodyBackground rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center text-secondaryColor">Danh sách Voucher</h2>
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Đang tải...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[500px] overflow-y-auto pr-2 mb-4">
              {vouchers.map(voucher => (
                <div key={voucher._id} className="rounded-xl border border-[#444] bg-[#0A1F2C] text-white p-4 shadow flex flex-col gap-2 h-[150px]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-base font-semibold tracking-wide text-[#FFDA95]">{voucher.code}</span>
                    <div className="flex gap-2">  
                      <button
                        className="px-2 py-1 text-xs border border-secondaryColor bg-transparent text-secondaryColor hover:bg-secondaryColor hover:text-headerBackground transition"
                        onClick={() => handleSaveVoucher(voucher._id!)}
                        disabled={saveVoucherMutation.isPending}
                      >
                        {saveVoucherMutation.isPending ? 'Đang lưu...' : 'Lưu mã'}
                      </button>
                    </div>
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
                  <div className="text-xs">
                    <span className="font-semibold text-gray-300">HSD: </span>
                    {voucher.end_date ? new Date(voucher.end_date).toLocaleDateString() : 'Không giới hạn'}
                  </div>
                </div>
              ))}
            </div>
            {data && data.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-2">
                <button
                  className="px-3 py-1 rounded border border-secondaryColor text-secondaryColor bg-transparent hover:bg-secondaryColor hover:text-headerBackground transition disabled:opacity-50 flex items-center justify-center"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  aria-label="Trang trước"
                >
                  <FaChevronLeft />
                </button>
                <span className="px-2 py-1 text-sm text-gray-200">Trang {page} / {data.totalPages}</span>
                <button
                  className="px-3 py-1 rounded border border-secondaryColor text-secondaryColor bg-transparent hover:bg-secondaryColor hover:text-headerBackground transition disabled:opacity-50 flex items-center justify-center"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages}
                  aria-label="Trang sau"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const PromotionSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePublicActiveVouchers({ page });
  const vouchers = data?.docs || [];

  if (isLoading || vouchers.length === 0) return null;

  return (
    <div
      className="relative mx-auto bg-cover bg-center h-[250px] sm:h-[300px] md:h-[460px]"
      style={{ backgroundImage: `url("assets/images/Baccont.png")` }}
    >
      <div className="relative flex flex-col items-center w-full justify-center h-full text-white text-center px-4">
        <div className="w-full max-w-6xl mx-auto">
          <GoGift className="mx-auto mb-3 text-3xl md:text-4xl text-secondaryColor" />
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-3 tracking-wide font-restora">
            Chương trình khuyến mãi
          </h2>
          <div className="text-xs sm:text-sm md:text-base flex justify-center items-center font-sans font-extralight uppercase tracking-widest mb-6 text-secondaryColor">
            <FaDiamond className="inline mr-2" style={{ fontSize: "7px" }} />
             Ưu đãi hấp dẫn dành cho bạn
            <FaDiamond className="inline ml-2" style={{ fontSize: "7px" }} />
          </div>
          <p className="text-[12px] sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed text-gray-200 mb-8">
            Đừng bỏ lỡ các mã giảm giá và ưu đãi đặc biệt từ nhà hàng! Sử dụng ngay để tiết kiệm và tận hưởng trải nghiệm ẩm thực tuyệt vời cùng bạn bè và người thân.
          </p>
          <button
            className="px-5 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 bg-transparent border border-secondaryColor text-secondaryColor hover:bg-secondaryColor hover:text-headerBackground transition font-semibold text-base md:text-lg tracking-wide animate-fade-down"
            onClick={() => setShowModal(true)}
          >
            KHÁM PHÁ NGAY
          </button>
        </div>
      </div>
      <VoucherModal open={showModal} onClose={() => setShowModal(false)} page={page} setPage={setPage} />
    </div>
  );
};

export default PromotionSection; 