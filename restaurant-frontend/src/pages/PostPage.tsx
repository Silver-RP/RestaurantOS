import React from 'react';
import PostListSection from '../components/pages/posts/PostListSection';
import PostSidebar from '../components/pages/posts/PostSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { usePosts } from '../hooks/usePosts';
import Pagination from '../components/common/Pagination';
import Container from '@/components/common/Container';


const PostPage: React.FC = () => {
  const { data: postsData, isLoading, error, searchParams, setSearchParams } = usePosts();

  return (
    <>
      <BreadCrumbComponents />
      <div className="bg-bodyBackground min-h-screen text-white">
        <Container>

          <div className="max-w-[1500px] py-10">
          <div className="flex flex-col lg:flex-row gap-10 ">
            <div className="lg:w-1/4 w-full relative">
              <div className="w-full h-[400px]">
                <PostSidebar
                  onSearch={(value) => {
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      if (value) {
                        newParams.set('search', value);
                      } else {
                        newParams.delete('search');
                      }
                      newParams.delete('page');
                      return newParams;
                    });
                  }}
                />
              </div>
            </div>
            <div className="w-full lg:w-3/4">
              <PostListSection posts={postsData?.docs || []} isLoading={isLoading} />
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
        </Container>

      </div>
    </>
  );
};

export default PostPage;