import { useEffect, useState } from 'react';
import { User } from 'types/User.type';
import { useSearchParams } from 'react-router-dom';
import { getAllUsers, UserQueryParams } from '@/api/UserApi';
import { addUser } from '@/api/UserApi';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query: UserQueryParams = {
        keyword: searchParams.get('keyword') || '',
        page: Number(searchParams.get('page') || 1),
        limit: Number(searchParams.get('limit') || 12),
      };
      const res = await getAllUsers(query);
      setUsers(res.users);
      setTotalDocs(res.totalDocs);
      setTotalPages(res.totalPages);
      setPage(res.page);
      setLimit(res.limit);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchParams]);

  return {
    users,
    totalDocs,
    totalPages,
    page,
    limit,
    loading,
    error,
    searchParams,
    setSearchParams,
  };
};




export const useAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

 
  const createUser = async (
    userData: Partial<User>,
    onSuccess?: (data: User) => void
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await addUser(userData); // userData là object JSON
      if (res.status === 'OK') {
        setSuccessMessage(res.message);
        onSuccess?.(res.data);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tạo người dùng');
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    loading,
    error,
    successMessage,
  };
};