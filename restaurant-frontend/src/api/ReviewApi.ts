/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './axiosInstance';
import { IReview } from '../types/Review.types';

export interface ReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  comment?: string;
  rating?: number;
}

export interface FetchReviewsParams {
  productId: string;
  page?: number;
  limit?: number;
  filter?: number;
}

export const createReviewApi = async (data: ReviewPayload): Promise<IReview> => {
    try {
      const res = await api.post<{ data: IReview }>('/review', data);
      return res.data.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Lỗi khi thêm đánh giá';
      throw new Error(message);
    }
  };

export const fetchReviewsApi = async (params: FetchReviewsParams): Promise<{
  docs: IReview[];
  totalDocs: number;
  page: number;
  totalPages: number;
}> => {
  const res = await api.get<{ data: {
    docs: IReview[];
    totalDocs: number;
    page: number;
    totalPages: number;
  } }>('/review', { params });
  return res.data.data;
};

export const updateReviewApi = async (
  reviewId: string,
  data: UpdateReviewPayload,
): Promise<IReview> => {
  const res = await api.put<{ data: IReview }>(`/review/${reviewId}`, data);
  return res.data.data;
};

export const toggleReviewVisibilityApi = async (
  reviewId: string,
): Promise<IReview> => {
  const res = await api.patch<{ data: IReview }>(`/review/${reviewId}/hide`);
  return res.data.data;
};

export const deleteReviewApi = async (reviewId: string): Promise<void> => {
  await api.delete(`/review/${reviewId}`);
};