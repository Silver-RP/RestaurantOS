import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostsApi from '../api/PostsApi';
import { PostType } from '../types/PostType';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import PostSidebar from '../components/pages/posts/PostSidebar';
import ButtonComponents from '../components/common/ButtonComponents';

const PostsByTagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tag) {
      setLoading(true);
      PostsApi.getPostsByTag(tag)
        .then(res => {
          console.log(res);
          setPosts(res.docs);
        })
        .finally(() => setLoading(false));
    }
  }, [tag]);

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
              <h2 className="text-2xl font-bold mb-6 text-secondaryColor">Bài viết với thẻ: <span className="text-white">{tag}</span></h2>
              {loading ? (
                <div className="text-white">Đang tải...</div>
              ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {posts.map(post => (
                    <div key={post._id} className="text-white w-full relative bg-[#1a2233] rounded-lg shadow-lg overflow-hidden">
                      <img
                        src={post.images?.[0] || '/assets/images/default-post.jpg'}
                        alt={post.title}
                        className="w-full h-[300px] object-cover"
                      />
                      <p className="bg-secondaryColor text-black inline-block px-3 py-1 text-sm mt-4 absolute top-4 left-4 rounded">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <div className="p-4">
                        <p className="text-sm mt-2">
                          Đăng bởi: <span className="text-secondaryColor">{post.user_id.username}</span> In: <span className="text-secondaryColor">{post.categories_id.Cate_name}</span>
                        </p>
                        <h3 className="text-xl font-bold mt-3 break-words">{post.title}</h3>
                        <p className="text-sm mt-2 break-words">{post.desc}</p>
                        <ButtonComponents variant="filled" size="small" onClick={() => window.location.href = `/post-details/${post._id}`}>
                          Đọc thêm
                        </ButtonComponents>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white">Không có bài viết nào với thẻ này.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostsByTagPage; 