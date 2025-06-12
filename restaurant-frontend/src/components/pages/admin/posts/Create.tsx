import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import { useCategories } from '@/hooks/useCategories';
import { usePosts } from '@/hooks/usePosts';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { isLoading, createPost } = usePosts();

  if (!categories) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Đang tạo bài viết...</div>;
  }

  const handleCreatePost = (formData: FormData) => {
    console.log('Create post handler called');
    try {
      createPost(formData, {
        onSuccess: () => {
          console.log('Post created successfully');
        },
        onError: (error) => {
          console.error('Error in createPost callback:', error);
        }
      });
    } catch (error) {
      console.error('Error in handleCreatePost:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thêm bài viết mới</h1>
            <p className="mt-1 text-sm text-gray-500">
              Tạo bài viết mới cho website
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/posts')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Quay lại danh sách
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <PostForm
              onSubmit={handleCreatePost}
              categories={categories.data || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
