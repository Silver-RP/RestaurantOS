import React from 'react';
import PostListSection from '../components/pages/posts/PostListSection';
import PostSidebar from '../components/pages/posts/PostSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { usePosts } from '../hooks/usePosts';

const PostPage: React.FC = () => {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">Error loading posts</div>;
  }

  return (
    <>
      <BreadCrumbComponents />

      <div className="bg-bodyBackground min-h-screen text-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 px-4 py-10">
            <div className="lg:w-1/4 w-full relative"> {/* Container cha cho sidebar */}
              <div className="w-full h-[calc(100vh-2rem)]"> {/* Container để giới hạn chiều cao */}
                <PostSidebar />
              </div>
            </div>

            <div className="w-full lg:w-3/4">
              <PostListSection posts={posts || []} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;