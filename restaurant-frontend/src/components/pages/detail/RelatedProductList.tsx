
import ProductCardGrid from '../../common/ProductCardGrid';
import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Product {
  imageUrl?: string;
  hoverImage?: string;
  name: string;
  cate?: string;
  price?: number;
  originalPrice?: number;
  discount?: string;
  isNew?: boolean;
}

interface RelatedProductListProps {
  products: Product[];
}

const RelatedProductList: React.FC<RelatedProductListProps> = ({ products }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      if (width >= 1024) setItemsPerSlide(4);
      else if (width >= 768) setItemsPerSlide(2);
      else setItemsPerSlide(1);
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  const maxSlideIndex = Math.ceil(products.length / itemsPerSlide) - 1;

  const handlePrev = () => {
    setSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setSlideIndex((prev) => Math.min(prev + 1, maxSlideIndex));
  };

  const visibleProducts = products.slice(
    slideIndex * itemsPerSlide,
    slideIndex * itemsPerSlide + itemsPerSlide
  );

  return (
    <div className="py-10 relative">
      <h2 className="text-2xl md:text-3xl text-white mb-6">
        Bạn cũng có thể thích
      </h2>

      <div className="relative flex items-center">
        {/* Prev Button */}
        {slideIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 bg-white text-[#002B40] rounded-full p-2 shadow hover:bg-secondaryColor hover:text-white transition"
          >
            <FiChevronLeft size={24} />
          </button>
        )}

        {/* Product List */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300">
            {visibleProducts.map((product, index) => (
              <ProductCardGrid description={''} key={index} {...product} />
            ))}
          </div>
        </div>

        {/* Next Button */}
        {slideIndex < maxSlideIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 bg-white text-[#002B40] rounded-full p-2 shadow hover:bg-secondaryColor hover:text-white transition"
          >
            <FiChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RelatedProductList;
