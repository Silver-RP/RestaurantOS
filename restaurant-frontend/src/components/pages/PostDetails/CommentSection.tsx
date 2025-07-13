import React, { useState } from 'react';
import {
  FaCommentAlt,
  FaSpinner,
  FaPaperPlane,
  FaRegCommentDots,
  FaListAlt
} from 'react-icons/fa';
import useComment from '../../../hooks/useComment';
import CommentItem from './CommentItem';
import ButtonComponents from '../../common/ButtonComponents';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, userInfo } = useSelector((state: RootState) => state.auth);

  const {
    comments,
    loading,
    error,
    totalComments,
    page,
    totalPages,
    editingComment,
    createComment,
    updateComment,
    deleteComment,
    handlePageChange,
    startEditing,
    cancelEditing
  } = useComment({ postId });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      setIsSubmitting(true);
      await createComment(commentContent);
      setCommentContent('');
      setIsSubmitting(false);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2 p-2 rounded-lg">
          {page > 1 && (
            <button
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-2 bg-[#012B40] border border-secondaryColor text-white rounded-md hover:bg-[#034a6a] transition-colors"
            >
              Trước
            </button>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-4 py-2 rounded-md transition-colors ${
                pageNum === page
                  ? 'bg-secondaryColor text-headerBackground font-bold'
                  : 'bg-[#012B40] border border-secondaryColor text-white hover:bg-[#034a6a]'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {page < totalPages && (
            <button
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 bg-[#012B40] border border-secondaryColor text-white rounded-md hover:bg-[#034a6a] transition-colors"
            >
              Tiếp
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 pb-2 border-b border-secondaryColor">
        <FaCommentAlt className="text-secondaryColor" /> Bình luận ({totalComments})
      </h3>

      <div className="mb-10 p-6 rounded-lg border border-[#034a6a]">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FaRegCommentDots className="text-secondaryColor" /> Để lại bình luận của bạn
        </h3>

        {!isAuthenticated ? (
          <div className="bg-yellow-100 text-yellow-800 text-sm px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">Bạn cần đăng nhập để bình luận.</p>
            <p className="mt-1">Vui lòng đăng nhập để tham gia thảo luận.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="hidden md:block">
                {userInfo?.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-secondaryColor"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#023e5a] flex items-center justify-center border-2 border-secondaryColor">
                    <FaCommentAlt className="w-6 h-6 text-secondaryColor" />
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <textarea
                  placeholder="Nhập bình luận của bạn..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full px-4 py-3 text-white rounded-lg border border-secondaryColor bg-transparent focus:outline-none focus:ring-2 focus:ring-secondaryColor"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
                <div className="flex justify-end mt-3">
                  <ButtonComponents
                    variant="filled"
                    size="medium"
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="flex items-center gap-2 rounded-full px-6"
                  >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    Gửi bình luận
                  </ButtonComponents>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-[#034a6a] pb-2">
          <FaListAlt className="text-secondaryColor" /> Danh sách bình luận
        </h3>

        {loading && (
          <div className="text-center py-8 text-white flex flex-col items-center justify-center gap-3">
            <FaSpinner className="animate-spin text-4xl text-secondaryColor" />
            <p className="text-lg">Đang tải bình luận...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 text-sm px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">Đã xảy ra lỗi:</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {!loading && comments.length === 0 ? (
          <div className="bg-green-100 text-green-800 px-6 py-8 rounded-lg mb-6 text-center">
            <p className="font-semibold text-lg">✓ Chưa có bình luận nào!</p>
            <p className="mt-2">Hãy là người đầu tiên bình luận về bài viết này.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                isEditing={editingComment?._id === comment._id}
                onEdit={startEditing}
                onDelete={deleteComment}
                onUpdate={updateComment}
                onCancelEdit={cancelEditing}
              />
            ))}
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
