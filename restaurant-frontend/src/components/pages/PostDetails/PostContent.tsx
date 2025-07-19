import React, { useState } from 'react';
import {
  FaShareAlt,
  FaFacebookF,
  FaTwitter,
  FaUser,
  FaHeart,
} from 'react-icons/fa';
import { IoList } from 'react-icons/io5';
import { MdOutlineAccessTime } from 'react-icons/md';
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { PiEyesDuotone } from "react-icons/pi";
import ButtonComponents from '../../../components/common/ButtonComponents';
import { PostType } from '../../../types/PostType';
import CommentSection from './CommentSection';
import { usePostById } from '../../../hooks/usePosts';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReportModal from '../../../components/common/modals/ReportModal';
import PostReportApi from '../../../api/PostReportApi';

interface PostContentProps {
  post: PostType;
}

const DEFAULT_TAGS = [
  'Món chính',
  'Món khác',
  'Khai vị',
  'Món phụ và ăn kèm',
  'Nước uống',
  'Món tráng miệng',
  'Đồ uống có cồn'
];

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const { isAuthenticated } = useAuth();
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
      await PostReportApi.createReport({ post_id: post._id, reason: reportContent });
      toast.success('Báo cáo của bạn đã được gửi. Cảm ơn phản hồi của bạn!');
      setShowReportModal(false);
    } catch (error: any) {
      toast.error('Gửi báo cáo thất bại!');
    }
  };

  return (
    <section className="bg-[#012B40] text-white lg:py-16 px-6">
      <div className="max-w-full lg:max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 break-words">{post.title}</h1>

        {/* Chia sẻ */}
        <div className="flex gap-4 mt-6 flex-wrap justify-start">
          <button className="bg-white text-black px-3 py-1.5 text-xs flex items-center gap-1">
            <FaShareAlt /> Chia sẻ
          </button>
          <button
            className="bg-white text-black px-3 py-1.5 text-xs flex items-center gap-1"
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
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
            <FaUser /> Đăng bởi: <strong>{post.user_id.username}</strong>
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
  {isLiked ? <AiFillLike className="text-blue-400" /> : <AiOutlineLike />} Like: {likesCount}
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
                className="rounded-lg shadow-lg w-full h-auto max-w-[800px] object-cover"
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
        <div className="prose prose-sm sm:prose-lg prose-invert max-w-none mb-12 overflow-hidden break-words">
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

        {/* Danh mục liên quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300 pt-6 mb-10">
          <div>
            <h3 className="font-semibold text-white mb-2">Trong cùng danh mục</h3>
            <ul className="space-y-1">
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Giá trị tuyệt vời với phong cách đẳng cấp, hãy thử ngay hôm nay
              </li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Thưởng thức món ăn tại không gian đậm chất Á Đông
              </li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Ẩm thực tinh tế, phong phú và hấp dẫn
              </li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Khám phá món mới mỗi tuần với đầu bếp 5 sao
              </li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Không gian ấm cúng, món ăn giàu dinh dưỡng
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Liên quan theo thẻ</h3>
            <ul className="space-y-1">
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Không gian ấm cúng, món ăn giàu dinh dưỡng
              </li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Thưởng thức món ăn tại không gian đậm chất Á Đông
              </li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Hương vị độc đáo, phong cách ẩm thực hiện đại
              </li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Giá trị tuyệt vời với phong cách đẳng cấp, hãy thử ngay hôm nay
              </li>
              <li className="pb-2 border-b border-white/30 hover:text-[#FFDEA0]">
                Ẩm thực tinh tế, phong phú và hấp dẫn
              </li>
            </ul>
          </div>
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
