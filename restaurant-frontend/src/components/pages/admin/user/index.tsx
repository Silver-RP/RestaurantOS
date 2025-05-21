import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPagination from '../AdminPagination';
import { useUsers } from '@/hooks/useUsers';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { toggleUserBlockStatus } from '@/api/UserApi';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import UserFilterPanel from './UserFilterPanel';
const CONFIRM_TOAST_ID = 'confirm-toggle-user';

const UserIndexPage: React.FC = () => {
  const {
    users,
    totalDocs,
    totalPages,
    page,
    limit,
    loading,
    error,
    searchParams,
    setSearchParams,
    fetchUsers,
  } = useUsers();
  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('keyword', search);
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [search]);
  const showConfirmToast = (message: string, onConfirm: () => void) => {
    toast.dismiss(CONFIRM_TOAST_ID);
    toast(
      ({ closeToast }) => (
        <div className="max-w-[400px] text-gray-900 text-sm p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-lg pt-1">⚠️</div>
            <div className="flex-1">
              <p className="font-semibold mb-2 leading-snug text-black">
                {message}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeToast}
                  className="px-3 py-1 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
                >
                  Huỷ
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    closeToast?.();
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        toastId: CONFIRM_TOAST_ID,
        icon: false,
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
        hideProgressBar: true,
        theme: 'light', // hoặc bỏ nếu bạn đã kiểm soát toàn bộ màu bên trong
      },
    );
  };

  const handleToggleBlock = async (
    userId: string,
    isCurrentlyBlocked: boolean,
  ) => {
    showConfirmToast(
      isCurrentlyBlocked
        ? 'Bạn có chắc chắn muốn mở khóa người dùng này?'
        : 'Bạn có chắc chắn muốn khóa người dùng này?',
      async () => {
        try {
          await toggleUserBlockStatus(userId);
          toast.success(
            isCurrentlyBlocked
              ? 'Đã mở khóa người dùng!'
              : 'Đã khóa người dùng!',
          );
          await fetchUsers();
        } catch (err: any) {
          const msg =
            err?.response?.data?.message?.trim?.() ||
            'Có lỗi khi cập nhật trạng thái người dùng!';

          toast.error(msg);
        }
      },
    );
  };

  function handleEnter(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('keyword', search);
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
  }

  function handleClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('keyword', search);
    newParams.set('page', '1');
    setSearchParams(newParams);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        {/* Ô tìm kiếm - chiếm hết không gian còn lại */}

        <div className="w-96 relative">
          <input
            type="text"
            placeholder="Tìm người dùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleEnter} // nếu cần xử lý phím Enter
            className="px-4 py-2 border rounded-md w-full"
          />
          <button
            onClick={handleClick} // gán hàm xử lý tìm kiếm
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            aria-label="Search"
            type="button"
          >
            <FaSearch size={18} />
          </button>
        </div>

        {/* Nhóm nút: Hiện bộ lọc + Thêm người dùng */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            {showFilterPanel ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
          <button
            onClick={() => navigate('/admin/users/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Thêm người dùng
          </button>
        </div>
      </div>
      {showFilterPanel && (
        <UserFilterPanel
          key={searchParams.toString()}
          initialFilters={Object.fromEntries((searchParams as any).entries())}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onApply={(filters) => {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(filters).forEach(([key, value]) => {
              if (value) newParams.set(key, value);
              else newParams.delete(key);
            });
            newParams.set('page', '1');
            setSearchParams(newParams);
            setShowFilterPanel(false);
          }}
        />
      )}
      <div className="text-sm text-gray-700 mb-2">
        Hiển thị <strong>{users.length}</strong> trên tổng{' '}
        <strong>{totalDocs}</strong> người dùng
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
                <th className="px-4 py-2">Khóa</th>
                <th className="px-4 py-2">Vai trò</th>
                <th className="px-4 py-2">Số đơn hàng</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone || '—'}</td>
                  <td className="px-4 py-2">
                    {user.birthday?.slice(0, 10) || '—'}
                  </td>
                  <td className="px-4 py-2">{user.gender || '—'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() =>
                        handleToggleBlock(user._id, user.status === 'block')
                      }
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition hover:opacity-80 ${
                        user.status === 'block'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.status === 'block' ? (
                        <>
                          <FaLock /> Đã khóa
                        </>
                      ) : (
                        <>
                          <FaLockOpen /> khóa
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    {Array.isArray(user.roles) && user.roles.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role: any) => (
                          <span
                            key={role._id || role}
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              role.name === 'superadmin'
                                ? 'bg-red-100 text-red-700'
                                : role.name === 'manager'
                                  ? 'bg-blue-100 text-blue-700'
                                  : role.name === 'manager'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {role.name || role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {user.ordersCount || 0}
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
