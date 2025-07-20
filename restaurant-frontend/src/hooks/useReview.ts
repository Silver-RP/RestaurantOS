/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  createReviewApi,
  fetchReviewsApi,
  updateReviewApi,
  deleteReviewApi,
  toggleReviewVisibilityApi,
  ReviewPayload,
  UpdateReviewPayload,
  FetchReviewsParams,
} from '@/api/ReviewApi';
import { IReview } from '@/types/Review.types';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';

export const useReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const createReview = async (data: ReviewPayload): Promise<IReview | null> => {
    const userInfo = Cookie.get('userInfo');
    if (!userInfo) {
      toast.error('Vui lòng đăng nhập để gửi đánh giá');
      return null;
    }

    try {
      setLoading(true);
      const review = await createReviewApi(data);
      toast.success('Đánh giá đã được gửi thành công');
      return review;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tạo đánh giá';
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (params: FetchReviewsParams) => {
    try {
      setLoading(true);
      const result = await fetchReviewsApi(params);
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tải đánh giá';
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (
    reviewId: string,
    data: UpdateReviewPayload,
  ): Promise<IReview | null> => {
    try {
      setLoading(true);
      const updated = await updateReviewApi(reviewId, data);
      toast.success('Đánh giá đã được cập nhật');
      return updated;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Lỗi khi cập nhật đánh giá');
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    try {
      setLoading(true);
      await deleteReviewApi(reviewId);
      toast.success('Đánh giá đã được xoá');
      return true;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Lỗi khi xoá đánh giá');
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (reviewId: string): Promise<IReview | null> => {
    try {
      setLoading(true);
      const updated = await toggleReviewVisibilityApi(reviewId);
      toast.success(`Đánh giá đã được ${updated.isHidden ? 'ẩn' : 'hiện'}`);
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi ẩn/hiện đánh giá';
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    createReview,
    fetchReviews,
    updateReview,
    deleteReview,
    toggleVisibility,
  };
};