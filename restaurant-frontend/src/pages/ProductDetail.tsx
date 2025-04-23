import React from 'react';
import { useParams } from 'react-router-dom';
import { useFoodDetail } from '../hooks/useFoods';
import RelatedProductList from '../components/pages/detail/RelatedProductList';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import ProductGallery from '../components/pages/detail/ProductGallery';
import ProductInfo from '../components/pages/detail/ProductInfo';
import ProductPolicies from '../components/pages/detail/ProductPolicies';
import ProductTabs from '../components/pages/detail/ProductTabs';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { food, loading, error } = useFoodDetail(slug || '');

  const sampleRelatedProducts = [
    {
      id: '1',
      name: 'Sản phẩm A',
      imageUrl: '/assets/images/products/SP2.jpg',
      hoverImage: '/assets/images/products/SP2.1.jpg',
      cate: 'Danh mục A',
      price: 299000,
      originalPrice: 399000,
      discount: '25%',
      isNew: true,
      description: 'Mô tả ngắn gọn cho sản phẩm A',
    },
    {
      id: '2',
      name: 'Sản phẩm B',
      imageUrl: '/assets/images/products/SP3.jpg',
      hoverImage: '/assets/images/products/SP3.1.jpg',
      cate: 'Danh mục B',
      price: 159000,
      originalPrice: 199000,
      discount: '20%',
      description: 'Mô tả ngắn gọn cho sản phẩm BB',
    },
    {
      id: '3',
      name: 'Sản phẩm C',
      imageUrl: '/assets/images/products/SP4.jpg',
      hoverImage: '/assets/images/products/SP4.1.jpg',
      cate: 'Danh mục C',
      price: 499000,
      originalPrice: 599000,
      discount: '17%',
      isNew: true,
      description: 'Mô tả ngắn gọn cho sản phẩm CC',
    },
    {
      id: '4',
      name: 'Sản phẩm D',
      imageUrl: '/assets/images/products/SP5.jpg',
      hoverImage: '/assets/images/products/SP5.1.jpg',
      cate: 'Danh mục D',
      price: 189000,
      originalPrice: 229000,
      description: 'Mô tả ngắn gọn cho sản phẩm D',
    },
  ];

  const tabs = [
    {
      id: 'description',
      title: 'Mô tả',
      content:
        'Biểu tượng của sự nhẹ nhàng và tinh tế, chim ruồi gợi lên sự tò mò và niềm vui. Bộ sưu tập Studio Design PolyFaune có các sản phẩm cổ điển với họa tiết đầy màu sắc, lấy cảm hứng từ nghệ thuật xếp giấy origami truyền thống của Nhật Bản.',
    },
    {
      id: 'details',
      title: 'Chi tiết sản phẩm',
      content:
        'Chất liệu: 100% Cotton. Kiểu dáng: Regular. Giặt lạnh. Sản xuất tại Nhật Bản.',
    },
    {
      id: 'reviews',
      title: 'Đánh giá',
      content:
        'Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!',
    },
  ];

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

          <ProductTabs tabs={tabs} />

          <RelatedProductList products={sampleRelatedProducts} />
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
