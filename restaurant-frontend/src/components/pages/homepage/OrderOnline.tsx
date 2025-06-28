import React from 'react';
import { FaDiamond } from 'react-icons/fa6';
import { useFoodNewest } from '@hooks/useFoods';
import Container from '@/components/common/Container';
import ProductCardGrid from '../../common/ProductCardGrid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const OrderOnlineSection: React.FC = () => {
  const { data: foods = [] } = useFoodNewest();

  const products =
    foods.map((food) => ({
      id: food._id,
      name: food.name,
      price: food.discount_price || food.price,
      originalPrice: food.discount_price ? food.price : undefined,
      imageUrl: food.images?.[0] || '',
      hoverImage: food.images?.[1] || '',
      isNew: true,
      discount: food.discount_price
        ? `${Math.round(((food.price - food.discount_price) / food.price) * 100)}% OFF`
        : undefined,
      slug: food.slug,
      description: food.description || '',
      views: food.views || 0,
      categories: food.categories || [],
      cate: food.categories?.[0]?.Cate_name,
      ordered_count: food.ordered_count || 0,
      rating_count: food.rating_count || 0,
      rating: food.average_rating || 0,
      favorites_count: food.favorites_count || 0,
      countInStock: food.countInStock || 10,
      onAddToFavorite: () => {},
    })) || [];

  return (
    <section className="bg-bodyBackground w-full text-white py-16">
      <Container>
        <img
          src="/assets/images/home/IconOnline.svg"
          alt="Icon"
          className="mx-auto mb-8"
        />
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin mb-4">
            Đặt Món Trực Tuyến
          </h2>
          <h2 className="text-xs sm:text-sm md:text-base flex justify-center items-center font-sans font-extralight uppercase tracking-widest mb-6 text-secondaryColor">
            <FaDiamond className="inline mr-2" style={{ fontSize: '7px' }} />
            Đề xuất của chúng tôi
            <FaDiamond className="inline ml-2" style={{ fontSize: '7px' }} />
          </h2>
        </div>

        <div className="relative">
          <div className="custom-swiper-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
          {/* Nút Next */}
          <div className="custom-swiper-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.custom-swiper-prev',
              nextEl: '.custom-swiper-next',
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="!px-4"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCardGrid {...product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
};

export default OrderOnlineSection;
