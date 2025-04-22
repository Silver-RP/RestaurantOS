import RelatedProductList from '../components/pages/detail/RelatedProductList';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import ProductGallery from '../components/pages/detail/ProductGallery';
import ProductInfo from '../components/pages/detail/ProductInfo';
import ProductPolicies from '../components/pages/detail/ProductPolicies';
import ProductTabs from '../components/pages/detail/ProductTabs';
import React from 'react';

const ProductDetail: React.FC = () => {
  const mainImage = '/assets/images/products/SP1.jpg';
  const thumbnails = [
    '/assets/images/products/SP1.jpg',
    '/assets/images/products/SP2.jpg',
    '/assets/images/products/SP3.jpg',
    '/assets/images/products/SP4.jpg',
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

  return (
    <>
      <BreadCrumbComponents></BreadCrumbComponents>
      <section className="bg-bodyBackground w-full text-white py-16">
        <div className="w-11/12 md:w-container95 lg:w-mainContainer xl:w-container95 2xl:w-mainContainer mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Bộ sưu tập sản phẩm */}
            <ProductGallery
              mainImage={mainImage}
              thumbnails={thumbnails}
              discount={20}
              isNew={true}
            />

            {/* Thông tin sản phẩm và chính sách */}
            <div className="w-full lg:w-1/2">
              <ProductInfo
                name="Mì Ý Spaghetti"
                price={19.12}
                originalPrice={23.9}
                discount={20}
                rating={4.5}
                reviews={85}
                description="Form rộng, cổ tròn, tay ngắn. Làm từ cotton pima sợi dài cao cấp."
                brand="Thiết Kế Studio"
                categories={['Trang chủ', 'Ưu đãi đặc biệt', 'Món tráng miệng']}
                sku="demo_1"
              />
              <div className="mt-8">
                <ProductPolicies />
              </div>
            </div>
          </div>

          {/* Tab thông tin bổ sung */}
          <ProductTabs tabs={tabs} />

        <RelatedProductList products={sampleRelatedProducts} />

        </div>
      </section>
    </>
  );
};

export default ProductDetail;
