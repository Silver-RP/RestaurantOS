import React from 'react';
import ButtonComponents from '../../../common/ButtonComponents';
import { FaDiamond } from "react-icons/fa6";

const Menu = () => {
  return (
    <div className="bg-bodyBackground sm:h-[630px] flex items-center justify-center text-white">
      {/* Main Content */}
      <div className="p-12 sm:p-6 w-mainContainer sm:w-container95 mt-6  pb-20">

        {/* Section: Image and Info */}
        <section className="flex flex-col md:flex-row md:grid-cols-2 justify-between items-center space-y-8 sm:space-y-0">

          {/* box1 */}
          <section className="text-center max-w-md  pt-0 md:w-1/3 w-full">
          
            <div className="flex flex-col items-center mb-4">
              <img
                src="/assets/images/AboutUs/Icon.svg"
                alt="Menu Banner"
                className="rounded mb-2"
              />
              <h1 className="text-[26px] md:text-[28px] font-restora">Thực Đơn Món Ăn</h1>
            </div>

            <h2 className="text-xs sm:text-sm md:text-base flex justify-center items-center font-sans font-extralight uppercase tracking-widest mb-6 text-secondaryColor">
              <FaDiamond className="inline mr-2" style={{ fontSize: "7px" }} />
              Tận HƯỞNG ĐẶC SẮC
              <FaDiamond className="inline ml-2" style={{ fontSize: "7px" }} />
            </h2>

         
            <p className="text-gray-300 text-[12px] leading-6 sm:text-sm text-justify">
              Thực phẩm theo mùa cung cấp nhiều loại trái cây, rau và thịt cho bữa ăn.
              Hãy sưởi ấm mùa đông này bằng một cốc rượu táo nóng và khám phá tất cả mọi thứ từ
              những món ăn mùa thu tuyệt vời đến các công thức nấu ăn mùa hè sảng khoái với sự
              trợ giúp của các thực đơn theo mùa này.
            </p>
            <ButtonComponents variant="outline" size="small" className="mt-4">
              Khám phá ngay
            </ButtonComponents>
          </section>

        {/* box2 */}
          
          <div className='flex-row  w-full sm:flex sm:w-2/3'>
            <div className="w-full sm:w-1/2 flex justify-center sm:pl-10">
              <img
                src="/assets/images/AboutUs/anh1.svg"
                alt="Menu Items"
                className="rounded shadow-lg"
              />
            </div>
  
            <div className="w-full sm:w-1/2 text-left pt-16 space-y-12 sm:space-y-8 mt-10 sm:mt-0">
              <div className="text-center mb-3">
                <h2 className="text-secondaryColor text-[12px] font-restora">Giờ Hoạt Động</h2>
                <div className="mt-3">
                  <p className="text-gray-300 text-[12px]">T2 - T7: 5a.m - 11p.m</p>
                  <p className="text-gray-300 text-[12px]">CN: 7a.m - 11p.m</p>
                </div>
              </div>
              <div className="text-center mb-12 mt-3">
                <h2 className="text-secondaryColor text-[12px] font-restora">Địa Chỉ</h2>
                <div className="mt-3">
                  <p className="text-gray-300 text-[12px]">161 đường Quốc Hương,</p>
                  <p className="text-gray-300 text-[12px]"> Thảo Điền, Quận 2, TP.HCM</p>
                </div>
              </div>
              <div className="text-center mb-12 mt-3">
                <h2 className="text-secondaryColor text-[12px] font-restora">Liên Hệ</h2>
                <div className="mt-3">
                  <p className="text-gray-300 text-[12px]">+39-066-666999</p>
                  <p className="text-gray-300 text-[12px]">demo@demo.com</p>
                </div>
              </div>
            </div>
            </div>

        </section>
      </div>
    </div>
  );
};

export default Menu;
