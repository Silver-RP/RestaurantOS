import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostsApi from '../api/PostsApi';
import { PostType } from '../types/PostType';
import PostSidebar from '../components/pages/posts/PostSidebar';
import Post from '../components/pages/posts/Post';
import Container from '@/components/common/Container';
import { usePosts } from '../hooks/usePosts';

const PostsByTagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    data: postsData,
    isLoading,
    searchParams,
    setSearchParams,
  } = usePosts();

  const searchValue = searchParams.get('search') || '';

  useEffect(() => {
    if (tag) {
      setLoading(true);
      PostsApi.getPostsByTag(tag, { search: searchValue })
        .then((res) => setPosts(res.docs))
        .finally(() => setLoading(false));
    }
  }, [tag, searchValue]);

  // Chọn dữ liệu hiển thị: từ search hay từ tag
  const displayPosts = posts;

  return (
    <div className="bg-bodyBackground min-h-screen text-white">
      <Container>
        <div className="max-w-[1500px] py-10 px-4">
          <div className="flex flex-col lg:flex-row gap-10">
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

            <div className="w-full lg:w-3/4">
              <h2 className="text-2xl font-bold mb-6 text-secondaryColor">
                Bài viết với thẻ: <span className="text-white">{tag}</span>
              </h2>

              {(loading || isLoading) ? (
                <div className="text-white">Đang tải...</div>
              ) : displayPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {displayPosts.map((post) => (
                    <Post key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-white">
                  Không có bài viết nào {searchValue ? 'phù hợp với tìm kiếm.' : 'với thẻ này.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PostsByTagPage;
