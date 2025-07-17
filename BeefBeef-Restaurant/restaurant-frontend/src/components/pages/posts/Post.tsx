import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostType } from '../../../types/PostType';
import { FaShareAlt, FaFacebookF, FaTwitter } from 'react-icons/fa';
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
    <div className="text-white w-full relative">
      <img
        src={post.images?.[0] || '/assets/images/default-post.jpg'}
        alt={post.title}
        className="w-full h-auto max-h-80 object-cover"
      />
      <p className="bg-secondaryColor text-black inline-block px-3 py-1 text-sm mt-4 absolute top-4 left-4">
        {new Date(post.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <p className="text-sm mt-2">
        Đăng bởi:<span className="text-secondaryColor">{post.user_id.username}</span> In:{' '}
        <span className="text-secondaryColor">{post.categories_id.Cate_name}</span>
      </p>
      <div className="flex gap-2 mt-2">
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
      </div>
      <h3 className="text-xl font-bold mt-3 break-words">{post.title}</h3>
      <p className="text-sm mt-2 break-words">{post.desc}</p>
      <ButtonComponents variant="filled" size="small" onClick={handlePostClick}>
        Đọc thêm
      </ButtonComponents>
    </div>
  );
};

export default Post;