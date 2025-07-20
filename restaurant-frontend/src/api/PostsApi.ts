import api from './axiosInstance';
import { PostType } from '../types/PostType';

export interface PostsResponse {
  docs: PostType[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PostsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const PostsApi = {
  getAllPosts: async (params?: PostsQueryParams): Promise<PostsResponse> => {
    const response = await api.get('/posts/getAllPosts', { params });
    return response.data;
  },

  getPostById: async (id: string): Promise<PostType> => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching post:', error);
      throw new Error(error?.response?.data?.message || 'Không thể tải bài viết');
    }
  },

  createPost: async (formData: FormData): Promise<{ success: boolean; message: string; data: PostType }> => {
    const response = await api.post('/posts/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePost: async (id: string, formData: FormData): Promise<{ success: boolean; message: string; data: PostType }> => {
    const response = await api.put(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePost: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  incrementViews: async (id: string): Promise<{ success: boolean; data: PostType }> => {
    const response = await api.put(`/posts/${id}/increment-views`);
    return response.data;
  },

  toggleLike: async (id: string): Promise<{ success: boolean; liked: boolean; likesCount: number }> => {
    const response = await api.post(`/posts/${id}/toggle-like`);
    return response.data;
  },

  checkUserLiked: async (id: string): Promise<{ success: boolean; liked: boolean; likesCount: number }> => {
    const response = await api.get(`/posts/${id}/check-liked`);
    return response.data;
  },

  getPostsByTag: async (tag: string): Promise<PostsResponse> => {
    const response = await api.get(`/posts/by-tag/${encodeURIComponent(tag)}`);
    return response.data;
  }
};

export default PostsApi;
