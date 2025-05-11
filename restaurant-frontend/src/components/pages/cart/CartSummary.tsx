import React from 'react';
import ButtonComponents from '@components/common/ButtonComponents';

interface CartSummaryProps {
  originalTotal: number;
  discountedTotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ originalTotal, discountedTotal }) => {
  const savings = originalTotal - discountedTotal;
  const vat = discountedTotal * 0.08;
  const grandTotal = discountedTotal + vat;

  return (
    <div className="border border-[#26455E] p-6 rounded-lg w-full max-w-sm self-start shadow-md">
      <h2 className="text-xl mb-6">Tổng giỏ hàng</h2>

      <div className="flex justify-between items-center text-sm py-2 border-t border-[#26455E]">
        <span className="text-white/70">Giá gốc</span>
        <span className="text-white/70">{originalTotal.toLocaleString()} VND</span>
      </div>

      <div className="flex justify-between items-center text-sm py-2 border-t border-[#26455E]">
        <span className="text-white/90">Giá sau giảm</span>
        <span className="text-white/90">{discountedTotal.toLocaleString()} VND</span>
      </div>

      <div className="flex justify-between items-center text-sm py-2 border-t border-[#26455E]">
        <span className="text-white/60">Bạn tiết kiệm</span>
        <span className="text-green-400 font-medium">{savings.toLocaleString()} VND</span>
      </div>

      <div className="flex justify-between items-center text-sm py-2 border-t border-[#26455E]">
        <span className="text-white/70">VAT (8%)</span>
        <span className="text-white/70">{vat.toLocaleString()} VND</span>
      </div>

      <div className="flex justify-between items-center text-base font-semibold py-6 border-t border-[#26455E]">
        <span className="text-white font-light">Tổng cộng</span>
        <span className="text-secondaryColor font-light text-lg">{grandTotal.toLocaleString()} VND</span>
      </div>

      <ButtonComponents variant="filled" size="small" className="w-full mt-4 py-3">
        TIẾN HÀNH THANH TOÁN
      </ButtonComponents>
    </div>
  );
};

export default CartSummary;