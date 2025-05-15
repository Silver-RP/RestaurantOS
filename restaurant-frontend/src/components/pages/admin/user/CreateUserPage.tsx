import React from 'react';
import { createUser } from '@/api/UserApi';
import { useNavigate } from 'react-router-dom';
import CreateUserForm from './Create';
import { useRoles } from '@/hooks/useRoles';

const CreateUserPage: React.FC = () => {
  const { roles, loading } = useRoles();
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createUser(formData);
      navigate('/admin/users');
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  if (loading) return <p>Đang tải danh sách role...</p>;

  return (
    <CreateUserForm roles={roles} onSubmit={handleSubmit} />
  );
};

export default CreateUserPage;