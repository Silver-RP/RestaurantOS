import React from 'react';
import { PostType } from '../../../types/PostType';
import { FaShareAlt, FaFacebookF, FaTwitter } from 'react-icons/fa'; // Import icons

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="text-white w-full relative">
      <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
      <p className="bg-secondaryColor text-black inline-block px-3 py-1 text-sm mt-4 absolute top-4 left-4">
        {new Date(post.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <p className="text-sm mt-2">Đăng bởi:<span className="text-secondaryColor">{post.author}</span> In: <span className="text-secondaryColor">{post.category}</span></p>
      <div className="flex gap-2 mt-2">
        <button className="bg-white text-black px-2 py-1 text-xs flex items-center gap-1">
          <FaShareAlt /> Share
        </button>
        <button className="bg-white text-black px-2 py-1 text-xs flex items-center gap-1">
          <FaFacebookF /> Facebook
        </button>
        <button className="bg-white text-black px-2 py-1 text-xs flex items-center gap-1">
          <FaTwitter /> Twitter
        </button>
      </div>
      <h3 className="text-xl font-bold mt-3">{post.title}</h3>
      <p className="text-sm mt-2">{post.description}</p>
      <button className="mt-4 border border-secondaryColor px-4 py-2 hover:bg-secondaryColor hover:text-black transition">ĐỌC THÊM</button>
    </div>
  );
};

export default Post;
