"use client";

import React, { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';

export interface Voucher {
  voucher_id: string;
  code: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  limit: number;
  description: string;
  min_total: number;
  max_value: number;
  type_discount: 'percent' | 'amount';
}

interface Props {
  vouchers: Voucher[];
  orderTotal: number;
  onApply: (voucher: Voucher, discountAmount: number) => void;
}

const VoucherSelector: React.FC<Props> = ({ vouchers, orderTotal, onApply }) => {
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Automatically calculate and apply discount when voucher is selected
  useEffect(() => {
    if (selectedVoucherId) {
      applySelectedVoucher();
    }
  }, [selectedVoucherId]);

  const applySelectedVoucher = () => {
    const selected = vouchers.find(v => v.voucher_id === selectedVoucherId);
    if (!selected) return;

    const now = new Date().toISOString();
    if (orderTotal < selected.min_total) {
      setError(`Đơn hàng phải tối thiểu ${selected.min_total.toLocaleString()}đ để dùng mã này.`);
      return;
    }

    if (now < selected.start_date || now > selected.end_date) {
      setError('Voucher này không còn hiệu lực.');
      return;
    }

    let discount = 0;
    if (selected.type_discount === 'amount') {
      discount = selected.discount_value;
    } else if (selected.type_discount === 'percent') {
      discount = (orderTotal * selected.discount_value) / 100;
    }
    
    // Cap the discount at max_value
    discount = Math.min(discount, selected.max_value);

    setError('');
    onApply(selected, discount);
  };

  // Reset the voucher selection
  const clearVoucher = () => {
    setSelectedVoucherId(null);
    setError('');
    onApply({} as Voucher, 0);
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm md:text-base text-white/70 mb-2">Chọn mã giảm giá:</h3>
      
      <div className="relative w-full md:w-1/2 lg:w-1/3 flex gap-2">
        {/* Listbox for voucher selection */}
        <Listbox value={selectedVoucherId} onChange={setSelectedVoucherId}>
          <div className="relative flex-grow">
            <Listbox.Button 
              className="w-full p-2 border border-white/20 rounded-md flex items-center justify-between bg-transparent text-white"
            >
              <span className="truncate">
                {selectedVoucherId 
                  ? vouchers.find(v => v.voucher_id === selectedVoucherId)?.code 
                  : 'Chọn mã giảm giá'}
              </span>
              <span className="pointer-events-none">▼</span>
            </Listbox.Button>

            {/* Options List */}
            <Listbox.Options
              className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto"
            >
              {vouchers.map((voucher) => (
                <Listbox.Option
                  key={voucher.voucher_id}
                  value={voucher.voucher_id}
                  className={({ active }) =>
                    `p-2 cursor-pointer rounded-md transition ${
                      active ? "bg-white/10" : ""
                    } ${
                      selectedVoucherId === voucher.voucher_id
                        ? "border-l-4 border-secondaryColor"
                        : ""
                    }`
                  }
                >
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base font-semibold">{voucher.code}</span>
                    <span className="text-xs text-white/70">{voucher.description}</span>
                  </div>
                </Listbox.Option>
              ))}
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

      {/* Display error messages */}
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}

      {/* Display applied voucher info */}
      {selectedVoucherId && !error && (
        <div className="mt-2 text-sm text-green-400">
          Đã áp dụng
        </div>
      )}
    </div>
  );
};

export default VoucherSelector;