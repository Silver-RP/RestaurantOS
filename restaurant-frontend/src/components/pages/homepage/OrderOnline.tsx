import ProductCardGrid from '../../common/ProductCardGrid';
import React, { useState, useEffect } from 'react';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { FaDiamond } from 'react-icons/fa6';
import { useFoodNewest } from '@hooks/useFoods';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  hoverImage?: string;
  isNew: boolean;
  discount?: string;
  cate?: string;  
  slug: string;
  description?: string;
}


const OrderOnlineSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [productsPerPage, setProductsPerPage] = useState<number>(4);
  const { data: foods, error } = useFoodNewest();
  
   const products: Product[] =
     foods?.map((food) => ({
       id: food._id,
       name: food.name,
       price: food.discount_price || food.price,
       originalPrice: food.discount_price ? food.price : undefined,
       imageUrl: food.images[0] || '',
       hoverImage: food.images[1] || '',
       isNew: true,
       discount: food.discount_price
         ? `${Math.round(((food.price - food.discount_price) / food.price) * 100)}% OFF`
         : undefined,
       cate: food.categories[0]?.Cate_name || 'Unknown',
       slug: food.slug,
     })) || [];

  useEffect(() => {
    const updateProductsPerPage = () => {
      if (window.innerWidth < 640) {
        setProductsPerPage(1);
      } else if (window.innerWidth < 768) {
        setProductsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setProductsPerPage(3);
      } else {
        setProductsPerPage(4);
      }
    };

    updateProductsPerPage();
    window.addEventListener('resize', updateProductsPerPage);
    return () => window.removeEventListener('resize', updateProductsPerPage);
  }, []);

  const handleNavigation = (direction: 'prev' | 'next') => {
    const maxIndex = Math.ceil(products.length / productsPerPage) - 1;
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    if (direction === 'next' && currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <section className="bg-bodyBackground w-full text-white py-16">
      <div className="w-mainContainer mx-auto">
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

        <div className="overflow-hidden relative">
          <div
            className="flex gap-8 transition-transform duration-700 ease-in-out"
            style={{
              width: `calc(${(products.length * 100) / productsPerPage}% + ${(products.length * 32) / productsPerPage}px)`,
              transform: `translateX(calc(-${currentIndex * (100 / productsPerPage)}% - ${(currentIndex * (32 * productsPerPage)) / productsPerPage}px))`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{ width: `calc((100% - 96px) / 4)` }}
              >
                <ProductCardGrid
                  name={product.name}
                  imageUrl={product.imageUrl}
                  hoverImage={product.hoverImage}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  isNew={product.isNew}
                  cate={product.cate}
                  description={''}
                  slug={product.slug}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => handleNavigation('prev')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-secondaryColor p-2 z-10"
            disabled={currentIndex === 0}
          >
            <BsArrowLeftCircle size={30} />
          </button>

          <button
            onClick={() => handleNavigation('next')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-secondaryColor p-2 z-10"
            disabled={
              currentIndex >= Math.ceil(products.length / productsPerPage) - 1
            }
          >
            <BsArrowRightCircle size={30} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderOnlineSection;
