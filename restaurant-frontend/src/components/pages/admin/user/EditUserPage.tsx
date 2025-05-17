import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoles } from '@/hooks/useRoles';
import { useUserDetail, useUpdateUser } from '@/hooks/useUsers';
import { toast } from 'react-toastify';
import EditUserForm from './EditUserForm'; 

const EditUserPage: React.FC = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { roles, loading: rolesLoading } = useRoles();
  const { user, loading: userLoading, error } = useUserDetail(id || '');
  const { updateUser } = useUpdateUser();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleUpdateUser = async (data: any) => {
    try {
      await updateUser(id!, data);
      toast.success('Cập nhật người dùng thành công!');
      navigate('/admin/users');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi cập nhật người dùng');
    }
  };

  if (userLoading || rolesLoading) return <p>Đang tải dữ liệu...</p>;
  if (!user) return <p>Không tìm thấy người dùng.</p>;

  return (
    <EditUserForm
      roles={roles}
      userData={user}
      onSubmit={handleUpdateUser}
    />
  );
};

export default EditUserPage;
