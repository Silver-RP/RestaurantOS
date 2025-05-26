import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetBanners, useDeleteBanner } from '../../../../hooks/useBanner';
import { toast } from 'react-toastify';

const BannerPage: React.FC = () => {
  const { banners, loading, error, fetchBanners } = useGetBanners();
  const { deleteBanner, loading: deletingBanner } = useDeleteBanner();

  useEffect(() => {
    console.log('BannerPage mounted, fetching banners...');
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    console.log('Current banners:', banners);
  }, [banners]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        await deleteBanner(id);
        toast.success('Xóa banner thành công');
        fetchBanners(); // Refresh list after delete
      } catch (error) {
        console.error('Error deleting banner:', error);
        if (error instanceof Error) {
          toast.error(error.message || 'Có lỗi xảy ra khi xóa banner');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý Banner</h2>
        <Link
          to="/admin/banners/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm Banner mới
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {Array.isArray(banners) && banners.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thứ tự
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="h-16 w-24 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{banner.order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {banner.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/admin/banners/edit/${banner._id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={deletingBanner}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Không có banner nào
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerPage;
