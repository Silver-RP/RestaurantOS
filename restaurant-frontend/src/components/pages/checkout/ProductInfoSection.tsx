'use client';

import React, { useState } from 'react';
import PaymentMethodSelector,  { paymentMethods } from './PaymentMethodSelector';
import ButtonComponents from '@components/common/ButtonComponents';
import VoucherSelector from './VoucherSelector';
import { UserVoucherDisplay } from '@/types/Voucher.type';

interface Product {
  image: string;
  name: string;
  discountedPrice: number;
  price: number;
  quantity: number;
  category?: string;
  notes?: string;
}

interface ProductInfoProps {
  products: Product[];
  note?: string;
  shippingFee?: number;
  paymentMethod: string | null;
  onPaymentMethodChange: (method: string | null) => void;
  vouchers?: UserVoucherDisplay[];
  onProceedToPayment?: () => void;
  onNoteChange?: (note: string) => void;
  onProductNoteChange?: (productIndex: number, note: string) => void;
  onVoucherChange?: (voucher: UserVoucherDisplay | null) => void;
  loyaltyDiscountPercent?: number; // Thêm props này
}

const ProductInfoSection = ({
  products,
  note,
  shippingFee = 0,
  onPaymentMethodChange,
  vouchers = [],
  paymentMethod,
  onProceedToPayment,
  onNoteChange,
  onProductNoteChange,
  onVoucherChange,
  loyaltyDiscountPercent = 0, // default 0
}: ProductInfoProps) => {
  const [selectedVoucher, setSelectedVoucher] = useState<UserVoucherDisplay | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [orderNote, setOrderNote] = useState(note || '');

  const originalTotalPrice = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const productDiscountTotal = products.reduce(
    (sum, item) => {
      const itemDiscount = item.discountedPrice !== undefined
        ? (item.price - item.discountedPrice) * item.quantity
        : 0;
      return sum + itemDiscount;
    },
    0
  );

  const totalPrice = products.reduce(
    (sum, item) => {
      const effectivePrice = item.discountedPrice !== undefined ? item.discountedPrice : item.price;
      return sum + effectivePrice * item.quantity;
    },
    0
  );

  // Tính giảm giá loyalty
  const loyaltyDiscount = Math.round(totalPrice * (loyaltyDiscountPercent / 100));

  const vatAmount = Math.round(totalPrice * 0.08);
  const finalAmount = totalPrice + shippingFee + vatAmount - discountAmount - loyaltyDiscount;

  const handleVoucherApply = (voucher: UserVoucherDisplay, discount: number) => {
    if (!voucher.user_voucher_id) {
      setSelectedVoucher(null);
      setDiscountAmount(0);
      if (onVoucherChange) onVoucherChange(null);
      return;
    }
    setSelectedVoucher(voucher);
    setDiscountAmount(discount);
    if (onVoucherChange) onVoucherChange(voucher);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrderNote(e.target.value);
    if (onNoteChange) {
      onNoteChange(e.target.value);
    }
  };

  const handleProductNoteChange = (productIndex: number, noteText: string) => {
    if (onProductNoteChange) {
      onProductNoteChange(productIndex, noteText);
    }

    console.log(`Updated note for product ${productIndex}: ${noteText}`);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 border border-white/10 rounded-md text-white">
      <h2 className="font-semibold text-base sm:text-lg md:text-xl mb-3 md:mb-4">
        Thông tin đơn hàng
      </h2>

      {/* Danh sách sản phẩm */}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full text-xs sm:text-sm md:text-base table-auto border-collapse">
          <thead>
            <tr className="bg-white/5 text-left">
              <th className="p-2 font-medium">Món ăn</th>
              <th className="p-2 text-center font-medium whitespace-nowrap">
                Đơn giá
              </th>
              <th className="p-2 text-center font-medium whitespace-nowrap">
                Số lượng
              </th>
              <th className="p-2 text-right font-medium whitespace-nowrap">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx} className="border-t border-white/10">
                <td className="p-2 flex items-center gap-2 md:gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    {product.category ? (
                      <p className="text-xs text-white/60 mt-0.5">
                        Phân loại: {product.category}
                      </p>
                    ) : (
                      <p className="text-xs text-white/60 mt-0.5">
                        Phân loại: Không có
                      </p>
                    )}
                    <div className="mt-1.5">
                      <input
                        type="text"
                        placeholder="Ghi chú cho món ăn..."
                        className="w-full max-w-xs text-xs bg-bodyBackground  border border-gray-600 rounded p-1.5 text-white/80 focus:border-secondaryColor focus:outline-none"
                        defaultValue={product.notes || ''}
                        onChange={(e) =>
                          handleProductNoteChange(idx, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </td>
                <td className="p-2 text-center">
                  <div>
                    {product.discountedPrice !== product.price ? (
                      <div className="text-sm mt-1 flex flex-col">
                        <span className="line-through text-gray-400">
                          {product.price.toLocaleString()} VND
                        </span>
                        <span className="text-secondaryColor font-semibold">
                          {product.discountedPrice.toLocaleString()} VND
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm mt-1">
                        {product.price.toLocaleString()} VND
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-2 text-center">x{product.quantity}</td>
                <td className="p-2 font-semibold text-right">
                  {product.discountedPrice !== undefined
                    ? (
                        product.discountedPrice * product.quantity
                      ).toLocaleString()
                    : (product.price * product.quantity).toLocaleString()}
                  VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ghi chú */}
      <div className="mt-4 md:mt-6">
        <label className="block text-xs sm:text-sm text-white/70 mb-1">
          Lưu ý cho người bán:
        </label>
        <textarea
          value={orderNote}
          onChange={handleNoteChange}
          placeholder="Nhập lời nhắn..."
          className="w-full border border-white/20 bg-transparent px-2 py-1 sm:px-3 sm:py-2 rounded text-white focus:border-secondaryColor focus:outline-none placeholder:text-white/40 text-xs sm:text-sm md:text-base"
          rows={3}
        />
      </div>

      <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:gap-4">
        {/* Phương thức thanh toán */}
        <div className="flex-1">
          <PaymentMethodSelector
            selectedMethod={paymentMethod ?? ''}
            onChange={onPaymentMethodChange}
            methods={paymentMethods}
          />
        </div>
        {/* Chọn mã giảm giá */}
        <div className="flex-1 mb-4 md:mb-0">
          <VoucherSelector
            vouchers={vouchers || []}
            orderTotal={totalPrice}
            onApply={handleVoucherApply}
          />
        </div>
      </div>

      {/* Tóm Tắt Đơn Hàng */}
      <div className="mt-6 md:mt-8 w-full">
        <div className="w-full md:w-2/3 lg:w-1/2 md:ml-auto bg-bodyBackground p-3 sm:p-4 md:p-6 rounded-md border border-white/10">
          <h3 className="font-semibold text-base mb-3">Tổng đơn hàng</h3>

          <div className="space-y-2 md:space-y-3 text-xs sm:text-sm text-white">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Giá gốc</span>
              <span>{originalTotalPrice.toLocaleString()} VND</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/80">Giá sau giảm</span>
              <span>{totalPrice.toLocaleString()} VND</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/80">Bạn tiết kiệm</span>
              <span className="text-green-400">
                {productDiscountTotal.toLocaleString()} VND
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/80">VAT (8%)</span>
              <span>{vatAmount.toLocaleString()} VND</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/80">Phí vận chuyển</span>
              <span>{shippingFee.toLocaleString()} VND</span>
            </div>

            {selectedVoucher && discountAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-white/80">
                  Giảm giá ({selectedVoucher.code})
                </span>
                <span className="text-green-400">
                  -{discountAmount.toLocaleString()} VND
                </span>
              </div>
            )}
            {/* Loyalty discount */}
            {loyaltyDiscountPercent > 0 && loyaltyDiscount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-white/80">
                  Giảm giá thành viên ({loyaltyDiscountPercent}%)
                </span>
                <span className="text-green-400">
                  -{loyaltyDiscount.toLocaleString()} VND
                </span>
              </div>
            )}

            <hr className="border-gray-600" />

            <div className="flex justify-between font-semibold text-sm sm:text-base">
              <span>Tổng cộng</span>
              <span className="text-secondaryColor">
                {finalAmount.toLocaleString()} VND
              </span>
            </div>
          </div>

          <ButtonComponents
            variant="filled"
            size="medium"
            className="mt-4 w-full text-xs sm:text-sm md:text-base"
            onClick={
              onProceedToPayment || (() => console.log('Thanh toán clicked'))
            }
          >
            TIẾN HÀNH THANH TOÁN
          </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSection;