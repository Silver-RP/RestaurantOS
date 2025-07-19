import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePosts, POSTS_QUERY_KEY } from '../../../../hooks/usePosts';
import PostsApi from '../../../../api/PostsApi';
import AdminPagination from '../AdminPagination';
import { FaSort, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const PostsPage = () => {
  const { data: postsData, isLoading, error, searchParams, setSearchParams } = usePosts();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortField, setSortField] = useState(searchParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc');
  
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        newParams.set('search', searchTerm);
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1');
      setSearchParams(newParams);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, setSearchParams]);

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('sortBy', field);
    newParams.set('sortOrder', newOrder);
    setSearchParams(newParams);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />;
  };

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

  const posts = postsData?.docs || [];
  const totalPages = postsData?.totalPages || 1;
  const currentPage = postsData?.page || 1;

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', String(page));
    setSearchParams(newParams, { replace: true });
  };

  const handleLimitChange = (newLimit: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('limit', String(newLimit));
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  };

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
            <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
              <div className="flex gap-4">
                <div className="w-96 relative">
                  <input
                    type="text"
                    placeholder="Tìm bài viết..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border rounded-md w-full"
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                    aria-label="Search"
                    type="button"
                  >
                    <FiSearch size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">No.</th>
                  <th className="px-4 py-2">Hình</th>
                  <th
                    className="px-4 py-2 cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort('title')}
                  >
                    <span className="flex items-center gap-1">
                      Tiêu đề {getSortIcon('title')}
                    </span>
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort('category')}
                  >
                    <span className="flex items-center gap-1">
                      Danh mục {getSortIcon('category')}
                    </span>
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort('createdAt')}
                  >
                    <span className="flex items-center gap-1">
                      Ngày tạo {getSortIcon('createdAt')}
                    </span>
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort('status')}
                  >
                    <span className="flex items-center gap-1">
                      Trạng thái {getSortIcon('status')}
                    </span>
                  </th>
                  <th className="px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post: any, index: number) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      <img
                        src={post.images?.[0] || '/assets/images/default-post.jpg'}
                        alt={post.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{post.desc}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {post.categories_id?.Cate_name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'Đã đăng' : 'Nháp'}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <Link
                        to={`/admin/posts/edit/${post._id}`}
                        className="text-blue-600 hover:text-blue-900"
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
          
          {/* Pagination */}
          {postsData && (
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              limit={Number(searchParams.get('limit') || 10)}
              onLimitChange={handleLimitChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;