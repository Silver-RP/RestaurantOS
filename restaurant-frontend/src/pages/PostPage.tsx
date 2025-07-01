import React from 'react';
import PostListSection from '../components/pages/posts/PostListSection';
import PostSidebar from '../components/pages/posts/PostSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { usePosts } from '../hooks/usePosts';
import Pagination from '../components/common/Pagination';

const PostPage: React.FC = () => {
  const { data: postsData, isLoading, error, searchParams, setSearchParams } = usePosts();

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
            <div className="lg:w-1/4 w-full relative">
              <div className="w-full h-[calc(100vh-2rem)]">
                <PostSidebar />
              </div>
            </div>
            <div className="w-full lg:w-3/4">
              <PostListSection posts={postsData?.docs || []} />
              <div className="mt-8">
                <Pagination
                  currentPage={postsData?.page || 1}
                  totalPages={postsData?.totalPages || 1}
                  onPageChange={(page) => {
                    const newParams = new URLSearchParams(searchParams.toString());
                    newParams.set('page', String(page));
                    setSearchParams(newParams);
                  }}
                  limit={Number(searchParams.get('limit') || 10)}
                  onLimitChange={(newLimit) => {
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.set('limit', newLimit.toString());
                      newParams.delete('page');
                      return newParams;
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;