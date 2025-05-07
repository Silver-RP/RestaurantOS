import ProductCardGrid from '../../common/ProductCardGrid';
import React, { useState, useEffect } from 'react';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { FaDiamond } from 'react-icons/fa6';

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
}

const products: Product[] = [
  {
    id: 1,
    name: 'Olivas Rellenas',
    price: 120000,
    imageUrl: '/assets/images/products/SP1.jpg',
    hoverImage: '/assets/images/products/SP1.1.jpg',
    isNew: true,
    discount: '10% OFF',
    cate: 'Appetizer',
  },
  {
    id: 2,
    name: 'Fish Salad Asian',
    price: 110000,
    imageUrl: '/assets/images/products/SP2.jpg',
    hoverImage: '/assets/images/products/SP2.1.jpg',
    isNew: true,
    cate: 'Salad',
  },
  {
    id: 3,
    name: 'Greek Salad',
    price: 305000,
    originalPrice: 350000,
    imageUrl: '/assets/images/products/SP3.jpg',
    hoverImage: '/assets/images/products/SP3.1.jpg',
    isNew: true,
    cate: 'Salad',
  },
  {
    id: 4,
    name: 'Mixed Vegetable',
    price: 211000,
    imageUrl: '/assets/images/products/SP4.jpg',
    hoverImage: '/assets/images/products/SP4.1.jpg',
    isNew: true,
    cate: 'Vegetable',
  },
  {
    id: 5,
    name: 'Tomato Soup',
    price: 80000,
    imageUrl: '/assets/images/products/SP5.jpg',
    hoverImage: '/assets/images/products/SP5.1.jpg',
    isNew: true,
    cate: 'Soup',
  },
  {
    id: 6,
    name: 'Caesar Salad',
    price: 130000,
    imageUrl: '/assets/images/products/SP6.jpg',
    hoverImage: '/assets/images/products/SP6.1.jpg',
    isNew: true,
    cate: 'Salad',
  },
  {
    id: 7,
    name: 'Vegetable Soup',
    price: 95000,
    imageUrl: '/assets/images/products/SP7.jpg',
    hoverImage: '/assets/images/products/SP7.1.jpg',
    isNew: true,
    cate: 'Soup',
  },
  {
    id: 8,
    name: 'Chicken Soup',
    price: 150000,
    imageUrl: '/assets/images/products/SP8.jpg',
    hoverImage: '/assets/images/products/SP8.1.jpg',
    isNew: false,
    cate: 'Soup',
  },
  {
    id: 9,
    name: 'Grilled Fish',
    price: 250000,
    imageUrl: '/assets/images/products/SP9.jpg',
    hoverImage: '/assets/images/products/SP9.1.jpg',
    isNew: false,
    cate: 'Main Course',
  },
  {
    id: 10,
    name: 'Vegetable Stir Fry',
    price: 180000,
    imageUrl: '/assets/images/products/SP10.jpg',
    hoverImage: '/assets/images/products/SP10.1.jpg',
    isNew: false,
    cate: 'Vegetable',
  },
  {
    id: 11,
    name: 'Seafood Salad',
    price: 220000,
    imageUrl: '/assets/images/products/SP10.jpg',
    hoverImage: '/assets/images/products/SP10.1.jpg',
    isNew: false,
    cate: 'Salad',
  },
];

const OrderOnlineSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [productsPerPage, setProductsPerPage] = useState<number>(4);

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
                  cate={product.cate} description={''}/>
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
