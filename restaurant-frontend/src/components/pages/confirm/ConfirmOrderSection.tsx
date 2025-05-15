import React, { useState } from "react";
import ButtonComponents from '@components/common/ButtonComponents';
import { FiMenu, FiX, FiHome, FiBook, FiCalendar, FiPhone, FiInfo } from "react-icons/fi";
// import { motion } from "framer-motion";

const OrderConfirmation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const orderData = {
    userInfo: {
      fullName: "Nguyen Van A",
      phone: "+84 123 456 789",
      address: "123 Nguyen Hue, District 1, HCMC",
      email: "example@email.com"
    },
    orderItems: [
      {
        id: 1,
        name: "Phở Bò Đặc Biệt",
        quantity: 2,
        discountedPrice: 83000,
        price: 85000,
        image: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f",
        note: "Không rau"
      },
      {
        id: 2,
        name: "Gỏi Cuốn Tôm Thịt",
        quantity: 3,
        discountedPrice: 43000,
        price: 45000,
        image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7",
        note: "Ít cay"
      }
    ],
    deliveryMethod: "Giao hàng tận nơi",
    paymentMethod: "Thanh toán khi nhận hàng",
    specialInstructions: "Không hành, thêm ớt",
    subtotal: 265000,
    deliveryFee: 30000
  };

  return (
    <div className="min-h-screen bg-[#012B40] text-white">

      {/* Main Content */}
      <main className=" mx-auto pt-10 pb-12">
        <h1
          className="text-4xl font-bold text-center mb-12"
        >
          Xác nhận đơn hàng
        </h1>

        {/* User Information */}
        <section className="border text-white placeholder:text-gray-400 border-[#074b6b] rounded p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Thông tin khách hàng</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoItem label="Họ tên" value={orderData.userInfo.fullName} />
            <InfoItem label="Số điện thoại" value={orderData.userInfo.phone} />
            <InfoItem label="Địa chỉ" value={orderData.userInfo.address} />
            {/* <InfoItem label="Email" value={orderData.userInfo.email} /> */}
          </div>
        </section>

        {/* Order Items */}
        <section className="border text-white placeholder:text-gray-400 border-[#074b6b] rounded p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Món ăn đã chọn</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4">Món ăn</th>
                  <th className="text-center py-4">Số lượng</th>
                  <th className="text-right py-4">Đơn giá</th>
                  <th className="text-right py-4">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderData.orderItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/20">
                    <td className="py-4">
                      <div className="flex items-center space-x-4 w-full">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                        <div className="flex flex-col flex-grow">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-300">Phân loại: Món chính</span>
                          <span className="text-sm italic text-gray-400 mt-1">Ghi chú: {item.note || 'Không có ghi chú'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right"> <div>
                      {item.discountedPrice !== item.price ? (
                        <div className="text-sm mt-1 flex flex-col">
                          <span className="line-through text-gray-400">{item.price.toLocaleString()} VNĐ</span>
                          <span className="text-secondaryColor font-semibold">{item.discountedPrice.toLocaleString()} VNĐ</span>
                        </div>
                      ) : (
                          <div className="text-sm mt-1">{item.price.toLocaleString()} VNĐ</div>
                      )}
                    </div>
                    </td>
                    <td className="text-right">
                      {(item.price * item.quantity).toLocaleString()} VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Order Details */}
        <section className="border text-white placeholder:text-gray-400 border-[#074b6b] rounded p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoItem label="Phương thức giao hàng" value={orderData.deliveryMethod} />
            <InfoItem label="Phương thức thanh toán" value={orderData.paymentMethod} />
            <InfoItem label="Ghi chú" value={orderData.specialInstructions} />
          </div>
        </section>

        {/* Price Summary */}
        <section className="border text-white placeholder:text-gray-400 border-[#074b6b] rounded p-6 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{orderData.subtotal.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí giao hàng:</span>
              <span>{orderData.deliveryFee.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/20">
              <span>Tổng cộng:</span>
              <span>{(orderData.subtotal + orderData.deliveryFee).toLocaleString()} VNĐ</span>
            </div>
          </div>
        </section>

        {/* Confirmation Button */}
        <div className="text-center">
          <ButtonComponents variant="filled" size="large" className="mt-2">
            Xác nhận đơn hàng
          </ButtonComponents>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, text }) => (
  <a
    href="#"
    className="flex items-center space-x-2 hover:text-teal-300 transition-colors duration-200"
  >
    {icon}
    <span>{text}</span>
  </a>
);

const InfoItem = ({ label, value }) => (
  <div>
    <span className="text-gray-300">{label}:</span>
    <p className="font-medium">{value}</p>
  </div>
);

export default OrderConfirmation;