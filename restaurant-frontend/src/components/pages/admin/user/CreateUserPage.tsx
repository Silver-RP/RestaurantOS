import React from 'react';
import { createUser } from '@/api/UserApi';
import { useNavigate } from 'react-router-dom';
import CreateUserForm from './Create';
import { useRoles } from '@/hooks/useRoles';
import { toast } from 'react-toastify';

const CreateUserPage: React.FC = () => {
  const { roles, loading } = useRoles();
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await createUser(formData);
      if (res.status === 'OK') {
        toast.success(res.message || 'Thêm người dùng thành công!');
        navigate('/admin/users');
      } else {
        toast.error(res.message || 'Thêm người dùng thất bại');
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Đã xảy ra lỗi khi tạo người dùng',
      );
      console.error('Failed to create user:', error);
    }
  };

  if (loading) return <p>Đang tải danh sách role...</p>;

  return <CreateUserForm roles={roles} onSubmit={handleSubmit} />;
};

export default CreateUserPage;
