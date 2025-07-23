import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PostsApi, { PostsResponse, PostsQueryParams } from '../api/PostsApi';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

export const POSTS_QUERY_KEY = ['posts'];

export const usePosts = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const queryParams: PostsQueryParams = {
    page,
    limit,
    search,
    sortBy,
    sortOrder: sortOrder as 'asc' | 'desc'
  };

  const { data, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: [...POSTS_QUERY_KEY, queryParams],
    queryFn: async () => {
      const response = await PostsApi.getAllPosts(queryParams);
      return response;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false
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
    searchParams,
    setSearchParams,
  };
};

export const usePostById = (id: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => PostsApi.getPostById(id),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: likeStatus, isLoading: isCheckingLike } = useQuery({
    queryKey: ['post-like', id],
    queryFn: () => PostsApi.checkUserLiked(id),
    enabled: !!id,
    retry: 1,
    staleTime: 60 * 1000, // 1 minute
  });

  const { mutate: incrementViews } = useMutation({
    mutationFn: () => PostsApi.incrementViews(id),
    onSuccess: (response) => {
      // Cập nhật cache với dữ liệu mới
      queryClient.setQueryData(['post', id], response.data);
    },
    onError: (error) => {
      console.error('Lỗi khi tăng lượt xem:', error);
    }
  });

  const { mutate: toggleLike, isPending: isTogglingLike } = useMutation({
    mutationFn: () => PostsApi.toggleLike(id),
    onSuccess: (response) => {
      // Cập nhật cache với dữ liệu mới
      queryClient.setQueryData(['post-like', id], response);
      
      // Cập nhật số lượt like trong bài viết
      const currentPost = queryClient.getQueryData<PostType>(['post', id]);
      if (currentPost) {
        queryClient.setQueryData(['post', id], {
          ...currentPost,
          likes: response.likesCount
        });
      }
    },
    onError: (error) => {
      console.error('Lỗi khi thích/bỏ thích bài viết:', error);
    }
  });

  return {
    data,
    isLoading: isLoading || isCheckingLike || isTogglingLike,
    error,
    incrementViews,
    toggleLike,
    isLiked: likeStatus?.liked || false,
    likesCount: likeStatus?.likesCount || data?.likes || 0
  };
};
