
import ProductCardGrid from '../../common/ProductCardGrid';
import React from 'react';
import ProductCardList from '../../common/ProductCardList';

const dummyProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Sản phẩm ${i + 1}`,
  price: 500000,
  discount: '20% OFF',
  imageUrl: '/assets/images/products/SP1.jpg',
  hoverImage: '/assets/images/products/SP1.1.jpg',
}));

interface ProductGridProps {
  viewMode: "grid" | "list";
}

const ProductGrid: React.FC<ProductGridProps> = ({ viewMode }) => {
  return (
    <div
    className={`grid ${
      viewMode === 'grid'
        ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'grid-cols-1 md:grid-cols-2 gap-6'
    }`}
  >
    {dummyProducts.map((product) =>
      viewMode === "grid" ? (
        <ProductCardGrid
                description={''} key={product.id}
                {...product}       
        />
      ) : (
        <ProductCardList
          key={product.id}
          {...product}
          description="Mô tả sản phẩm"
        />
      )
    )}
  </div>
  );
};

export default ProductGrid;