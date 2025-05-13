'use client';

import React, { useState } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import ButtonComponents from '@components/common/ButtonComponents';
import VoucherSelector, { Voucher } from './VoucherSelector';

interface Product {
  image: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

interface ProductInfoProps {
  products: Product[];
  note?: string;
  shippingFee?: number;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  vouchers?: Voucher[];
}

const ProductInfoSection = ({
  products,
  note,
  shippingFee = 0,
  paymentMethod,
  onPaymentMethodChange,
  vouchers = [],
}: ProductInfoProps) => {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [orderNote, setOrderNote] = useState(note || '');

  const totalPrice = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const finalAmount = totalPrice + shippingFee - discountAmount;

  const handleVoucherApply = (voucher: Voucher, discount: number) => {
    // If we receive an empty voucher object (from reset), clear the selection
    if (!voucher.voucher_id) {
      setSelectedVoucher(null);
      setDiscountAmount(0);
      return;
    }

    setSelectedVoucher(voucher);
    setDiscountAmount(discount);
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
                    {product.category? (
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
                        placeholder="Ghi chú cho món này (không bỏ ớt, thêm gia vị...)"
                        className="w-full max-w-xs text-xs bg-gray-800 border border-gray-600 rounded p-1.5 text-white/80 focus:border-secondaryColor focus:outline-none"
                        defaultValue={product.notes || ''}
                        onChange={(e) => {
                          // Here you would update the notes in your state/context
                          // For example: updateProductNotes(product.id, e.target.value)
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-2 text-center">
                  {product.price.toLocaleString()}VND
                </td>
                <td className="p-2 text-center">x{product.quantity}</td>
                <td className="p-2 font-semibold text-right">
                  {(product.price * product.quantity).toLocaleString()}VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phí vận chuyển */}
      <div className="mt-3 md:mt-4 text-right">
        <span className="text-xs sm:text-sm text-white/70 mr-2">
          Phí vận chuyển:
        </span>
        <span className="font-semibold text-sm sm:text-base">
          {shippingFee.toLocaleString()}VND
        </span>
      </div>

      {/* Tổng cộng */}
      <div className="mt-1 text-right">
        <span className="text-xs sm:text-sm text-white/70 mr-2">
          Tổng cộng:
        </span>
        <span className="font-bold text-sm sm:text-base md:text-lg">
          {finalAmount.toLocaleString()}VND
        </span>
      </div>

      {/* Ghi chú */}
      <div className="mt-4 md:mt-6">
        <label className="block text-xs sm:text-sm text-white/70 mb-1">
          Lưu ý cho người bán:
        </label>
        <textarea
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder="Nhập lời nhắn..."
          className="w-full border border-white/20 bg-transparent px-2 py-1 sm:px-3 sm:py-2 rounded text-white placeholder:text-white/40 text-xs sm:text-sm md:text-base"
          rows={3}
        />
      </div>

      <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:gap-4">
        {/* Phương thức thanh toán */}

        <div className="flex-1">
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onChange={onPaymentMethodChange}
          />
        </div>
        {/* Chọn mã giảm giá */}
        {vouchers && vouchers.length > 0 && (
          <div className="flex-1 mb-4 md:mb-0">
            <VoucherSelector
              vouchers={vouchers}
              orderTotal={totalPrice}
              onApply={handleVoucherApply}
            />
          </div>
        )}
      </div>

      {/* Tóm Tắt Đơn Hàng */}
      <div className="mt-6 md:mt-8 w-full">
        <div className="w-full md:w-2/3 lg:w-1/2 md:ml-auto bg-bodyBackground p-3 sm:p-4 md:p-6 rounded-md border border-white/10">
          <div className="space-y-2 md:space-y-3 text-xs sm:text-sm text-white">
            <div className="flex justify-between">
              <span>Tổng tiền hàng:</span>
              <span>{totalPrice.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee.toLocaleString()} VND</span>
            </div>
            {selectedVoucher && discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Giảm giá ({selectedVoucher.code}):</span>
                <span className="text-green-400">
                  -{discountAmount.toLocaleString()} VND
                </span>
              </div>
            )}
            <hr className="my-2 border-gray-600" />
            <div className="flex justify-between font-semibold text-sm sm:text-base">
              <span>Tổng thanh toán:</span>
              <span className="text-secondaryColor">
                {finalAmount.toLocaleString()} VND
              </span>
            </div>
          </div>
          <ButtonComponents
            variant="filled"
            size="medium"
            className="mt-3 md:mt-4 w-full text-xs sm:text-sm md:text-base"
            onClick={() => console.log('Thanh toán clicked')}
          >
            Thanh toán
          </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSection;
