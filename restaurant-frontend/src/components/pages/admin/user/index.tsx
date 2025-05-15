import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPagination from '../AdminPagination';
import { useUsers } from '@/hooks/useUsers';

const UserIndexPage: React.FC = () => {
  const { users, totalDocs, totalPages, page, limit, loading, error, searchParams, setSearchParams } = useUsers();
  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const navigate = useNavigate();

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('keyword', search);
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [search]);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="w-96">
          <input
            type="text"
            placeholder="Tìm người dùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md w-full"
          />
        </div>
        <button
            onClick={() => navigate('/admin/users/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Thêm người dùng
          </button>
      </div>
      

      <div className="text-sm text-gray-700 mb-2">
        Hiển thị <strong>{users.length}</strong> trên tổng <strong>{totalDocs}</strong> người dùng
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full bg-white text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Số điện thoại</th>
                <th className="px-4 py-2">Ngày sinh</th>
                <th className="px-4 py-2">Giới tính</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{(page - 1) * limit + index + 1}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone || '—'}</td>
                  <td className="px-4 py-2">{user.birthday?.slice(0, 10) || '—'}</td>
                  <td className="px-4 py-2">{user.gender || '—'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                      className="text-blue-500 hover:underline"
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <AdminPagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={(page) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', String(page));
    setSearchParams(newParams);
  }}
  limit={limit}
  onLimitChange={(newLimit) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('limit', String(newLimit));
    newParams.delete('page');
    setSearchParams(newParams);
  }}
/>
        </div>
      )}
    </div>
  );
};

export default UserIndexPage;