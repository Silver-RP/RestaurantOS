import React from 'react';
import ButtonComponents from '@components/common/ButtonComponents';

interface CartSummaryProps {
  subtotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal }) => {
  return (
    <div className="border border-[#26455E] p-6 rounded-lg w-full max-w-sm self-start shadow-md">
      <h2 className="text-xl mb-6">Tổng giỏ hàng</h2>
      <div className="flex justify-between items-center text-sm py-4 border-t border-[#26455E]">
        <span className="text-white/90">Tạm tính</span>
        <span className="text-white/90">{subtotal.toLocaleString()} VND</span>
      </div>
      <div className="flex justify-between items-center text-base font-semibold py-8 border-t border-[#26455E]">
        <span className="text-white">Tổng cộng</span>
        <span className="text-secondaryColor text-lg">{subtotal.toLocaleString()} VND</span>
      </div>
      <ButtonComponents variant="filled" size="small" className="w-full mt-4">
        TIẾN HÀNH THANH TOÁN
      </ButtonComponents>
    </div>
  );
};

export default CartSummary;