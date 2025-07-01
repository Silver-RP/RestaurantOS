import React from 'react';
import ProductCardGrid from '../../common/ProductCardGrid';
import ProductCardList from '../../common/ProductCardList';
import { ProductCardProps } from 'types/ProductCard.types';

interface ProductGridProps {
  viewMode: "grid" | "list";
  products: ProductCardProps[]; 
  isSidebarExtended: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ viewMode, products }) => {
  
  return (
    <div
      className={`grid ${
        viewMode === 'grid'
          ? 'grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'
          : 'grid-cols-1 md:grid-cols-2 gap-6'
      }`}
    >
      {products.map((product) =>
        viewMode === "grid" ? (
          <ProductCardGrid
            key={product.id}
            {...product}
          />
        ) : (
          <ProductCardList
            key={product.id}
            {...product}
          />
        )
      )}
    </div>
  );
};

export default ProductGrid;