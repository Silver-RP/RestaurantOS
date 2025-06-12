import { Request, Response } from 'express';
import PostsService from '../services/PostsServices';

class PostsController {
  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await PostsService.getAllPosts();
      res.status(200).json({
        success: true,
        data: posts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi server'
      });
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostsService.getPostById(id);
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Không tìm thấy bài viết'
      });
    }
  }
  async createPost(req: Request, res: Response) {
    try {
      // Validate required fields
      const { title, desc, content, categories_id } = req.body;
      if (!title || !desc || !content || !categories_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc: title, desc, content, categories_id'
        });
      }
      const userId = (req.user as any).id?.toString();

      const post = await PostsService.createPost(req, userId);
      res.status(201).json({
        success: true,
        message: 'Tạo bài viết thành công',
        data: post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi khi tạo bài viết'
      });
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id?.toString();
      
      // Validate required fields
      const { title, desc, content, categories_id } = req.body;
      if (!title && !desc && !content && !categories_id) {
        return res.status(400).json({
          success: false,
          message: 'Cần ít nhất một trường để cập nhật'
        });
      }
      
      const post = await PostsService.updatePost(id, req, userId);
      res.status(200).json({
        success: true,
        message: 'Cập nhật bài viết thành công',
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi khi cập nhật bài viết'
      });
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id?.toString();
      
      await PostsService.deletePost(id, userId);
      res.status(200).json({
        success: true,
        message: 'Xóa bài viết thành công'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('quyền') ? 403 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi khi xóa bài viết'
      });
    }
  }
}

export default new PostsController();