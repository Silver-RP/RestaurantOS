/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { FaUser, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { EmptyStar, FilledStar, HalfStar } from '@/components/common/StarIcons';
import { useReview } from '@/hooks/useReview';
import { IReview } from '@/types/Review.types';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRef } from 'react';
interface ProductReviewsProps {
  productId: string;
  productName: string;
  averageRating: number;
  ratingCount: number;
  scrollToForm?: boolean;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName,
  scrollToForm,
}) => {
  const { createReview, fetchReviews, updateReview, deleteReview, loading } =
    useReview();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [filter, setFilter] = useState<number | null>(null);
  const currentUserId = useSelector((state: RootState) => state.user.user?._id);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const reviewsPerPage: number = 4;
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = reviews.length ? totalRating / reviews.length : 0;
  const ratingCount = reviews.length;
  const [editingReview, setEditingReview] = useState<IReview | null>(null);

  const reviewFormRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadReviews = async () => {
      const result = await fetchReviews({
        productId,
        page: currentPage,
        limit: reviewsPerPage,
        filter: filter || undefined,
      });

      if (result) {
        setReviews(result.docs);
        setTotalPages(result.totalPages);
      }
    };

    loadReviews();
  }, [productId, currentPage, filter]);

  useEffect(() => {
    if (scrollToForm && reviewFormRef.current) {
      reviewFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [scrollToForm]);

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[5 - review.rating] += 1;
      }
    });

    return distribution;
  };

  const distribution = getRatingDistribution();

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleEditReview = (review: IReview) => {
    setEditingReview(review);
    setUserRating(review.rating);
    setComment(review.comment);
    reviewFormRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirm = window.confirm(
      'Bạn có chắc chắn muốn xoá đánh giá này không?',
    );
    if (!confirm) return;
    const success = await deleteReview(reviewId);
    if (success) {
      await reloadReviews(currentPage);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userRating) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingReview) {
        // Gọi API update
        const updated = await updateReview(editingReview._id, {
          rating: userRating,
          comment: comment.trim(),
        });
        if (updated) {
          setEditingReview(null);
          setUserRating(0);
          setComment('');
          setCurrentPage(1);
          await reloadReviews(1);
        }
      } else {
        // Gọi API tạo mới
        const newReview = await createReview({
          productId,
          rating: userRating,
          comment: comment.trim(),
        });
        if (newReview) {
          setUserRating(0);
          setComment('');
          setCurrentPage(1);
          await reloadReviews(1);
        }
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || '...';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reloadReviews = async (page: number) => {
    const result = await fetchReviews({
      productId,
      page,
      limit: reviewsPerPage,
      filter: filter || undefined,
    });

    if (result) {
      setReviews(result.docs);
      setTotalPages(result.totalPages);
    }
  };

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
              {[1, 2, 3, 4, 5].map((i) => {
                const full = i <= Math.floor(averageRating);
                const half =
                  i === Math.ceil(averageRating) &&
                  !Number.isInteger(averageRating);
                return full ? (
                  <FilledStar key={i} />
                ) : half ? (
                  <HalfStar key={i} />
                ) : (
                  <EmptyStar key={i} />
                );
              })}
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
                      width: `${reviews.length ? (distribution[5 - star] / reviews.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="w-8 text-sm text-right">
                  {distribution[5 - star]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm mb-2">Lọc theo số sao:</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter(null)}
            className={`px-3 py-1 rounded-full text-sm ${filter === null ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}
          >
            Tất cả
          </button>

          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setFilter(star)}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                filter === star
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <span className="inline-block">{star}</span>
              <span className="inline-flex items-center justify-center w-4 h-4">
                <FilledStar />
              </span>
              <span className="ml-1 inline-block">
                ({distribution[5 - star]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Write Review Form */}
      <div
        ref={reviewFormRef}
        className="bg-headerBackground p-6 rounded-lg mb-8 shadow-lg border border-[#334155]"
      >
        <h3 className="text-xl mb-4">
          {editingReview ? 'Cập nhật đánh giá' : 'Viết đánh giá'}
        </h3>

        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="block mb-2 text-sm">
              Đánh giá của bạn về {productName}
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = (hoverRating || userRating) >= star;
                return (
                  <span
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer mr-1"
                  >
                    {isActive ? <FilledStar /> : <EmptyStar />}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block mb-2 text-sm">
              Nội dung đánh giá
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 rounded bg-bodyBackground border border-[#475569] focus:outline-none transition duration-200 ease-in-out focus:border-secondaryColor min-h-32"
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
            {isSubmitting
              ? editingReview
                ? 'Đang cập nhật...'
                : 'Đang gửi...'
              : editingReview
                ? 'Cập nhật'
                : 'Gửi đánh giá'}
          </button>
          {editingReview && (
            <button
              type="button"
              className="ml-2 px-4 py-2 border bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => {
                setEditingReview(null);
                setUserRating(0);
                setComment('');
                toast.info('Đã huỷ chỉnh sửa đánh giá');
              }}
            >
              Huỷ sửa
            </button>
          )}
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-sans mb-4">
          {reviews.length > 0
            ? `${reviews.length} đánh giá`
            : 'Chưa có đánh giá nào'}
        </h3>

        {loading ? (
          <div className="text-center py-8 text-gray-400">
            Đang tải đánh giá...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Chưa có đánh giá nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-700 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <FaUser className="text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {review.userId?.username || 'Người dùng'}
                        </div>
                        <div className="flex items-center">
                          {review.isVerifiedPurchase && (
                            <span className="flex items-center text-green-400 text-xs mr-3">
                              <FaCheck className="mr-1" /> Đã mua hàng
                            </span>
                          )}
                          <span className="flex items-center text-gray-400 text-xs">
                            <BiTime className="mr-1" />
                            {new Date(review.createdAt || '').toLocaleString(
                              'vi-VN',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="mr-1 w-4 h-4">
                          {star <= review.rating ? (
                            <FilledStar />
                          ) : (
                            <EmptyStar />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-gray-300">{review.comment}</div>

                  {review.userId?._id === currentUserId && (
                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleEditReview(review)}
                      >
                        Sửa
                      </button>
                      <button
                        className="text-xs px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Xoá
                      </button>
                    </div>
                  )}
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

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
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
                    ),
                  )}

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
