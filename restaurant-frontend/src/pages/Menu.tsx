import React, { useState } from 'react';
import FilterSidebar from '../components/pages/menu/FilterSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import ProductGrid from '../components/pages/menu/ProductGrid';
import Pagination from '../components/common/Pagination';
import { BsGridFill, BsListUl } from 'react-icons/bs';
import { useFoods } from '../hooks/useFoods';
import { ProductCardProps } from 'types/ProductCard.types';
import { useSidebar } from '../contexts/SidebarContext';
import { FiFilter } from 'react-icons/fi';
import Container from '@/components/common/Container';
import { useFavorites } from '@/hooks/useFavorites';
const MenuPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isExtended } = useSidebar();
  const { addToFavorites } = useFavorites();
  const {
    foods,
    loading,
    error,
    pagination,
    searchParams,
    setSearchParams,
    setPagination,
  } = useFoods();
  const mappedFoods: ProductCardProps[] = Array.isArray(foods?.docs)
    ? foods.docs
        .filter((food) => food.status !== 'hidden')
        .map((food) => ({
            id: food._id,
            name: food.name,
            slug: food.slug,
            views: food.views,
            ordered_count: food.ordered_count,
            rating: food.average_rating ?? 0,
            rating_count: food.rating_count ?? 0, 
            price: food.discount_price || food.price,
            originalPrice: food.price,
            discount: food.discount_price
              ? `${Math.round((1 - food.discount_price / food.price) * 100)}% OFF`
              : undefined,
            imageUrl: food.images?.[0] || '',
            hoverImage: food.images?.[1] || '',
            description: food.description || '',
            categories: food.categories || [],
            cate: food.categories?.[0]?.Cate_name,
            isDishNew: food.isDishNew,
            isRecommend: food.isRecommend,
            favorites_count: food.favorites_count || 0,
            onAddToFavorite: () => addToFavorites(food._id),
            status: food.status,
      }))
    : [];

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const sortValue = e.target.value;
  setSearchParams((prevParams) => {
    const newParams = new URLSearchParams(prevParams);
    newParams.set('sort', sortValue);
    newParams.set('page', '1'); 
    return newParams;
  });
};

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <section className="bg-bodyBackground w-full min-h-screen text-white">
      <div className="w-full mx-auto">
        <BreadCrumbComponents />
      </div>
      <Container>
      <div className="flex gap-8 py-10 w-full max-w-[1500px] mx-auto">
        {isFilterOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={toggleFilter}
          ></div>
        )}
        <div
          className={`fixed top-0 left-0 w-80 bg-bodyBackground h-full z-[120] transform ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6 overflow-y-auto h-full">
          <FilterSidebar onClose={() => setIsFilterOpen(false)} />
          </div>
        </div>
        <main className="flex-1 space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={toggleFilter}
                className="flex items-center gap-2 text-white hover:text-secondaryColor transition"
              >
                <FiFilter className="h-5 w-5" />
                <span className="text-sm">Lọc</span>
              </button>

              <div className="flex items-center gap-2 text-secondaryColor">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 border rounded ${viewMode === 'grid' ? 'bg-secondaryColor text-black' : ''}`}
                >
                  <BsGridFill />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 border rounded ${viewMode === 'list' ? 'bg-secondaryColor text-black' : ''}`}
                >
                  <BsListUl />
                </button>
              </div>

              <div className="relative">
                <select
                  onChange={handleSortChange}
                  className="appearance-none bg-bodyBackground border border-gray-500 text-white rounded px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-secondaryColor"
                >
                  <option value="relevance">Mặc định</option>
                  <option value="nameAZ">Tên A-Z</option>
                  <option value="nameZA">Tên Z-A</option>
                  <option value="priceLow">Giá thấp đến cao</option>
                  <option value="priceHigh">Giá cao đến thấp</option>
                  <option value="newest">Mới nhất</option>
                  <option value="highestRated">Đánh giá cao nhất</option>
                  <option value="mostViewed">Lượt xem nhiều nhất</option>
                  <option value="mostOrdered">Đặt hàng nhiều nhất</option>
                  <option value="mostFavorite">Được yêu thích nhất</option>
                  <option value="recommendDishes">Món ăn được đề xuất</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondaryColor">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="text-sm text-white">
              Hiển thị{' '}
              <span className="font-semibold text-secondaryColor">
                {(pagination.currentPage - 1) * pagination.limit + 1} -{' '}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  foods?.totalDocs || 0,
                )}
              </span>{' '}
              trên tổng{' '}
              <span className="font-semibold text-secondaryColor">
                {foods?.totalDocs || 0}
              </span>{' '}
              sản phẩm
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">Đang tải dữ liệu món ăn...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : (
            <ProductGrid
              viewMode={viewMode}
              products={mappedFoods}
              isSidebarExtended={isExtended}
            />
          )}

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => {
              if (
                !isNaN(newPage) &&
                newPage >= 1 &&
                newPage <= pagination.totalPages
              ) {
                setSearchParams((prevParams) => {
                  const newParams = new URLSearchParams(prevParams);
                  newParams.set('page', newPage.toString());
                  newParams.set('sort', newParams.get('sort') || 'default');
                  return newParams;
                });
                setPagination((prev) => ({
                  ...prev,
                  currentPage: newPage,
                  prevPage: Math.max(newPage - 1, 1),
                  nextPage: Math.min(newPage + 1, pagination.totalPages),
                }));
              }
            }}
            limit={Number(searchParams.get('limit') || 10)}
            onLimitChange={(newLimit) => {
              setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set('limit', newLimit.toString());
                newParams.delete('page'); 
                return newParams;
              });
            }}
          />
        </main>
      </div>
      </Container>
    </section>
  );
};

export default MenuPage;
