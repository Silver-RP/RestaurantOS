import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PostsApi from '../api/PostsApi';
import { toast } from 'react-toastify';

export const POSTS_QUERY_KEY = ['posts'];

export const usePosts = () => {
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: PostsApi.getAllPosts,
  });

  const { mutate: createPost, isPending: isCreating } = useMutation({
    mutationFn: PostsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      toast.success('Tạo bài viết thành công');
      window.location.href = '/admin/posts';
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo bài viết');
      console.error('Failed to create post:', error);
    },
  });
  
  const { mutate: updatePost, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      PostsApi.updatePost(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      toast.success('Cập nhật bài viết thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bài viết');
      console.error('Failed to update post:', error);
    },
  });

  return {
    data,
    isLoading: isLoadingPosts || isCreating || isUpdating,
    error,
    createPost,
    updatePost,
  };
};

export const usePostById = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => PostsApi.getPostById(id),
    enabled: !!id, // chỉ chạy khi có id
  });
};
