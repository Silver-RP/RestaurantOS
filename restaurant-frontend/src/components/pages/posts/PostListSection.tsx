import React from 'react';
import Post from './Post';
import { PostType } from '../../../types/PostType';

interface PostListSectionProps {
  posts: PostType[];
  isLoading?: boolean;
}

const PostListSection: React.FC<PostListSectionProps> = ({ posts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-lg text-white">Đang tải dữ liệu bài viết...</div>
      </div>
    );
  }
  // Không cần filter lại, backend đã trả về đúng bài published
  return (
    <section className="bg-bodyBackground text-white ">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PostListSection;
