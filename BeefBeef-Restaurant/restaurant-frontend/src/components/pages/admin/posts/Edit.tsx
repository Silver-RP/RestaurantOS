import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from './PostForm';
import { toast } from 'react-toastify';
import { useCategories } from '@/hooks/useCategories';
import { usePostById, usePosts } from '@/hooks/usePosts'; // import hook lấy post chi tiết

const EditPostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePost } = usePosts();

  // Dùng hook lấy post theo id
  const { data: post, isLoading: isLoadingPost, error: postError } = usePostById(id || '');

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      updatePost(
        { id, formData },
        {
          onSuccess: () => {
            navigate('/admin/posts');
          },
          onSettled: () => {
            setIsSubmitting(false);
          }
        }
      );
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bài viết');
    }
  };

  if (!categories) return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-xl text-gray-600">Đang tải danh mục...</div>
    </div>
  );
  
  if (isLoadingPost) return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-xl text-gray-600">Đang tải bài viết...</div>
    </div>
  );
  
  if (postError) return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-xl text-red-600">Đã có lỗi xảy ra khi tải bài viết</div>
    </div>
  );

  // Chuẩn bị dữ liệu ban đầu cho form
  const initialData = {
    title: post?.title || '',
    content: post?.content || '',
    images: post?.images || [],
    categories_id: post?.categories_id?._id || '',
    desc: post?.desc || '',
    status: post?.status || 'draft',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
            <p className="mt-1 text-sm text-gray-500">Chỉnh sửa nội dung và thông tin bài viết</p>
          </div>
          <button
            onClick={() => navigate('/admin/posts')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            ← Quay lại danh sách
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <PostForm 
              initialData={initialData} 
              onSubmit={handleSubmit} 
              categories={categories.data || []} 
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
