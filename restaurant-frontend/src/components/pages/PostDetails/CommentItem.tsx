import React, { useState } from 'react';
import { FaEdit, FaTrash, FaUserCircle, FaRegClock } from 'react-icons/fa';
import { Comment } from '../../../api/CommentApi';
import ButtonComponents from '../../common/ButtonComponents';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

interface CommentItemProps {
  comment: Comment;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  isEditing: boolean;
  onUpdate: (commentId: string, content: string) => void;
  onCancelEdit: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onEdit,
  onDelete,
  isEditing,
  onUpdate,
  onCancelEdit
}) => {
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const isOwner = userInfo && userInfo._id === comment.userId._id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim()) {
      onUpdate(comment._id, editContent);
    }
  };

  return (
    <div className="border border-[#034a6a] rounded-lg p-4 mb-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.userId.avatar ? (
            <img
              src={comment.userId.avatar}
              alt={comment.userId.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-secondaryColor"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#023e5a] flex items-center justify-center border-2 border-secondaryColor">
              <FaUserCircle className="w-8 h-8 text-secondaryColor" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-white text-lg">{comment.userId.username}</h4>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <FaRegClock className="text-secondaryColor" /> {formatDate(comment.createdAt)}
              </p>
            </div>

            {/* Actions */}
            {isOwner && !isEditing && !showDeleteConfirm && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(comment)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full flex items-center gap-1 text-sm"
                >
                  <FaEdit /> Sửa
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full flex items-center gap-1 text-sm"
                >
                  <FaTrash /> Xóa
                </button>
              </div>
            )}

            {/* Xác nhận xóa */}
            {isOwner && showDeleteConfirm && (
              <div className="flex gap-2 p-2 rounded-lg border border-[#034a6a]">
                <span className="text-white text-sm mr-2">Xác nhận xóa?</span>
                <button
                  onClick={() => {
                    onDelete(comment._id);
                    setShowDeleteConfirm(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm"
                >
                  Xóa
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>

          {/* Nội dung hoặc form chỉnh sửa */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 text-white rounded-lg border border-secondaryColor bg-transparent focus:outline-none focus:ring-2 focus:ring-secondaryColor"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <ButtonComponents variant="filled" size="small" type="submit">
                  Lưu
                </ButtonComponents>
                <ButtonComponents variant="outline" size="small" onClick={onCancelEdit}>
                  Hủy
                </ButtonComponents>
              </div>
            </form>
          ) : (
            <div className="mt-3 border border-[#034a6a] rounded-lg p-3 bg-transparent">
              <p className="text-white text-base leading-relaxed">{comment.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
