import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostType } from '../../../types/PostType';
import ButtonComponents from '../../common/ButtonComponents';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/post-details/${post._id}`);
  };

  return (
    <div className="text-white w-full relative bg-headerBackground rounded-xl shadow-md overflow-hidden p-4">
      <div className="relative cursor-pointer group" onClick={handlePostClick}>
        <img
          src={post.images?.[0] || '/assets/images/default-post.jpg'}
          alt={post.title}
          className="w-full h-[220px] object-cover rounded-t-lg transform transition-transform duration-300 group-hover:scale-105"
        />
        <p className="bg-secondaryColor text-black inline-block px-3 py-1 text-sm mt-3 absolute top-0 left-0">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-4 mb-2">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm">
            Đăng bởi:{' '}
            <span className="text-secondaryColor font-semibold">
              {post.user_id?.username}
            </span>
          </span>
          <span className="text-sm">
            In:{' '}
            <span className="text-secondaryColor font-semibold">
              {post.categories_id.Cate_name}
            </span>
          </span>
        </div>
        {/* <div className="flex gap-2 mt-2">
          <button className="bg-white text-black px-2 py-1 text-xs flex items-center gap-1">
            <FaShareAlt /> Share
          </button>
          <button
            className="bg-white text-black px-2 py-1 text-xs flex items-center gap-1"
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/post-details/${post._id}`)}`, '_blank')}
          >
            <FaFacebookF /> Facebook
          </button>
          <button
            className="bg-white text-black px-2 py-1 text-xs flex items-center gap-1"
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${window.location.origin}/post-details/${post._id}`)}`, '_blank')}
          >
            <FaTwitter /> Twitter
          </button>
        </div> */}
      </div>
      <h3
        className="text-xl font-bold mt-4 mb-2 break-words line-clamp-2 min-h-[3.5rem] cursor-pointer hover:text-secondaryColor transition-colors"
        onClick={handlePostClick}
      >
        {post.title}
      </h3>
      <p className="text-sm mt-2 mb-4 break-words leading-relaxed line-clamp-2 min-h-[2.5rem]">
        {post.desc}
      </p>
      <ButtonComponents variant="filled" size="small" onClick={handlePostClick}>
        Đọc thêm
      </ButtonComponents>
    </div>
  );
};

export default Post;
