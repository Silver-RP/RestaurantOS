import React, { useState, useCallback } from 'react';
import FilterSidebar from '../components/pages/menu/FilterSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import ProductGrid from '../components/pages/menu/ProductGrid';
// import Pagination from '../components/pages/menu/Pagination';
import Pagination from '../components/common/Pagination';
import { BsGridFill, BsListUl } from 'react-icons/bs';
import { useFoods } from '../hooks/useFoods';
import { ProductCardProps } from 'types/ProductCard.types';
import { useSidebar } from '../contexts/SidebarContext';

const MenuPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { isExtended } = useSidebar();
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
    ? foods.docs.map((food) => ({
        id: food._id,
        name: food.name,
        slug: food.slug,
        price: food.discount_price || food.price,
        originalPrice: food.price,
        discount: food.discount_price
          ? `${Math.round((1 - food.discount_price / food.price) * 100)}% OFF`
          : undefined,
        imageUrl: food.images?.[0] || '',
        hoverImage: food.images?.[1] || '',
        description: food.description || '',
        cate: food.categories?.[0]?.Cate_name || 'Danh mục',
      }))
    : [];

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = event.target.value;
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("sort", sortValue);  
      return newParams;
    });
  }, [setSearchParams]);

  return (
    <section className="bg-bodyBackground w-full min-h-screen text-white">
      <div className="w-full mx-auto">
        <BreadCrumbComponents />
      </div>

      <div className="px-4 md:px-8 flex gap-8 py-10 w-full max-w-[1500px] mx-auto">
        <aside className="w-1/6 hidden lg:block">
          <FilterSidebar />
        </aside>

        <main className="flex-1 space-y-8">
          <div className="flex flex-wrap justify-end items-center gap-4">
            <div className="relative">
              <select className="appearance-none bg-bodyBackground border border-gray-500 text-white rounded px-2 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-secondaryColor"
                  onChange={handleSortChange}
              >
                <option value="relevance">Sắp xếp theo</option>
                <option value="priceLow">Giá thấp đến cao</option>
                <option value="priceHigh">Giá cao đến thấp</option>
                <option value="newest">Mới nhất</option>
                <option value="highestRated">Đánh giá cao nhất</option>
                <option value="mostViewed">Lượt xem nhiều nhất</option>
                <option value="mostOrdered">Đặt hàng nhiều nhất</option>
                <option value="mostFavorite">Được yêu thích nhất</option>
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

          <div className="pt-8">
            {/* <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            /> */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => {
                if (
                  !isNaN(newPage) &&
                  newPage >= 1 &&
                  newPage <= pagination.totalPages
                ) {
                  setSearchParams({
                    page: newPage.toString(),
                    sort: searchParams.get('sort') || 'default',
                  });
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: newPage,
                    prevPage: Math.max(newPage - 1, 1),
                    nextPage: Math.min(newPage + 1, pagination.totalPages),
                  }));
                }
              }}
            />
          </div>
        </main>
      </div>
    </section>
  );
};

export default MenuPage;
