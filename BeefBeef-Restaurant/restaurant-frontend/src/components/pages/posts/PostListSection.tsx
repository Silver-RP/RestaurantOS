import React from 'react';
import Post from './Post';
import { PostType } from '../../../types/PostType';

interface PostListSectionProps {
  posts: PostType[];
}

const PostListSection: React.FC<PostListSectionProps> = ({ posts }) => {
  return (
    <section className="bg-bodyBackground text-white lg:py-16">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PostListSection;
