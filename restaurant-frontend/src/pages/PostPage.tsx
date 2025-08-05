import React from 'react';
import PostListSection from '../components/pages/posts/PostListSection';
import PostSidebar from '../components/pages/posts/PostSidebar';
import { usePosts } from '../hooks/usePosts';
import Pagination from '../components/common/Pagination';
import Container from '@/components/common/Container';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const PostPage: React.FC = () => {
  const {
    data: postsData,
    isLoading,
    searchParams,
    setSearchParams,
  } = usePosts();

  return (
    <>
      <div className="bg-bodyBackground min-h-screen text-white">
        <Container>
          <div className="max-w-[1500px] py-10 px-4">
            <div className="flex flex-col lg:flex-row lg:items-start gap-10">
              <div className="lg:w-1/4 w-full h-fit">
                <div className="sticky top-[120px] self-start">
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
              <div className="w-full lg:w-3/4 relative">
                {isLoading ? (
                  <>
                    {' '}
                    <LoadingOverlay loading={true} />
                  </>
                ) : (
                  <>
                    <PostListSection
                      posts={postsData?.docs || []}
                      isLoading={false}
                    />
                    <div className="mt-8">
                      <Pagination
                        currentPage={postsData?.page || 1}
                        totalPages={postsData?.totalPages || 1}
                        onPageChange={(page) => {
                          const newParams = new URLSearchParams(
                            searchParams.toString(),
                          );
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
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default PostPage;
