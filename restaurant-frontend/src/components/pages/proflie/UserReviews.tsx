import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReview } from '@/hooks/useReview';
import { IReview } from '@/types/Review.types';
import {
  FaStar,
  FaHeadset,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Container from '@/components/common/Container';
import ProfileSidebar from './ProfileSidebar';

const UserReviews: React.FC = () => {
  const navigate = useNavigate();
  const { getUserReviews, loading } = useReview();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    loadUserReviews();
  }, [currentPage]);

  const loadUserReviews = async () => {
    try {
      // Lấy tất cả đánh giá của user hiện tại
      const result = await getUserReviews({
        page: currentPage,
        limit: reviewsPerPage,
      });

      if (result) {
        setReviews(result.docs);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Error loading user reviews:', error);
      toast.error('Không thể tải danh sách đánh giá');
    }
  };

  const handleContactSupport = () => {
    navigate('/contact');
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="flex flex-col bg-bodyBackground text-white font-sans">
      <Container className="flex gap-6 sm:py-10">
        <div className="w-1/3 hidden md:block">
          <ProfileSidebar />
        </div>
        <div className="flex-1 w-2/3 bg-bodyBackground p-10 border border-[#FFE0A0]">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin text-white">
              Đánh giá và phản hồi
            </h1>
          </div>

          {/* Thông báo hỗ trợ */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <FaHeadset className="text-blue-400 text-xl" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-300 mb-1">
                  Cần hỗ trợ?
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Nếu bạn có bất kỳ ý kiến nào hoặc cần hỗ trợ, vui lòng liên hệ
                  với chúng tôi.
                </p>
                <button
                  onClick={handleContactSupport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>

          {/* Danh sách đánh giá */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Đánh giá của bạn ({reviews.length})
            </h2>

            {loading ? (
              <div className="text-center py-8 text-gray-400">
                Đang tải đánh giá...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg mb-2">Bạn chưa có đánh giá nào</p>
                <p className="text-sm">
                  Hãy đặt hàng và thưởng thức món ăn để để lại đánh giá nhé!
                </p>
              </div>
            ) : (
              <>
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-[#FFE0A0] rounded-lg p-6 hover:bg-[#FFE0A0]/5 transition-colors cursor-pointer"
                    onClick={() => {
                      if (
                        review.productId &&
                        typeof review.productId === 'object' &&
                        review.productId.slug
                      ) {
                        navigate(`/foods/${review.productId.slug}?review=true`);
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Hình ảnh sản phẩm */}
                      {review.productId &&
                        typeof review.productId === 'object' &&
                        review.productId.images &&
                        review.productId.images[0] && (
                          <img
                            src={review.productId.images[0]}
                            alt={review.productId.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.jpg';
                            }}
                          />
                        )}

                      <div className="flex-1 min-w-0">
                        {/* Tên sản phẩm */}
                        {review.productId &&
                          typeof review.productId === 'object' && (
                            <h4 className="font-semibold text-white mb-2 hover:text-[#FFE0A0] transition-colors">
                              {review.productId.name || 'Sản phẩm'}
                            </h4>
                          )}

                        {/* Đánh giá sao và ngày */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-400">
                            {new Date(
                              review.createdAt || '',
                            ).toLocaleDateString('vi-VN')}
                          </span>
                          {review.isVerifiedPurchase && (
                            <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Đã mua hàng
                            </span>
                          )}
                        </div>

                        {/* Nội dung đánh giá */}
                        <p className="text-gray-300 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded ${
                          currentPage === 1
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        <FaChevronLeft />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`px-3 py-2 rounded ${
                              currentPage === page
                                ? 'bg-[#FFE0A0] text-black'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded ${
                          currentPage === totalPages
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UserReviews;
