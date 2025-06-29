/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link } from 'react-router-dom';
import ButtonComponents from '@components/common/ButtonComponents';
import { toast } from 'react-toastify';

interface CartSummaryProps {
  originalTotal: number;
  discountedTotal: number;
  selectedItems?: any[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  originalTotal, 
  discountedTotal,
  selectedItems = [] 
}) => {
  const savings = originalTotal - discountedTotal;
  const vat = discountedTotal * 0.08;
  const grandTotal = discountedTotal + vat;

  const handleCheckout = () => {
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
    selectedItems.length === 0 ? toast.error('Chọn sản phẩm trước khi đặt hàng') : '';
  };

  return (
    <div className="border border-[#26455E] p-4 sm:p-6 rounded-lg w-full 2xl:max-w-sm self-start shadow-md">
      <h2 className="text-lg sm:text-xl mb-4 sm:mb-6">Tổng giỏ hàng</h2>

      <div className="flex justify-between text-xs sm:text-sm py-2 border-t border-[#26455E]">
        <span className="text-white/70">Giá gốc</span>
        <span className="text-white/70">{originalTotal.toLocaleString()} VND</span>
      </div>

      <div className="flex justify-between text-xs sm:text-sm py-2 border-t border-[#26455E]">
        <span className="text-white/90">Giá sau giảm</span>
        <span className="text-white/90">{discountedTotal.toLocaleString()} VND</span>
      </div>

      <div className="flex justify-between text-xs sm:text-sm py-2 border-t border-[#26455E]">
        <span className="text-white/60">Bạn tiết kiệm</span>
        <span className="text-green-400 font-medium">{savings.toLocaleString()} VND</span>
      </div>

      <div className="flex justify-between text-xs sm:text-sm py-2 border-t border-[#26455E]">
        <span className="text-white/70">VAT (8%)</span>
        <span className="text-white/70">{vat.toLocaleString()} VND</span>
      </div>

      <div className="flex justify-between text-sm sm:text-base font-semibold py-4 sm:py-6 border-t border-[#26455E]">
        <span className="text-white font-light">Tổng cộng</span>
        <span className="text-secondaryColor font-light text-base sm:text-lg">{grandTotal.toLocaleString()} VND</span>
      </div>

      <Link to="/checkout" onClick={handleCheckout}>
        <ButtonComponents variant="filled" size="small" className="w-full mt-4 py-2 sm:py-3">
          TIẾN HÀNH ĐẶT HÀNG
        </ButtonComponents>
      </Link>
    </div>
  );
};

export default CartSummary;