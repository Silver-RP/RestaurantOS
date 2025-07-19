import React from 'react';
import { useParams } from 'react-router-dom';
import { useFoodDetail } from '../hooks/useFoods';
import { useProductView } from '../hooks/useProductView';
import RelatedProductList from '../components/pages/detail/RelatedProductList';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import ProductGallery from '../components/pages/detail/ProductGallery';
import ProductInfo from '../components/pages/detail/ProductInfo';
import ProductPolicies from '../components/pages/detail/ProductPolicies';
import ProductTabs from '../components/pages/detail/ProductTabs';
import ProductReviews from '..//components/pages/detail/ProductReviews';
import { useLocation } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { food, loading, error } = useFoodDetail(slug || '');
  const productId = food?._id || '';

  const shouldOpenReviewTab = location.state?.openReview === true;

  useProductView(productId);

 

   const tabs = food ? [
    {
      id: 'description',
      title: 'Mô tả',
      content: food.description || 'Chưa có mô tả cho sản phẩm này.',
    },
    {
      id: 'details',
      title: 'Chi tiết sản phẩm',
      content: food.ingredients 
  ? `Nguyên liệu: ${food.ingredients}` 
  : 'Chưa có thông tin chi tiết cho sản phẩm này.',
    },
    {
      id: 'reviews',
      title: 'Đánh giá',
      content: (
        <ProductReviews
          productId={food._id}
          productName={food.name}
          averageRating={food.average_rating || 0}
          ratingCount={food.rating_count || 0}
          scrollToForm={shouldOpenReviewTab}
        />
      ),
    },
  ] : [];

  if (loading) {
    return (
      <div className="text-center text-white py-20">Đang tải sản phẩm...</div>
    );
  }

  if (error || !food) {
    return (
      <div className="text-center text-red-500 py-20">
        {error || 'Không tìm thấy sản phẩm'}
      </div>
    );
  }

  return (
    <>
      <BreadCrumbComponents />
      <section className="bg-bodyBackground w-full text-white py-16">
        <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-7/12">
              <ProductGallery
                mainImage={food.images?.[0] || '/assets/images/default.jpg'}
                thumbnails={food.images || []}
                discount={
                  food.discount_price
                    ? Math.round(
                        ((food.price - food.discount_price) / food.price) * 100,
                      )
                    : 0
                }
                isNew={false}
              />
            </div>
            <div className="w-full lg:w-5/12">
              <ProductInfo
                id={food._id}
                name={food.name}
                price={food.discount_price || food.price}
                originalPrice={food.price}
                discount={
                  food.discount_price
                    ? Math.round(
                        ((food.price - food.discount_price) / food.price) * 100,
                      )
                    : 0
                }
                rating={food.average_rating || 0}
                reviews={food.rating_count || 0}
                description={food.description}
                brand="Beef Beef Restaurant"
                categories={food.categories.map((c) =>
                  typeof c === 'object' ? c.Cate_name : '',
                )}
                sku={food._id}
              />
              <div className="mt-8 hidden 2xl:block">
                <ProductPolicies />
              </div>
            </div>
          </div>

          {/* <ProductTabs tabs={tabs} /> */}
          <ProductTabs tabs={tabs} defaultOpenTab={shouldOpenReviewTab ? 'reviews' : null} />

          <RelatedProductList
            categories={food.categories.map((c) =>
              typeof c === 'object' ? c._id : '',
            )}
          />
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
