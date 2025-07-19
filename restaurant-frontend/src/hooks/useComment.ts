import { useState, useEffect } from 'react';
import CommentApi, { Comment } from '../api/CommentApi';
import { toast } from 'react-toastify';

interface UseCommentProps {
  postId: string;
  initialPage?: number;
  initialLimit?: number;
  initialSortOrder?: 'asc' | 'desc';
}

const useComment = ({
  postId,
  initialPage = 1,
  initialLimit = 10,
  initialSortOrder = 'desc'
}: UseCommentProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [limit] = useState<number>(initialLimit);
  const [sortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await CommentApi.getCommentsByPostId(postId, page, limit, sortOrder);
      
      if (response.success) {
        setComments(response.data.docs);
        setTotalPages(response.data.totalPages);
        setTotalComments(response.data.totalDocs);
      } else {
        setError('Không thể tải bình luận');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải bình luận');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create comment
  const createComment = async (content: string) => {
    try {
      setLoading(true);
      const response = await CommentApi.createComment(postId, content);
      
      if (response.success) {
        toast.success('Bình luận của bạn đã được đăng thành công!', {
          position: 'top-right',
          autoClose: 3000
        });
        await fetchComments(); // Refresh comments after adding
      } else {
        toast.error('Không thể thêm bình luận');
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi khi thêm bình luận');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update comment
  const updateComment = async (commentId: string, content: string) => {
    try {
      setLoading(true);
      const response = await CommentApi.updateComment(commentId, content);
      
      if (response.success) {
        toast.success('Bình luận đã được cập nhật thành công!', {
          position: 'top-right',
          autoClose: 3000
        });
        setEditingComment(null);
        await fetchComments(); // Refresh comments after updating
      } else {
        toast.error('Không thể cập nhật bình luận');
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi khi cập nhật bình luận');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete comment
  const deleteComment = async (commentId: string) => {
    try {
      setLoading(true);
      const response = await CommentApi.deleteComment(commentId);
      
      if (response.success) {
        toast.success('Bình luận đã được xóa thành công!', {
          position: 'top-right',
          autoClose: 3000
        });
        await fetchComments(); // Refresh comments after deleting
      } else {
        toast.error('Không thể xóa bình luận');
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi khi xóa bình luận');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Start editing a comment
  const startEditing = (comment: Comment) => {
    setEditingComment(comment);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingComment(null);
  };

  // Initial fetch and refetch when dependencies change
  useEffect(() => {
    fetchComments();
  }, [postId, page, limit, sortOrder]);

  return {
    comments,
    loading,
    error,
    page,
    totalPages,
    totalComments,
    editingComment,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    handlePageChange,
    startEditing,
    cancelEditing
  };
};

export default useComment; 