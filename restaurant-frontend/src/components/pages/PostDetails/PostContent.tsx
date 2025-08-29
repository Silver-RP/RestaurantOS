/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { FaShareAlt, FaFacebookF, FaTwitter, FaUser } from 'react-icons/fa';
import { IoList } from 'react-icons/io5';
import { MdOutlineAccessTime } from 'react-icons/md';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { PiEyesDuotone } from 'react-icons/pi';
import { PostType } from '../../../types/PostType';
import CommentSection from './CommentSection';
import { usePostById } from '../../../hooks/usePosts';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReportModal from '../../../components/common/modals/ReportModal';
import PostReportApi from '../../../api/PostReportApi';
import Cookies from 'js-cookie';

interface PostContentProps {
  post: PostType;
  isLoading?: boolean;
}

const DEFAULT_TAGS = [
  'Món chính',
  'Món khác',
  'Khai vị',
  'Món phụ và ăn kèm',
  'Nước uống',
  'Món tráng miệng',
  'Đồ uống có cồn',
];

export const isAuthenticated = (): boolean => {
  const userInfo = Cookies.get('userInfo');
  return !!userInfo;
};

const PostContent: React.FC<PostContentProps> = ({ post, isLoading }) => {
  // const { isAuthenticated } = useAuth();
  const { isLiked, likesCount, toggleLike } = usePostById(post._id);
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false); // State for report modal
  const tags = post.tags && post.tags.length > 0 ? post.tags : DEFAULT_TAGS;
  console.log(tags);

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thích bài viết');
      return;
    }
    toggleLike();
  };

  const handleTagClick = (tag: string) => {
    console.log(`/posts/tag/${encodeURIComponent(tag)}`);
    navigate(`/posts/tag/${encodeURIComponent(tag)}`);
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để báo cáo bài viết');
      return;
    }
    setShowReportModal(true);
  };

  const handleReportSubmit = async (reportContent: string) => {
    try {
      await PostReportApi.createReport({
        post_id: post._id,
        reason: reportContent,
      });
      toast.success('Báo cáo của bạn đã được gửi. Cảm ơn phản hồi của bạn!');
      setShowReportModal(false);
    } catch {
      toast.error('Vui lòng đăng nhập để gửi báo cáo');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-lg text-white">Đang tải dữ liệu bài viết...</div>
      </div>
    );
  }

  return (
    <section className="bg-[#012B40] text-white lg:py-16 lg:px-6">
      <div className=" mx-auto sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 break-words">
          {post.title}
        </h1>

        {/* Chia sẻ */}
        <div className="flex gap-4 mt-6 flex-wrap justify-start">
          <button className="bg-white text-black px-3 py-1.5 text-xs flex items-center gap-1">
            <FaShareAlt /> Chia sẻ
          </button>
          <button
            className="bg-white text-black px-3 py-1.5 text-xs flex items-center gap-1"
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                '_blank',
              )
            }
          >
            <FaFacebookF /> Facebook
          </button>
          <button className="bg-white text-black px-3 py-1.5 text-xs flex items-center gap-1">
            <FaTwitter /> Twitter
          </button>
        </div>

        {/* Thông tin */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6 mt-4">
          <span className="flex items-center gap-2">
            <FaUser /> Đăng bởi: <strong>{post.user_id?.username}</strong>
          </span>

          <span className="flex items-center gap-2">
            <MdOutlineAccessTime />
            Ngày:{' '}
            {new Date(post.createdAt).toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-2">
            <PiEyesDuotone /> Lượt xem: {post.views || 0}
          </span>

          <button
            onClick={handleLikeClick}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors normal-case"
          >
            {isLiked ? (
              <AiFillLike className="text-blue-400" />
            ) : (
              <AiOutlineLike />
            )}{' '}
            Like: {likesCount}
          </button>
          <button
            onClick={handleReportClick}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors normal-case"
          >
            <IoList /> Báo cáo {post.categories_id.Cate_name}
          </button>
        </div>

        {/* Hình ảnh */}
        <div className="mb-6">
          {post.images && post.images.length > 0 && (
            <div className="flex justify-center">
              <img
                src={post.images[0]}
                alt={post.title}
                className="rounded-lg shadow-lg w-full h-auto  object-cover"
              />
            </div>
          )}
          {post.images && post.images.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {post.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${post.title} - ${index + 2}`}
                  className="rounded-lg shadow-lg w-full h-48 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* Nội dung */}
        <div className="text-base sm:text-lg max-w-none mb-12 overflow-hidden break-words whitespace-pre-line">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Thẻ tags - render động và có sự kiện chuyển trang */}
        <div className="mb-10 text-right">
          <span className="font-semibold mr-2 text-sm">Thẻ:</span>
          {tags.map((tag: string, idx: number) => (
            <button
              key={idx}
              className="bg-gray-100 text-black px-2 py-0.5 text-xs rounded mr-2 mb-1"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Phần bình luận */}
        <CommentSection postId={post._id} />
      </div>
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        title="Báo cáo bài viết"
        placeholder="Nhập nội dung báo cáo tại đây..."
      />
    </section>
  );
};

export default PostContent;
