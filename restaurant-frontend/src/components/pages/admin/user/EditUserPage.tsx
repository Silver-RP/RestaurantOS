import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoles } from '@/hooks/useRoles';
import { useUpdateUser } from '@/hooks/useUsers';
import { toast } from 'react-toastify';
import EditUserForm from './Edit';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchUserById } from '@/redux/feature/user/userAction';
import { useAppDispatch } from '@/redux/hook';

const EditUserPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { roles, loading: rolesLoading } = useRoles();
  const selectedUser = useSelector(
    (state: RootState) => state.user.selectedUser,
  );
  console.log('selectedUser', selectedUser);

  const currentUser = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);
  const { updateUser } = useUpdateUser();

  useEffect(() => {
    if (id) dispatch(fetchUserById({ userId: id }));
  }, [id, dispatch]);

  const handleUpdateUser = async (data: any) => {
    try {
      const updated = await updateUser(id!, data);
      if (updated) {
        toast.success('Cập nhật người dùng thành công!');
        navigate('/admin/users');
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Lỗi khi cập nhật người dùng',
      );
    }
  };

  const getRoleNames = (roleArray: any[], roleMap: any[]) => {
    return Array.isArray(roleArray)
      ? roleArray.map((r) => {
          if (typeof r === 'string') {
            const found = roleMap.find((role) => role._id === r);
            return found?.name ?? r;
          }
          return r.name;
        })
      : [];
  };
  const currentRoles = getRoleNames(currentUser?.roles || [], roles);
  const selectedRoles = getRoleNames(selectedUser?.roles || [], roles);

  const isSuperadmin = currentRoles.includes('superadmin');
  const isManager = currentRoles.includes('manager');

  const isEditingSelf = currentUser?._id === selectedUser?._id;

  const isEditingSuperadmin = selectedRoles.includes('superadmin');
  const isEditingManager = selectedRoles.includes('manager');

  const isNotAllowedToEdit =
    (!isSuperadmin && isEditingSuperadmin) ||
    (isManager && (isEditingManager || isEditingSuperadmin)) ||
    (!isSuperadmin && !isManager);

  if (loading || rolesLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!selectedUser) return <p>Không tìm thấy người dùng.</p>;
  if (isNotAllowedToEdit)
    return (
      <p className="text-red-500">
        Bạn không có quyền chỉnh sửa người dùng này.
      </p>
    );
  console.log('isNotAllowedToEdit', isNotAllowedToEdit);
  return (
    <EditUserForm
      roles={roles}
      userData={selectedUser}
      onSubmit={handleUpdateUser}
      disableRoleAndStatus={isSuperadmin && isEditingSelf}
    />
  );
};

export default EditUserPage;
