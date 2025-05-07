import React from "react";
import { FaCreditCard} from "react-icons/fa"; 
import { AiFillPayCircle } from "react-icons/ai"; 
import { BsCashCoin } from "react-icons/bs";
import { RiBankLine } from "react-icons/ri";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onChange: (method: string) => void;
}

const paymentMethods = [
  { value: "momo", label: "Thanh toán với Momo", icon: <AiFillPayCircle /> }, 
  { value: "vnpay", label: "Thanh toán với VNPay", icon: <AiFillPayCircle /> }, 
  { value: "credit-card", label: "Thẻ tín dụng", icon: <FaCreditCard /> },
  { value: "bank-transfer", label: "Chuyển khoản ngân hàng", icon: <RiBankLine /> },
  { value: "cod", label: "Tiền mặt khi nhận hàng", icon: <BsCashCoin /> },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onChange,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-sm text-white/70 mb-2">Phương thức thanh toán:</h3>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <label
            key={method.value}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition duration-200"
          >
            <input
              type="radio"
              name="payment"
              value={method.value}
              checked={selectedMethod === method.value}
              onChange={() => onChange(method.value)}
              className="accent-secondaryColor focus:ring-2 focus:ring-secondaryColor"
            />
            {/* Icon before label */}
            <span className="text-xl text-white">{method.icon}</span>
            <span className="text-sm">{method.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
