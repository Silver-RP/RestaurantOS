import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeQuickView } from '../../../redux/feature/quickView/quickViewSlice';
import { RootState } from 'redux/store';

const QuickViewModal = () => {
  const dispatch = useDispatch();
  const product = useSelector((state: RootState) => state.quickView.selectedProduct);

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4">
      <div className="bg-bodyBackground rounded-lg overflow-hidden max-w-5xl w-full relative flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={() => dispatch(closeQuickView())}
          className="absolute top-4 right-4 text-white hover:text-secondaryColor text-2xl z-10"
        >
          &times;
        </button>

        {/* Image */}
        <div className="w-full md:w-1/2 bg-black">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Product info */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center space-y-4">
          <h2 className="text-3xl font-bold text-white">{product.name}</h2>

          {/* Rating + số lượng đánh giá */}
          <div className="flex items-center gap-2 text-secondaryColor text-sm">
            {'★'.repeat(Math.round(product.average_rating || 0))}
            {'☆'.repeat(5 - Math.round(product.average_rating || 0))}
            <span className="text-gray-400 text-xs">
              ({product.rating_count || 0} đánh giá)
            </span>
          </div>

          {/* Giá */}
          <div className="text-2xl font-bold text-secondaryColor">
            {product.discount_price
              ? `${product.discount_price.toLocaleString()} VND`
              : `${product.price.toLocaleString()} VND`}
          </div>

          {/* Mô tả */}
          <p className="text-gray-400 text-sm leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Nút hành động */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button className="flex-1 bg-secondaryColor hover:bg-yellow-400 text-black font-bold py-2 rounded">
              Thêm vào giỏ
            </button>
            <button className="text-sm text-white underline hover:text-secondaryColor">
              Yêu thích
            </button>
            <button className="text-sm text-white underline hover:text-secondaryColor">
              So sánh
            </button>
          </div>

          {/* Thông tin phụ */}
          <div className="text-xs text-gray-400 mt-6 space-y-1">
            <div>
              <strong>Danh mục: </strong>
              {product.categories.map((cat) => cat.Cate_name).join(', ')}
            </div>
            <div>
              <strong>Lượt xem: </strong>
              {product.views || 0}
            </div>
            <div>
              <strong>Lượt mua: </strong>
              {product.ordered_count || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;