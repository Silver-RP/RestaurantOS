import React from 'react';
import { useParams } from 'react-router-dom';
import OrderOnlineLayout from '../components/pages/PostDetails/OrderOnlineLayout';
import PostContent from '../components/pages/PostDetails/PostContent';
import { usePostById } from '../hooks/usePosts';

const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = usePostById(id || '');

  if (isLoading) {
    return (
      <OrderOnlineLayout>
        <div className="p-6 text-white">Loading...</div>
      </OrderOnlineLayout>
    );
  }

  if (error || !post) {
    return (
      <OrderOnlineLayout>
        <div className="p-6 text-white">Error loading post details</div>
      </OrderOnlineLayout>
    );
  }

  return (
    <OrderOnlineLayout>
      <PostContent post={post} />
    </OrderOnlineLayout>
  );
};

export default PostDetailsPage;
