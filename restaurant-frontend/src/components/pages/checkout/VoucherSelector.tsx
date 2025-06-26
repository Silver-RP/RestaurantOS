'use client';

import React, { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import { UserVoucherDisplay } from '@/types/Voucher.type';

interface Props {
  vouchers: UserVoucherDisplay[];
  orderTotal: number;
  onApply: (voucher: UserVoucherDisplay, discountAmount: number) => void;
}

const VoucherSelector: React.FC<Props> = ({
  vouchers,
  orderTotal,
  onApply,
}) => {
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedVoucherId) {
      applySelectedVoucher();
    }
  }, [selectedVoucherId]);

  const applySelectedVoucher = () => {
    const selected = vouchers.find((v) => v.user_voucher_id === selectedVoucherId);
    if (!selected) return;

    const now = new Date().toISOString();
    if (selected.min_order_value && orderTotal < selected.min_order_value) {
      setError(
        `Đơn hàng phải tối thiểu ${selected.min_order_value.toLocaleString()}đ để dùng mã này.`,
      );
      onApply({} as UserVoucherDisplay, 0);
      return;
    }

    if (selected.start_date && now < selected.start_date) {
      setError('Voucher này chưa đến thời gian sử dụng.');
      onApply({} as UserVoucherDisplay, 0);
      return;
    }
    if (selected.end_date && now > selected.end_date) {
      setError('Voucher này đã hết hạn.');
      onApply({} as UserVoucherDisplay, 0);
      return;
    }
    if (selected.user_voucher_status !== 'saved') {
      setError('Voucher này không khả dụng.');
      onApply({} as UserVoucherDisplay, 0);
      return;
    }

    let discount = 0;
    if (selected.discount_type === 'fixed') {
      discount = selected.discount_value;
    } else if (selected.discount_type === 'percent') {
      discount = (orderTotal * selected.discount_value) / 100;
      if (selected.max_discount_value) {
        discount = Math.min(discount, selected.max_discount_value);
      }
    }

    setError('');
    onApply(selected, discount);
  };

  const clearVoucher = () => {
    setSelectedVoucherId(null);
    setError('');
    onApply({} as UserVoucherDisplay, 0);
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm md:text-base text-white/70 mb-2">
        Chọn mã giảm giá:
      </h3>
      <div className="relative w-full md:w-1/2 lg:w-2/3 flex gap-2">
        <Listbox value={selectedVoucherId} onChange={setSelectedVoucherId}>
          <div className="relative flex-grow">
            <Listbox.Button className="w-full p-2 border border-white/20 rounded-md flex items-center justify-between bg-transparent text-white">
              <span className="truncate">
                {selectedVoucherId
                  ? vouchers.find((v) => v.user_voucher_id === selectedVoucherId)?.code
                  : 'Chọn mã giảm giá'}
              </span>
              <FiChevronDown className="ml-2 text-white" />
            </Listbox.Button>
            <Listbox.Options className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
              {vouchers.length === 0 ? (
                <div className="p-2 text-white/50 text-center">Bạn không có mã giảm giá nào</div>
              ) : (
                vouchers.map((voucher) => (
                  <Listbox.Option
                    key={voucher.user_voucher_id}
                    value={voucher.user_voucher_id}
                    disabled={voucher.user_voucher_status === 'used'}
                    className={({ active, disabled }) =>
                      `p-2 cursor-pointer rounded-md transition ${
                        active ? 'bg-white/10' : ''
                      } ${
                        selectedVoucherId === voucher.user_voucher_id
                          ? 'border-l-4 border-secondaryColor'
                          : ''
                      } ${
                        disabled ? 'opacity-50 cursor-not-allowed bg-gray-800' : ''
                      }`
                    }
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm md:text-base font-semibold text-yellow-300">
                        {voucher.code}
                        {voucher.user_voucher_status === 'saved' && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-700 text-white/80">Chưa sử dụng</span>
                        )}
                        {voucher.user_voucher_status === 'used' && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-700 text-white/80">Đã sử dụng</span>
                        )}
                        {voucher.user_voucher_status === 'expired' && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-red-700 text-white/80">Hết hạn</span>
                        )}
                      </span>
                      {(voucher.discount_type && voucher.discount_value) && (
                        <span className="text-xs text-white/70">
                          Ưu đãi: {voucher.discount_type === 'percent'
                            ? `Giảm ${voucher.discount_value}%${voucher.max_discount_value ? ` (Tối đa ${voucher.max_discount_value.toLocaleString()} VNĐ)` : ''}`
                            : `Giảm ${voucher.discount_value.toLocaleString()} VNĐ`}
                        </span>
                      )}
                      {voucher.min_order_value ? (
                        <span className="text-xs text-white/70">
                          Đơn tối thiểu: {voucher.min_order_value.toLocaleString()} VNĐ
                        </span>
                      ) : null}
                      {voucher.end_date && (
                        <span className="text-xs text-white/70">
                          HSD: {new Date(voucher.end_date).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </div>
        </Listbox>
        {selectedVoucherId && (
          <button
            onClick={clearVoucher}
            className="px-3 border border-white/20 rounded-md hover:bg-white/10"
            aria-label="Clear voucher"
          >
            ✕
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      {selectedVoucherId && !error && (
        <div className="mt-2 text-sm text-green-400">Đã áp dụng</div>
      )}
    </div>
  );
};

export default VoucherSelector;
