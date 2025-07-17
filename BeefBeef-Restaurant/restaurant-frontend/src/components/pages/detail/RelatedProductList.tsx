import React, { useEffect, useState } from 'react';
import ProductCardGrid from '../../common/ProductCardGrid';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useFoodBest4 } from '@hooks/useFoods';
import { ProductCardProps } from '@/types/ProductCard.types';
interface RelatedProductListProps {
  categories: string[];
}

const RelatedProductList: React.FC<RelatedProductListProps> = ({ categories }) => {
  const categoryId = categories?.[0];

  if (!categoryId) return null;

  const { data: foods = [] } = useFoodBest4(categoryId);
  const [slideIndex, setSlideIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  const products: ProductCardProps[] = foods.map((food) => ({ 
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
  rating: food.average_rating || 4,
  favorites_count: food.favorites_count || 0,
  countInStock: food.countInStock || 10,
  onAddToFavorite: () => {},
}));

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

  const handlePrev = () => setSlideIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setSlideIndex((prev) => Math.min(prev + 1, maxSlideIndex));

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
            {products
              .slice(
                slideIndex * itemsPerSlide,
                slideIndex * itemsPerSlide + itemsPerSlide,
              )
              .map((product) => (
                <ProductCardGrid key={product.id} {...product} />
              ))}
          </div>
        </div>

        {/* Next Button */}
        {slideIndex < maxSlideIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 bg-white text-headerBackground rounded-full p-2 shadow hover:bg-secondaryColor hover:text-white transition"
          >
            <FiChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RelatedProductList;
