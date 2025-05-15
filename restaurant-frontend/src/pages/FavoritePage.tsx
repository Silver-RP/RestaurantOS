import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteItemCard from '@/components/pages/favorite/FavoriteItemCard';
import Container from '@/components/common/Container';
import ButtonComponents from '@/components/common/ButtonComponents';
import BreadcrumbComponent from '@/components/common/BreadCrumbComponents';
import FavoriteSidebarFilter from '@/components/pages/favorite/FavoriteSidebarFilter';

const FavoritePage: React.FC = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([
    {
      _id: '1',
      name: 'Bò tết nướng',
      price: 250000,
      discountPrice: 300000,
      quantity: 1,
      category: 'Thịt',
      images: ['https://res.cloudinary.com/djtbi5avl/image/upload/v1745066025/dishes/orders/zc6ze3ukjoizlfy59c3g.png'],
    },
    {
      _id: '2',
      name: 'Dùi gà nướng',
      price: 350000,
      discountPrice: 300000,
      quantity: 2,
      category: 'Gà',
      images: ['https://res.cloudinary.com/djtbi5avl/image/upload/v1745066025/dishes/orders/zc6ze3ukjoizlfy59c3g.png'],
    },
    {
      _id: '2',
      name: 'Dùi gà nướng',
      price: 350000,
      discountPrice: 300000,
      quantity: 2,
      category: 'Gà',
      images: ['https://res.cloudinary.com/djtbi5avl/image/upload/v1745066025/dishes/orders/zc6ze3ukjoizlfy59c3g.png'],
    },
    {
      _id: '2',
      name: 'Dùi gà nướng',
      price: 350000,
      discountPrice: 300000,
      quantity: 2,
      category: 'Gà',
      images: ['https://res.cloudinary.com/djtbi5avl/image/upload/v1745066025/dishes/orders/zc6ze3ukjoizlfy59c3g.png'],
    },
    {
      _id: '2',
      name: 'Dùi gà nướng',
      price: 350000,
      discountPrice: 300000,
      quantity: 2,
      category: 'Gà',
      images: ['https://res.cloudinary.com/djtbi5avl/image/upload/v1745066025/dishes/orders/zc6ze3ukjoizlfy59c3g.png'],
    },
    {
      _id: '2',
      name: 'Dùi gà nướng',
      price: 350000,
      discountPrice: 300000,
      quantity: 2,
      category: 'Gà',
      images: ['https://res.cloudinary.com/djtbi5avl/image/upload/v1745066025/dishes/orders/zc6ze3ukjoizlfy59c3g.png'],
    },
    {
      _id: '2',
      name: 'Dùi gà nướng',
      price: 350000,
      discountPrice: 300000,
      quantity: 2,
      category: 'Gà',
      images: ['https://res.cloudinary.com/djtbi5avl/image/upload/v1745066025/dishes/orders/zc6ze3ukjoizlfy59c3g.png'],
    },
  ]);

  const [filterCategory] = useState<string | null>(null);

  const handleQuantityChange = (id: string, newQty: number) => {
    setFavorites((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item._id !== id));
  };

  const filteredFavorites = filterCategory
    ? favorites.filter((item) => item.category === filterCategory)
    : favorites;

  return (
    <>
      <BreadcrumbComponent />
      <Container>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {/* Sidebar filter */}
  <div className="lg:col-span-1 bg-primaryColor py-8 rounded">
    <FavoriteSidebarFilter />
  </div>

  {/* Main content */}
  <div className="lg:col-span-3 py-8 col-span-1">
    {filteredFavorites.length === 0 ? (
      <p>Bạn chưa có món nào yêu thích.</p>
    ) : (
      <>
        <div className="border border-secondaryColor p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {filteredFavorites.map((item) => (
    <FavoriteItemCard
      key={item._id}
      item={item}
      onQuantityChange={(qty) => handleQuantityChange(item._id, qty)}
      onRemove={() => handleRemove(item._id)}
      onAddToCart={() => {
        console.log('Add to cart:', item.name);
      }}
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
