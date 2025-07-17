import axiosInstance from './axiosInstance';

interface CommentResponse {
  success: boolean;
  data: {
    docs: Comment[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

interface Comment {
  _id: string;
  content: string;
  postId: string;
  userId: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CommentCreateResponse {
  success: boolean;
  message: string;
  data: Comment;
}

class CommentApi {
  /**
   * Lấy danh sách bình luận theo bài viết
   */
  static async getCommentsByPostId(
    postId: string,
    page = 1,
    limit = 10,
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<CommentResponse> {
    const response = await axiosInstance.get(
      `/posts/${postId}/comments?page=${page}&limit=${limit}&sortOrder=${sortOrder}`
    );
    return response.data;
  }

  /**
   * Tạo bình luận mới
   */
  static async createComment(
    postId: string,
    content: string
  ): Promise<CommentCreateResponse> {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, { content });
    return response.data;
  }

  /**
   * Cập nhật bình luận
   */
  static async updateComment(
    commentId: string,
    content: string
  ): Promise<CommentCreateResponse> {
    const response = await axiosInstance.put(`/posts/comments/${commentId}`, { content });
    return response.data;
  }

  /**
   * Xóa bình luận
   */
  static async deleteComment(commentId: string): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(`/posts/comments/${commentId}`);
    return response.data;
  }
}

export default CommentApi;
export type { Comment }; 