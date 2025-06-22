import { Post } from '../models/PostsModel';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';
import { IUser } from '../models/UserModel';
import { Request } from 'express';
import AuthMiddleWare from '../middleware/AuthMiddleWare';
import { Types } from 'mongoose';
import UploadImageService from '../services/UploadImageService';

class PostsService {
  async getAllPosts(page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
    try {
      const query: any = {};
      
      // Add search functionality
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { desc: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      const totalDocs = await Post.countDocuments(query);
      const totalPages = Math.ceil(totalDocs / limit);

      // Create sort object
      const sort: any = {};
      if (sortBy === 'category') {
        sort['categories_id.Cate_name'] = sortOrder === 'asc' ? 1 : -1;
      } else {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      }

      const posts = await Post.find(query)
        .populate({
          path: 'categories_id',
          model: 'categories',
          select: 'Cate_name Cate_slug Cate_img Cate_type',
        })
        .populate({
          path: 'user_id',
          model: 'User',
          select: 'username email avatar',
        })
        .sort(sort)
        .skip(skip)
        .limit(limit);

      return {
        docs: posts,
        totalDocs,
        totalPages,
        page,
        limit,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Lỗi khi lấy danh sách bài viết');
    }
  }

  async getPostById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    const post = await Post.findById(id)
      .populate({
        path: 'categories_id',
        model: 'categories',
        select: 'Cate_name Cate_slug Cate_img Cate_type',
      })
      .populate({
        path: 'user_id',
        model: 'User',
        select: 'username email avatar',
      });

    if (!post) {
      throw new Error('Không tìm thấy bài viết');
    }

    return post;
  }
  async createPost(req: Request, userId: string) {
    try {
      const { title, desc, content, categories_id, status = 'draft', images: imageUrls } = req.body;
      
      let images: string[] = [];

      if (!mongoose.Types.ObjectId.isValid(categories_id)) {
        throw new Error('ID danh mục không hợp lệ');
      }

      // Xử lý trường hợp người dùng gửi URL ảnh trực tiếp
      if (imageUrls) {
        if (Array.isArray(imageUrls)) {
          images = images.concat(imageUrls);
        } else if (typeof imageUrls === 'string') {
          images.push(imageUrls);
        }
      }

      // Xử lý upload files
      if (req.files || req.file) {
        let filesToUpload: Express.Multer.File[] = [];
        
        if (Array.isArray(req.files)) {
          filesToUpload = req.files;
        } else if (req.files && typeof req.files === 'object') {
          // Handle when req.files is an object of arrays (form-data)
          Object.values(req.files).forEach(fileArray => {
            if (Array.isArray(fileArray)) {
              filesToUpload = filesToUpload.concat(fileArray);
            }
          });
        } else if (req.file) {
          filesToUpload = [req.file];
        }

        if (filesToUpload.length > 0) {
          const uploadPromises = filesToUpload.map((file) => {
            return new Promise<string>((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'posts',
                  resource_type: 'image',
                },
                (error, result) => {
                  if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(new Error('Lỗi khi tải ảnh lên'));
                  } else if (result) {
                    resolve(result.secure_url);
                  }
                }
              );
              streamifier.createReadStream(file.buffer).pipe(stream);
            });
          });

          const uploadedImages = await Promise.all(uploadPromises);
          images = images.concat(uploadedImages);
        }
      }

      // Create slug from title
      const slug = title
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');

      const post = await Post.create({
        title,
        slug,
        desc,
        content,
        images,
        categories_id: new Types.ObjectId(categories_id),
        user_id: userId,
        status
      });

      return post;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  }

  async updatePost(id: string, req: Request, userId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID không hợp lệ');
      }

      const post = await Post.findById(id);
      if (!post) {
        throw new Error('Không tìm thấy bài viết');
      }
      
      // Check if user is the owner of the post
      if (post.user_id.toString() !== userId) {
        throw new Error('Bạn không có quyền chỉnh sửa bài viết này');
      }

      const updateData: any = {
        title: req.body.title,
        desc: req.body.desc,
        content: req.body.content,
        categories_id: req.body.categories_id,
        status: req.body.status || post.status,
        updatedAt: new Date()
      };

      // If slug should be updated (e.g., if title changed)
      if (req.body.title) {
        updateData.slug = req.body.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      }

      // Handle multiple images upload if new images are provided
      if (req.files && Array.isArray(req.files)) {
        const uploadPromises = (req.files as Express.Multer.File[]).map((file) => {
          return new Promise<string>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'posts',
                resource_type: 'image',
              },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload error:', error);
                  reject(new Error('Lỗi khi tải ảnh lên'));
                } else if (result) {
                  resolve(result.secure_url);
                }
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          });
        });

        const newImages = await Promise.all(uploadPromises);
        const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
        const updatedImages = [...existingImages, ...newImages];
        
        // Delete removed images from Cloudinary
        const removedImages = post.images.filter(img => !existingImages.includes(img));
        if (removedImages.length > 0) {
          try {
            await UploadImageService.deleteImages(removedImages);
          } catch (error) {
            console.error('Error deleting old images:', error);
            // Continue with update even if image deletion fails
          }
        }

        updateData.images = updatedImages;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
      .populate({
        path: 'categories_id',
        select: 'Cate_name Cate_slug Cate_img Cate_type',
      })
      .populate({
        path: 'user_id',
        select: 'username email avatar',
      });

      return updatedPost;
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    const post = await Post.findById(id);
    if (!post) {
      throw new Error('Không tìm thấy bài viết để xóa');
    }
    
    // Check if user is the owner of the post
    if (post.user_id.toString() !== userId) {
      throw new Error('Bạn không có quyền xóa bài viết này');
    }

    // Delete images from Cloudinary if they exist
    if (post.images && post.images.length > 0) {
      try {
        await UploadImageService.deleteImages(post.images);
      } catch (error) {
        console.error('Error deleting images:', error);
        // Continue with post deletion even if image deletion fails
      }
    }

    const result = await Post.findByIdAndDelete(id);
    if (!result) {
      throw new Error('Không tìm thấy bài viết để xóa');
    }

    return result;
  }
}

export default new PostsService();
