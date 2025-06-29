/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import FavoriteItemCard from '@/components/pages/favorite/FavoriteItemCard';
import Container from '@/components/common/Container';
import ButtonComponents from '@/components/common/ButtonComponents';
import BreadcrumbComponent from '@/components/common/BreadCrumbComponents';
import { useFavorites } from '@/hooks/useFavorites';
import { useFetchFavorites } from '@/hooks/useFetchFavorites';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { useCategories } from '@/hooks/useCategories';
import { Listbox } from '@headlessui/react';
import { FaHeartCirclePlus } from 'react-icons/fa6';
import OrderOnlineSection from '@/components/pages/homepage/OrderOnline';

const FavoritePage: React.FC = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { fetchFavorites, loading, error } = useFetchFavorites();
  const { removeFromFavorites } = useFavorites();
  const favorites = useSelector((state: RootState) => state.favorite.items);
  const { categories } = useCategories();

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleRemove = async (id: string) => {
    await removeFromFavorites(id);
  };

  const filteredFavorites = favorites.filter((item) => {
    const matchCategory =
      !filterCategory ||
      (Array.isArray(item.dishId?.categories) &&
        item.dishId.categories.some(
          (cat: any) =>
            typeof cat === 'object' && cat.Cate_name === filterCategory,
        ));

    const matchSearch = item.dishId?.name
      ?.toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <>
      <BreadcrumbComponent />
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center justify-start items-start sm:justify-between gap-4 pt-5 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[512px]">
            {/* Dropdown */}
            <Listbox value={filterCategory || ''} onChange={setFilterCategory}>
              <div className="relative w-full">
                <Listbox.Button className="w-full bg-bodyBackground border border-gray-500 text-white px-4 py-2 rounded text-sm flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-secondaryColor">
                  <span>
                    {filterCategory
                      ? categories?.data?.find(
                          (c) => c.Cate_name === filterCategory,
                        )?.Cate_name
                      : 'Tất cả danh mục'}
                  </span>
                  <FiChevronDown className="w-4 h-4 text-secondaryColor" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full bg-bodyBackground border border-gray-600 rounded shadow-lg z-10 max-h-60 overflow-auto text-sm text-white">
                  <Listbox.Option
                    value=""
                    className={({ active }) =>
                      `cursor-pointer px-4 py-2 ${
                        active
                          ? 'bg-secondaryColor text-black'
                          : 'hover:bg-gray-700'
                      }`
                    }
                  >
                    Tất cả danh mục
                  </Listbox.Option>
                  {categories?.data?.map((cat) => (
                    <Listbox.Option
                      key={cat._id}
                      value={cat.Cate_name}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 ${
                          active
                            ? 'bg-secondaryColor text-black'
                            : 'hover:bg-gray-700'
                        }`
                      }
                    >
                      {cat.Cate_name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            {/* Search input */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm món yêu thích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border border-gray-500 rounded w-full px-3 py-2 text-sm text-white pr-10 focus:outline-none focus:ring-1 focus:ring-secondaryColor"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondaryColor w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-5 col-span-1 py-4">
            {loading ? (
              <p>Đang tải danh sách yêu thích...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : !Array.isArray(filteredFavorites) ||
              filteredFavorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/80 text-center">
                <FaHeartCirclePlus className="w-40 h-40" />
                <h2 className="text-2xl font-light mb-2">
                  Danh sách yêu thích đang trống
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Hãy khám phá thực đơn và thêm những món ăn bạn yêu thích vào
                  đây nhé!
                </p>
                <ButtonComponents
                  variant="filled"
                  size="medium"
                  onClick={() => navigate('/menu?sort=categoryAZ')}
                  className="px-6 py-2"
                >
                  Khám phá thực đơn
                </ButtonComponents>
              </div>
            ) : (
              <>
                <div className="border border-secondaryColor px-0 py-4 sm:p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-150px)] scrollbar-custom overflow-y-auto">
                    {filteredFavorites.map((item) => (
                      <FavoriteItemCard
                        key={item._id}
                        item={item}
                        onRemove={() => handleRemove(item._id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <ButtonComponents
                    variant="filled"
                    size="medium"
                    onClick={() => navigate('/menu?sort=categoryAZ')}
                    className="px-4 py-2"
                  >
                    Tiếp tục mua hàng
                  </ButtonComponents>
                </div>
              </>
            )}
          </div>
        </div>
    
      </Container>
      <OrderOnlineSection/>
    </>
  );
};

export default FavoritePage;
