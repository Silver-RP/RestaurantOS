/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteItemCard from '@/components/pages/favorite/FavoriteItemCard';
import Container from '@/components/common/Container';
import ButtonComponents from '@/components/common/ButtonComponents';
import BreadcrumbComponent from '@/components/common/BreadCrumbComponents';
import FavoriteSidebarFilter from '@/components/pages/favorite/FavoriteSidebarFilter';
import { useFavorites } from '@/hooks/useFavorites';
import { useFetchFavorites } from '@/hooks/useFetchFavorites';

const FavoritePage: React.FC = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const {
    favorites,
    setFavorites,
    loading,
    error,
    fetchFavorites,
  } = useFetchFavorites();

  const { removeFromFavorites } = useFavorites();

  // Gọi fetchFavorites khi vào trang
  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (id: string) => {
    await removeFromFavorites(id);
    setFavorites((prev) => prev.filter((item) => item._id !== id));
  };

  const filteredFavorites = filterCategory
    ? favorites.filter((item) =>
        Array.isArray(item.dishId?.categories) &&
        item.dishId.categories.some(
          (cat: any) =>
            typeof cat === 'object' && cat.Cate_name === filterCategory
        )
      )
    : favorites;

  return (
    <>
      <BreadcrumbComponent />
      <Container>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {/* Sidebar filter */}
  <div className="lg:col-span-1 bg-primaryColor py-8 rounded">
    <FavoriteSidebarFilter onSelectCategory={setFilterCategory} />
  </div>

  {/* Main content */}
  <div className="lg:col-span-3 col-span-1 py-4">
      {loading ? (
        <p>Đang tải danh sách yêu thích...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredFavorites.length === 0 ? (
        <p>Bạn chưa có món nào yêu thích.</p>
      ) : (
        <>
          <div className="border border-secondaryColor p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-350px)] scrollbar-custom  overflow-y-auto">
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
              onClick={() => navigate('/menu')}
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
    </>
  );
};

export default FavoritePage;