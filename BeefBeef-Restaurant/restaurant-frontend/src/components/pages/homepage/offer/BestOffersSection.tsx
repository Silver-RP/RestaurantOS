import React, { useState } from 'react';
import TabNavigation from './TabNavigation';
import MenuGrid from './MenuGrid';
import { useDishByFavoriteCategory } from '@hooks/useFoods';
import Container from '@/components/common/Container';
import { useNavigate } from 'react-router-dom';

const BestOffersSection: React.FC = () => {
  const tabs = ['Đồ ăn', 'Đồ uống'];
  const cateTypes = ['dish', 'drink'];
  const [activeTab, setActiveTab] = useState(0);
  const { data, isLoading, isError } = useDishByFavoriteCategory(
    cateTypes[activeTab],
  );
  const navigate = useNavigate();
  return (
    <section className="w-full bg-bodyBackground py-16">
      <Container>
        <img
          src="/assets/images/home/IconOnline.svg"
          alt="Icon"
          className="mx-auto mb-8"
        />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora justify-center text-white flex font-thin mb-4">
          Món ăn yêu thích nhất
        </h2>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {isLoading ? (
          <div className="text-center text-gray-300 mt-8">
            Đang tải dữ liệu...
          </div>
        ) : isError ? (
          <div className="text-center text-red-400 mt-8">Lỗi tải dữ liệu</div>
        ) : (data ?? []).length > 0 ? (
          <MenuGrid
            items={(data ?? []).slice(0, 6).map((dish) => ({
              name: dish.name,
              price: dish.price,
              description: dish.description,
              image: dish.images?.[0] || '',
              hoverImage: dish.images?.[1] || dish.images?.[0] || '',
              slug: dish.slug || '',
              average_rating: dish.average_rating || 0,
            }))}
          />
        ) : (
          <div className="text-center text-gray-400 mt-8">
            Không có món ăn trong danh mục này
          </div>
        )}

        <hr className="mt-2 border-t border-white/10 w-full" />

        <div className="mt-12 text-center">
          <div className="text-sm md:text-base text-gray-300 mb-4 space-y-1">
            <p>
              Phục vụ từ{' '}
              <span className="text-secondaryColor font-medium">
                08:00 - 22:00
              </span>{' '}
              từ thứ 2 đến thứ 6
            </p>
            <p>
              và{' '}
              <span className="text-secondaryColor font-medium">
                08:00 - 23:00
              </span>{' '}
              thứ 7 và Chủ nhật
            </p>
          </div>

          <button
            className="mt-4 px-8 py-3 text-sm md:text-base text-secondaryColor border border-secondaryColor hover:bg-secondaryColor hover:text-black transition-all duration-300"
            onClick={() => navigate('/menu?sort=categoryAZ')}
          >
            XEM THỰC ĐƠN
          </button>
        </div>
      </Container>
    </section>
  );
};

export default BestOffersSection;
