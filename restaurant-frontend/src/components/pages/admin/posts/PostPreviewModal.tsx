import React from 'react';
import { PostType } from '../../../../types/PostType';
import PostContent from '../../PostDetails/PostContent';

interface PostPreviewModalProps {
  post: PostType;
  onClose: () => void;
  isOpen: boolean;
}

const PostPreviewModal: React.FC<PostPreviewModalProps> = ({ post, onClose, isOpen }) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-bodyBackground w-full max-w-4xl h-[90vh] rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-hr">
          <h2 className="text-xl font-bold text-white">Xem trước bài viết</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <PostContent post={post} />
        </div>
      </div>
    </div>
  );
};

export default PostPreviewModal; 