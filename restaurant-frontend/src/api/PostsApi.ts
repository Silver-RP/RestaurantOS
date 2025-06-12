import api from './axiosInstance';
import { PostType } from '../types/PostType';

const PostsApi = {
  getAllPosts: async (): Promise<PostType[]> => {
    const response = await api.get('/posts/getAllPosts');
    return response.data.data;
  },

  getPostById: async (id: string): Promise<PostType> => {
    const response = await api.get(`/posts/${id}`);
    return response.data.data;
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
  }
};

export default PostsApi;
