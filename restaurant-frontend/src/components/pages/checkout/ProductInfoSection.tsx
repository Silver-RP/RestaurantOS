import React from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import ButtonComponents from '@components/common/ButtonComponents';

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
}

const ProductInfoSection = ({
  products,
  note,
  shippingFee = 0,
  paymentMethod,
  onPaymentMethodChange,
}: ProductInfoProps) => {
  const totalPrice = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const finalAmount = totalPrice + shippingFee;

  return (
    <div className="p-4 md:p-6 border border-white/10 rounded-md text-white">
      <h2 className="font-semibold text-lg md:text-xl mb-4">
        Thông tin đơn hàng
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-base table-auto border-collapse">
          <thead>
            <tr className="bg-white/5 text-left">
              <th className="p-2 font-medium">Món ăn</th>
              <th className="p-2 font-medium whitespace-nowrap">Đơn giá</th>
              <th className="p-2 font-medium whitespace-nowrap">Số lượng</th>
              <th className="p-2 font-medium whitespace-nowrap">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx} className="border-t border-white/10">
                <td className="p-2 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    {product.category && (
                      <p className="text-xs text-white/60 mt-0.5">
                        Phân loại: {product.category}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-2">₫{product.price.toLocaleString()}</td>
                <td className="p-2">x{product.quantity}</td>
                <td className="p-2 font-semibold">
                  ₫{(product.price * product.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phí vận chuyển */}
      <div className="mt-4 text-right">
        <span className="text-sm text-white/70 mr-2">Phí vận chuyển:</span>
        <span className="font-semibold text-base">
          ₫{shippingFee.toLocaleString()}
        </span>
      </div>

      {/* Tổng cộng */}
      <div className="mt-1 text-right">
        <span className="text-sm text-white/70 mr-2">Tổng cộng:</span>
        <span className="font-bold text-lg">
          ₫{finalAmount.toLocaleString()}
        </span>
      </div>

      {/* Ghi chú */}
      <div className="mt-4">
        <label className="block text-sm text-white/70 mb-1">
          Lưu ý cho người bán:
        </label>
        <input
          type="text"
          defaultValue={note}
          placeholder="Nhập lời nhắn..."
          className="w-full border border-white/20 bg-transparent px-3 py-2 rounded text-white placeholder:text-white/40"
        />
      </div>

      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onChange={onPaymentMethodChange}
      />

      {/* Tóm Tắt Đơn Hàng */}
      <div className="flex justify-end mt-6 w-full">
        <div className="w-1/3 bg-bodyBackground p-6 mt-6">
          <div className="space-y-2 text-sm text-white">
            <p>
              <span>Tổng tiền hàng:</span>
              <span className="float-right">
                {totalPrice.toLocaleString()} đ
              </span>
            </p>
            <p>
              <span>Tổng tiền vận chuyển:</span>
              <span className="float-right">
                {shippingFee.toLocaleString()} đ
              </span>
            </p>
            <hr className="my-2 border-gray-600" />
            <p className="font-semibold">
              <span>Tổng thanh toán:</span>
              <span className="float-right text-secondaryColor">
                {finalAmount.toLocaleString()} đ
              </span>
            </p>
          </div>
          <ButtonComponents
            variant="filled"
            size="medium"
            className="mt-4 w-full"
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
