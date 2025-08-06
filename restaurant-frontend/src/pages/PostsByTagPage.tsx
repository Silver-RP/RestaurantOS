import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostsApi from '../api/PostsApi';
import { PostType } from '../types/PostType';
import PostSidebar from '../components/pages/posts/PostSidebar';
import Post from '../components/pages/posts/Post';

const PostsByTagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tag) {
      setLoading(true);
      PostsApi.getPostsByTag(tag)
        .then((res) => {
          console.log(res);
          setPosts(res.docs);
        })
        .finally(() => setLoading(false));
    }
  }, [tag]);

  return (
    <>
      <div className="bg-bodyBackground min-h-screen text-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 px-4 py-10">
            <div className="lg:w-1/4 w-full relative">
              <div className="w-full h-[400px]">
                <PostSidebar />
              </div>
            </div>
            <div className="w-full lg:w-3/4">
              <h2 className="text-2xl font-bold mb-6 text-secondaryColor">
                Bài viết với thẻ: <span className="text-white">{tag}</span>
              </h2>
              {loading ? (
                <div className="text-white">Đang tải...</div>
              ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {posts.map((post) => (
                    <Post key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-white">
                  Không có bài viết nào với thẻ này.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostsByTagPage;
