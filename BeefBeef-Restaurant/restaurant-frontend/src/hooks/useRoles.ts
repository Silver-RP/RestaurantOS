import { useEffect, useState } from 'react';
import { getAllRoles, Role } from '@/api/RoleApi';

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await getAllRoles();
      setRoles(res);
    } catch (err) {
      console.error('Lỗi lấy danh sách vai trò:', err);
      setError('Không thể tải danh sách vai trò');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
  };
};