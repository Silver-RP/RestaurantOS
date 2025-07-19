import { Listbox } from '@headlessui/react';
import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { FiDollarSign } from 'react-icons/fi';
import { FaUniversity } from 'react-icons/fa';

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onChange: (method: string) => void;
  size?: 'sm' | 'md';
  methods: PaymentMethod[];
  showTitle?: boolean; // Add this line
}

type IconType = React.ComponentType<{ className?: string }>;

interface PaymentMethod {
  value: string;
  label: string;
  Icon?: IconType;
  iconUrl?: string;
}

export const paymentMethods: PaymentMethod[] = [
  { value: '', label: 'Chọn phương thức thanh toán' },
  { value: 'CASH', label: 'Tiền mặt khi nhận hàng', Icon: FiDollarSign },
  {
    value: 'VNPAY',
    label: 'Thanh toán VNPay',
    iconUrl: '/assets/logos/vnpay-logo-inkythuatso-01-13-16-26-42.jpg',
  },
  {
    value: 'CREDIT_CARD',
    label: 'Thẻ tín dụng (Paypal)',
    iconUrl: '/assets/logos/PayPal_Symbol_0.svg',
  },
  {
    value: 'MOMO',
    label: 'Thanh toán Momo (QR)',
    iconUrl: '/assets/logos/momo.png',
  },
  {
    value: 'MOMO_ATM',
    label: 'Thanh toán thẻ MoMo (ATM/Thẻ)',
    iconUrl: '/assets/logos/momo.png',
  },
  { value: 'BANKING', label: 'Chuyển khoản ngân hàng', Icon: FaUniversity },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onChange,
  size = 'md',
  methods,
  showTitle = true, // Add this line
}) => {
  const availableMethods = methods || paymentMethods;
  const selected =
    paymentMethods.find((m) => m.value === selectedMethod) || paymentMethods[0];

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm md:text-base';

  return (
    <div className="mt-4">
      {showTitle && (
        <h3 className={`${textSize} text-white/70 mb-2`}>
          Phương thức thanh toán:
        </h3>
      )}

      <div className="relative w-full md:w-1/2 lg:w-2/3">
        <Listbox value={selectedMethod || ''} onChange={onChange}>
          <div className="relative">
            <Listbox.Button
              className={`w-full ${padding} border border-white/20 rounded-md flex items-center justify-between bg-transparent text-white`}
            >
              <div className="flex items-center gap-2 truncate">
                {selected.Icon && <selected.Icon className={iconSize} />}
                {!selected.Icon && selected.iconUrl && (
                  <img
                    src={selected.iconUrl}
                    alt={selected.label}
                    className={`${iconSize} object-contain`}
                  />
                )}
                <span className={textSize}>{selected.label}</span>
              </div>
              <FiChevronDown className="ml-2 text-white" />
            </Listbox.Button>

            <Listbox.Options className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-80 overflow-auto">
              {availableMethods.map((method) => (
                <Listbox.Option
                  key={method.value}
                  value={method.value}
                  className={({ active }) =>
                    `p-2 cursor-pointer rounded-md transition ${
                      active || selectedMethod === method.value
                        ? 'bg-white/10'
                        : ''
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    {method.Icon && <method.Icon className={iconSize} />}
                    {!method.Icon && method.iconUrl && (
                      <img
                        src={method.iconUrl}
                        alt={method.label}
                        className={`${iconSize} object-contain`}
                      />
                    )}
                    <span className={textSize}>{method.label}</span>
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
