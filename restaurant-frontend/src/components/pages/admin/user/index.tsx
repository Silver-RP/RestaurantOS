import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPagination from '../AdminPagination';
import { useUsers } from '@/hooks/useUsers';
import {
  FaLock,
  FaLockOpen,
  FaSearch,
  FaSort,
  FaArrowUp,
  FaArrowDown,
  FaEye,
} from 'react-icons/fa';
import { toggleUserBlockStatus } from '@/api/UserApi';
import { toast } from 'react-toastify';
import UserFilterPanel from './UserFilterPanel';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { User } from 'types/User.type';
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
  const currentUser = useSelector((state: RootState) => state.user.user);
  // const { roles: allRoles } = useRoles();
  const [loyaltyModalUser, setLoyaltyModalUser] = useState<User | null>(null);

  const getRoleNames = (roles: any[]): string[] =>
    roles
      .map((r) => (typeof r === 'string' ? r : r.name?.toLowerCase?.()))
      .filter(Boolean);

  // ↓↓↓ THÊM VÀO ĐÂY ↓↓↓
  const handleEditUser = (targetUser: any) => {
    const currentRoles = getRoleNames(currentUser?.roles || []);
    const targetRoles = getRoleNames(targetUser?.roles || []);

    const isSuperadmin = currentRoles.includes('superadmin');
    const isManager = currentRoles.includes('manager');
    const isEditingSelf = currentUser && targetUser._id === currentUser._id;

    if (isEditingSelf) {
      toast.error('Không được chỉnh sửa chính mình');
      return;
    }
    
    if (isSuperadmin && targetRoles.includes('user')) {
      return toast.error(
        'Superadmin không được chỉnh sửa người dùng role user',
      );
    }

    if (isManager && targetRoles.includes('user')) {
      return toast.error('Manager không được chỉnh sửa người dùng role user');
    }

    if (isSuperadmin) return navigate(`/admin/users/edit/${targetUser._id}`);

    const managerAllowed = ['staff', 'cashier'];
    const canManagerEdit =
      isManager && targetRoles.every((r) => managerAllowed.includes(r));

    if (canManagerEdit) return navigate(`/admin/users/edit/${targetUser._id}`);

    return toast.error('Bạn không có quyền chỉnh sửa người dùng này');
  };

  const sortField = searchParams.get('sort') || '';
  const sortOrder = searchParams.get('order') || '';
  const handleSort = (field: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentSort = searchParams.get('sort');
    const currentOrder = searchParams.get('order');

    if (currentSort === field) {
      // Toggle asc <=> desc
      newParams.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
    } else {
      newParams.set('sort', field);
      newParams.set('order', 'asc');
    }

    newParams.set('page', '1');
    setSearchParams(newParams);
  };
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />;
  };
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
        theme: 'light', 
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
              if (value) newParams.set(key, String(value));
              else newParams.delete(key);
            });
            newParams.set('page', '1');
            newParams.set('limit', '12');
            setSearchParams(newParams);
            setShowFilterPanel(false);
          }}
        />
      )}
      <div className="text-sm text-gray-700 mb-2">
        Hiển thị <strong>{users.length}</strong> trên tổng{' '}
        <strong>{totalDocs}</strong> tài khoản
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
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('username')}
                >
                  <span className="flex items-center gap-1">
                    Tên {getSortIcon('username')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('email')}
                >
                  <span className="flex items-center gap-1">
                    Email {getSortIcon('email')}
                  </span>
                </th>
                <th className="px-4 py-2">Số điện thoại</th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('birthday')}
                >
                  <span className="flex items-center gap-1">
                    Ngày sinh {getSortIcon('birthday')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('gender')}
                >
                  <span className="flex items-center gap-1">
                    Giới tính {getSortIcon('gender')}
                  </span>
                </th>

                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Khóa</th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('roles')}
                >
                  <span className="flex items-center gap-1">
                    Vai trò {getSortIcon('roles')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('ordersCount')}
                >
                  <span className="flex items-center gap-1">
                    Số đơn hàng {getSortIcon('ordersCount')}
                  </span>
                </th>
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
                  <td className="px-4 py-2">{user.ordersCount || 0}</td>


                  <td className="px-4 py-2 space-x-2">                 
                    <button
                      onClick={() => setLoyaltyModalUser(user)}
                      className="text-blue-600 hover:text-blue-800 ml-2"
                      title="Xem thông tin loyalty"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
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
      {/* Loyalty Info Modal */}
      {loyaltyModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setLoyaltyModalUser(null)}
              aria-label="Đóng"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Thông tin tích điểm</h2>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Hạng thành viên: </span>
                {loyaltyModalUser.loyalty_tier?.tier_name
                  ? loyaltyModalUser.loyalty_tier.tier_name.toUpperCase()
                  : <span className="italic text-gray-500">Chưa có</span>}
              </div>
              <div>
                <span className="font-semibold">Tổng chi tiêu: </span>
                {typeof loyaltyModalUser.loyalty_total_spent === 'number'
                  ? loyaltyModalUser.loyalty_total_spent.toLocaleString('vi-VN') + ' đ'
                  : <span className="italic text-gray-500">Chưa có</span>}
              </div>
              <div>
                <span className="font-semibold">Số điểm tích lũy: </span>
                {typeof loyaltyModalUser.loyalty_total_points === 'number'
                  ? loyaltyModalUser.loyalty_total_points
                  : <span className="italic text-gray-500">Chưa có</span>}
              </div>
              {loyaltyModalUser.loyalty_tier?.benefits && (
                <div>
                  <span className="font-semibold">Quyền lợi: </span>
                  {loyaltyModalUser.loyalty_tier.benefits}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIndexPage;
