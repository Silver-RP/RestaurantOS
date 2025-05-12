import React from 'react';
import ButtonComponents from "../../../components/common/ButtonComponents";
import Header from "./Header";
import OrderDetails from "./OrderDetails";
import { FaUser, FaPhoneAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const ConfirmOrderSection = () => (
  <section className="text-white w-full px-4 sm:px-6 py-8 sm:py-10 bg-[#012B40]">
    <Header />
    <OrderDetails />

    <div className="bg-[#012B40] shadow-xl w-full max-w-3xl mx-auto p-6 sm:p-8 border border-[#FFDEA0] rounded-lg space-y-8">
      
      {/* Sản phẩm đã đặt */}
      <div>
        <h2 className="text-xl sm:text-2xl font-restora font-light mb-4 sm:mb-6 text-[#FFDEA0]">Sản phẩm đã đặt</h2>
        <div className="space-y-4">
          {/* Một món */}
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto] gap-y-2 sm:gap-x-6 py-4 border-b border-[#FFDEA0]">
            <div className="flex justify-center">
              <img
                src="/assets/images/confirm/image.svg"
                alt="Bò bít tết nướng"
                className="w-20 h-20 object-cover mx-auto"
              />
            </div>
            <div className="text-white font-medium text-sm sm:text-base">Bò bít tết nướng</div>
            <div className="text-white text-sm text-right sm:text-left">Giá: 500.000đ</div>
            <div className="text-white text-sm">×&nbsp;2</div>
            <div className="text-white font-medium text-sm text-right sm:text-left">Tổng: 1.000.000đ</div>
          </div>

          {/* Món thứ hai */}
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto] gap-y-2 sm:gap-x-6 py-4 border-b border-[#FFDEA0]">
            <div className="flex justify-center">
              <img
                src="/assets/images/confirm/image 9.svg"
                alt="Tôm hùm hấp"
                className="w-20 h-20 object-cover mx-auto"
              />
            </div>
            <div className="text-white font-medium text-sm sm:text-base">Tôm hùm hấp</div>
            <div className="text-white text-sm text-right sm:text-left">Giá: 700.000đ</div>
            <div className="text-white text-sm">×&nbsp;1</div>
            <div className="text-white font-medium text-sm text-right sm:text-left">Tổng: 700.000đ</div>
          </div>
        </div>
      </div>

      {/* Ghi chú và các khoản tiền */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Ghi chú */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="orderNote" className="text-[#FFDEA0] text-sm sm:text-base font-light">Ghi chú</label>
          <textarea
            id="orderNote"
            placeholder="Thêm ghi chú cho đơn hàng"
            className="p-3 sm:p-4 bg-[#013C5A] text-white border border-[#FFDEA0] rounded-md resize-none h-auto text-xs sm:text-sm"
            defaultValue="Ít ớt và không cho rau"
          />
        </div>

        {/* Tổng tiền và các khoản */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-white text-xs sm:text-sm">Tổng tiền</div>
            <div className="text-white text-xs sm:text-sm text-right">1.700.000đ</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white text-xs sm:text-sm">Tiền ship</div>
            <div className="text-white text-xs sm:text-sm text-right">30.000đ</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white text-xs sm:text-sm">Voucher</div>
            <div className="text-white text-xs sm:text-sm text-right">-50.000đ</div>
          </div>
          <div className="flex items-center justify-between border-t border-[#FFDEA0] pt-2">
            <div className="text-white font-medium text-xs sm:text-sm">Tổng tất cả</div>
            <div className="text-white font-medium text-xs sm:text-sm text-right">1.680.000đ</div>
          </div>
        </div>
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-restora font-light mb-4 sm:mb-6 text-[#FFDEA0]">Địa chỉ giao hàng</h2>
        <div className="bg-[#013C5A] p-4 sm:p-6 rounded-lg shadow-lg text-xs sm:text-sm">
          {/* Căn chỉnh Thời gian giao hàng và Địa chỉ */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
              <FaUser className="text-[#FFDEA0]" size={16} />
              <span className="font-semibold text-[#FFDEA0]">Họ và tên:</span>
              <span className="text-white">Nguyễn Ngọc Mỹ</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
              <FaPhoneAlt className="text-[#FFDEA0]" size={16} />
              <span className="font-semibold text-[#FFDEA0]">SĐT:</span>
              <span className="text-white">0378217272</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
              <FaMapMarkerAlt className="text-[#FFDEA0]" size={16} />
              <span className="font-semibold text-[#FFDEA0]">Địa chỉ:</span>
              <span className="text-white">Đối diện Lotte Lê Văn Lương, Gò Vấp</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
              <FaClock className="text-[#FFDEA0]" size={16} />
              <span className="font-semibold text-[#FFDEA0]">Thời gian giao hàng:</span>
              <span className="text-white">Dự kiến 30 phút</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nút Xem đơn hàng */}
      <div className="flex justify-center pt-4 sm:pt-6">
        <ButtonComponents
          variant="filled"
          size="large"
          className="px-6 sm:px-8 py-3 rounded-none text-sm sm:text-base"
        >
          Xem đơn hàng
        </ButtonComponents>
      </div>
    </div>
  </section>
);

export default ConfirmOrderSection;
