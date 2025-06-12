import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePosts, POSTS_QUERY_KEY } from '../../../../hooks/usePosts';
import PostsApi from '../../../../api/PostsApi';

const PostsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: posts, isLoading, error } = usePosts();
  const queryClient = useQueryClient();
  
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: PostsApi.deletePost,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Xóa bài viết thành công!');
        queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi xóa bài viết!');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa bài viết!');
    }
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      deletePost(id);
    }
  };

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.desc.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading || isDeleting) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">
          {isDeleting ? 'Đang xóa bài viết...' : 'Đang tải dữ liệu...'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Có lỗi xảy ra khi tải dữ liệu!</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Bài viết</h2>
          <Link
            to="/admin/posts/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FiPlus className="mr-2" />
            Thêm bài viết mới
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Search and filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center w-full max-w-lg bg-gray-100 rounded-md px-3 py-2">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="bg-transparent w-full focus:outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài viết</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post, index) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={post.images?.[0] || '/assets/images/default-post.jpg'} 
                          alt={post.title}
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{post.desc}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {post.categories_id?.Cate_name || 'N/A'}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.user_id?.username || 'N/A'}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'Đã đăng' : 'Nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/posts/edit/${post._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FiEdit2 className="inline-block w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className={`text-red-600 hover:text-red-900 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isDeleting}
                      >
                        <FiTrash2 className="inline-block w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination - có thể thêm sau */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> trong số <span className="font-medium">20</span> bài viết
              </div>
              {/* Add pagination component here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsPage;