import React, { useState, useEffect } from 'react';
import { FaStar, FaUser, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';

// Types for our review system
interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
  averageRating: number;
  ratingCount: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName,
  averageRating,
  ratingCount,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [filter, setFilter] = useState<number | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage: number = 4;

  // Fetch reviews (replace with actual API call)
  useEffect(() => {
    // Mock data for demo purposes
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: 'user123',
        userName: 'Minh Tuấn',
        rating: 5,
        comment: 'Mì Spaghetti rất ngon, sợi mì dai và đậm đà. Dầu truffle tạo hương vị đặc biệt, rất thơm. Phần ăn đủ cho một người. Sẽ đặt lại!',
        date: '2025-04-30',
        isVerifiedPurchase: true,
      },
      {
        id: '2',
        userId: 'user456',
        userName: 'Thanh Hà',
        rating: 4,
        comment: 'Hương vị rất tốt, tuy nhiên phần ăn hơi nhỏ so với giá tiền. Dầu truffle thơm nhưng có thể thêm nhiều hơn.',
        date: '2025-04-25',
        isVerifiedPurchase: true,
      },
      {
        id: '3',
        userId: 'user789',
        userName: 'Anh Dũng',
        rating: 3,
        comment: 'Món ăn khá ổn nhưng không đặc biệt như mong đợi. Giá hơi cao cho chất lượng này.',
        date: '2025-04-20',
        isVerifiedPurchase: false,
      },
      {
        id: '4',
        userId: 'user101',
        userName: 'Mai Phương',
        rating: 5,
        comment: 'Spaghetti tuyệt vời! Tỏi và ớt hòa quyện tạo vị đặc trưng. Dầu truffle là điểm nhấn hoàn hảo. Đáng từng đồng bỏ ra!',
        date: '2025-04-15',
        isVerifiedPurchase: true,
      },
      {
        id: '5',
        userId: 'user102',
        userName: 'Trung Kiên',
        rating: 4,
        comment: 'Sản phẩm chất lượng, giao hàng nhanh. Sẽ tiếp tục ủng hộ!',
        date: '2025-04-10',
        isVerifiedPurchase: true,
      },
      {
        id: '6',
        userId: 'user103',
        userName: 'Thu Trang',
        rating: 5,
        comment: 'Đồ ăn rất ngon, đóng gói cẩn thận. Shipper thân thiện.',
        date: '2025-04-05',
        isVerifiedPurchase: true,
      },
      {
        id: '7',
        userId: 'user104',
        userName: 'Văn Hùng',
        rating: 3,
        comment: 'Món ăn bình thường, không có gì đặc sắc. Đóng gói tốt.',
        date: '2025-04-01',
        isVerifiedPurchase: false,
      },
    ];
    
    setReviews(mockReviews);
  }, [productId]);

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[5 - review.rating] += 1;
      }
    });
    
    return distribution;
  };

  const distribution = getRatingDistribution();

  // Filter reviews by rating
  const filteredReviews = filter 
    ? reviews.filter(review => review.rating === filter) 
    : reviews;

  // Calculate pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  // Handle page change
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle rating click
  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
  };

  // Handle submit review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userRating) {
      setSubmissionError('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    if (!comment.trim()) {
      setSubmissionError('Vui lòng nhập nội dung đánh giá');
      return;
    }
    
    if (!userName.trim()) {
      setSubmissionError('Vui lòng nhập tên của bạn');
      return;
    }
    
    setIsSubmitting(true);
    
    // Mock API call - replace with actual API
    setTimeout(() => {
      const newReview: Review = {
        id: `temp-${Date.now()}`,
        userId: `temp-user-${Date.now()}`,
        userName: userName,
        rating: userRating,
        comment: comment,
        date: new Date().toISOString().split('T')[0],
        isVerifiedPurchase: false,
      };
      
      // Add new review to the top
      setReviews([newReview, ...reviews]);
      
      // Reset form
      setUserRating(0);
      setComment('');
      setUserName('');
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setSubmissionError(null);
      
      // Reset to first page to show the new review
      setCurrentPage(1);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmissionSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="text-white">
      {/* Review Summary */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center md:justify-start my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar 
                  key={star} 
                  className={`${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-500'} text-xl`} 
                />
              ))}
            </div>
            <div className="text-sm text-gray-300">{ratingCount} đánh giá</div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <div className="w-8 text-sm">{star} sao</div>
                <div className="flex-grow mx-2 bg-gray-700 h-2 rounded-full">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ 
                      width: `${reviews.length ? (distribution[5-star] / reviews.length) * 100 : 0}%` 
                    }} 
                  />
                </div>
                <div className="w-8 text-sm text-right">
                  {distribution[5-star]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <div className="text-sm mb-2">Lọc theo số sao:</div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter(null)}
            className={`px-3 py-1 rounded-full text-sm ${filter === null ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
          >
            Tất cả
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button 
              key={star}
              onClick={() => setFilter(star)}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${filter === star ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
            >
              {star} <FaStar className="text-xs" />
              <span className="ml-1">({distribution[5-star]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Write Review Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Viết đánh giá</h3>
        
        {submissionSuccess && (
          <div className="bg-green-800 text-green-100 p-3 rounded mb-4">
            Cảm ơn bạn đã gửi đánh giá! Đánh giá của bạn đã được thêm vào.
          </div>
        )}
        
        {submissionError && (
          <div className="bg-red-800 text-red-100 p-3 rounded mb-4">
            {submissionError}
          </div>
        )}
        
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="block mb-2 text-sm">Đánh giá của bạn về {productName}</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-2xl cursor-pointer mr-1 ${
                    (hoverRating || userRating) >= star ? 'text-yellow-400' : 'text-gray-500'
                  }`}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-sm">Tên của bạn</label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-yellow-500"
              placeholder="Nhập tên của bạn"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block mb-2 text-sm">Nội dung đánh giá</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-yellow-500 min-h-32"
              placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border bg-secondaryColor text-black hover:text-white hover:border-secondaryColor hover:bg-bodyBackground transition ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {filteredReviews.length > 0 
            ? `${filteredReviews.length} đánh giá` 
            : 'Chưa có đánh giá nào'}
        </h3>
        
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Chưa có đánh giá nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-700 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <FaUser className="text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="flex items-center">
                          {review.isVerifiedPurchase && (
                            <span className="flex items-center text-green-400 text-xs mr-3">
                              <FaCheck className="mr-1" /> Đã mua hàng
                            </span>
                          )}
                          <span className="flex items-center text-gray-400 text-xs">
                            <BiTime className="mr-1" /> {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`${
                            star <= review.rating ? 'text-yellow-400' : 'text-gray-500'
                          } text-sm`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-gray-300">{review.comment}</div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-full mr-2 ${
                      currentPage === 1 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 ${
                        currentPage === number
                          ? 'bg-secondaryColor text-black'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ml-2 ${
                      currentPage === totalPages
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;