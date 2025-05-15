import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import MenuGrid from "./MenuGrid";
import { useDishByFavoriteCategory } from "@hooks/useFoods";

const BestOffersSection: React.FC = () => {
  const tabs = ["Đồ ăn", "Đồ uống"];
  const cateTypes = ["dish", "drink"];
  const [activeTab, setActiveTab] = useState(0);
  const { data, isLoading, isError } = useDishByFavoriteCategory(cateTypes[activeTab]);
  return (
    <section className="w-full bg-bodyBackground py-16">
      <div className="w-11/12 md:w-container95 lg:w-mainContainer xl:w-container95 2xl:w-mainContainer mx-auto">
        <img src="/assets/images/home/IconOnline.svg" alt="Icon" className="mx-auto mb-8" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora justify-center text-white flex font-thin mb-4">
          Món ăn yêu thích nhất
        </h2>
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {isLoading ? (
          <div className="text-center text-gray-300 mt-8">Đang tải dữ liệu...</div>
        ) : isError ? (
          <div className="text-center text-red-400 mt-8">Lỗi tải dữ liệu</div>
        ) : (data ?? []).length > 0 ? (
          <MenuGrid
            items={(data ?? []).slice(0, 6).map((dish) => ({
              name: dish.name,
              price: dish.price,
              description: dish.description,
              image: dish.images?.[0] || "",
              hoverImage: dish.images?.[1] || dish.images?.[0] || "",
              slug: dish.slug || "",
              average_rating: dish.average_rating || 0,
            }))}
          />
        ) : (
          <div className="text-center text-gray-400 mt-8">Không có món ăn trong danh mục này</div>
        )}

        <hr className="mt-2 border-t border-white/10 w-full" />

        <div className="mt-12 text-center">
          <p className="text-sm md:text-base text-gray-300 mb-4">
            Phục vụ hàng ngày từ <span className="text-secondaryColor">8:30 am</span> đến{" "}
            <span className="text-secondaryColor">11:00 pm</span>
          </p>
          <button className="mt-4 px-8 py-3 text-sm md:text-base text-secondaryColor border border-secondaryColor hover:bg-secondaryColor hover:text-black transition-all duration-300">
            XEM THỰC ĐƠN
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestOffersSection;