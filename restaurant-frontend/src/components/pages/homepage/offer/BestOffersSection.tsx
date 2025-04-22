import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import MenuGrid from "./MenuGrid";
import { useDishByCategory } from "@hooks/useFoods";

const BestOffersSection: React.FC = () => {
  const tabs = ["Đồ ăn", "Đồ uống"];
  const cateTypes = ["dish", "drink"];

  const [activeTab, setActiveTab] = useState(0);
  console.log("ACTIVE TAB:", activeTab);
  
  const { data, isLoading, isError } = useDishByCategory(cateTypes[activeTab]);
  console.log("DATA FROM API:", data);
  
  return (
    <section className="w-full bg-bodyBackground py-16">
      <div className="w-11/12 md:w-container95 lg:w-mainContainer xl:w-container95 2xl:w-mainContainer mx-auto">
        <img src="/assets/images/home/IconOnline.svg" alt="Icon" className="mx-auto mb-8" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora justify-center text-white flex font-thin mb-4">
          Lựa chọn tốt nhất cho bạn
        </h2>

        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        {isLoading ? (
          <div className="text-center text-gray-300 mt-8">Đang tải dữ liệu...</div>
        ) : isError ? (
          <div className="text-center text-red-400 mt-8">Lỗi tải dữ liệu</div>
        ) : (data ?? []).length > 0 ? (
          <MenuGrid
            items={data.slice(0, 6).map((dish) => ({
              name: dish.name,
              price: dish.price,
              description: dish.description,
              image: dish.images?.[0] || '', // ✅ dùng ảnh đầu tiên trong mảng images
              hoverImage: dish.images?.[1] || dish.images?.[0] || '', // ảnh hover nếu có
            }))}
          />
        ) : (
          <div className="text-center text-gray-400 mt-8">Không có món ăn trong danh mục này</div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm md:text-base text-gray-300 mb-4">
            Phục vụ hàng ngày từ <span className="text-secondaryColor font-semibold">8:30 am</span> đến{" "}
            <span className="text-secondaryColor font-semibold">11:00 pm</span>
          </p>
          <button className="mt-4 px-8 py-3 text-sm md:text-base font-semibold text-secondaryColor border border-secondaryColor hover:bg-secondaryColor hover:text-black transition-all duration-300">
            XEM THỰC ĐƠN
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestOffersSection;
