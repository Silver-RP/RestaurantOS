'use client';

import { Listbox } from '@headlessui/react';
import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onChange: (method: string) => void;
}

const paymentMethods = [
  { value: 'MOMO', label: 'Thanh toán với Momo (QR)' },
  { value: 'MOMO_ATM', label: 'Thanh toán thẻ MoMo (ATM/Card)' },
  { value: 'VNPAY', label: 'Thanh toán với VNPay' },
  { value: 'CREDIT_CARD', label: 'Thẻ tín dụng (Paypal)' },
  { value: 'BANKING', label: 'Chuyển khoản ngân hàng' },
  { value: 'CASH', label: 'Tiền mặt khi nhận hàng' },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onChange,
}) => {
  const selected =
    paymentMethods.find((m) => m.value === selectedMethod) || paymentMethods[0];

  return (
    <div className="mt-4">
      <h3 className="text-sm md:text-base text-white/70 mb-2">
        Phương thức thanh toán:
      </h3>

      <div className="relative w-full md:w-1/2 lg:w-2/3">
        {/* Dropdown selection */}
        <Listbox value={selectedMethod} onChange={(value) => onChange(value)}>
          <div className="relative">
            <Listbox.Button className="w-full p-2 border border-white/20 rounded-md flex items-center justify-between bg-transparent text-white">
              <span className="truncate">{selected.label}</span>
              <FiChevronDown className="ml-2 text-white" />
            </Listbox.Button>

            <Listbox.Options className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10">
              {paymentMethods.map((method) => (
                <Listbox.Option
                  key={method.value}
                  value={method.value}
                  className={({ active }) =>
                    `p-2 cursor-pointer rounded-md transition ${
                      active ? 'bg-white/10' : ''
                    } ${
                      selectedMethod === method.value
                        ? 'bg-white/10'
                        : ''
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm md:text-base">{method.label}</span>
                  </div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
