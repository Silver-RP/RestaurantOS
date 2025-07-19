import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OrderOnlineLayout from '../components/pages/PostDetails/OrderOnlineLayout';
import PostContent from '../components/pages/PostDetails/PostContent';
import { usePostById } from '../hooks/usePosts';

const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error, incrementViews } = usePostById(id || '');

  useEffect(() => {
    if (id) {
      // Tăng lượt xem khi component được tải
      incrementViews();
    }
  }, [id, incrementViews]);

  if (isLoading) {
    return (
      <OrderOnlineLayout className="px-4 sm:px-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondaryColor"></div>
        </div>
      </OrderOnlineLayout>
    );
  }

  if (error || !post) {
    return (
      <OrderOnlineLayout className="px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Không thể tải bài viết</h2>
          <p className="text-gray-400 text-sm sm:text-base">Vui lòng thử lại sau</p>
        </div>
      </OrderOnlineLayout>
    );
  }

  return (
    <OrderOnlineLayout className="px-4 sm:px-6">
      <PostContent post={post} />
    </OrderOnlineLayout>
  );
};

export default PostDetailsPage;
