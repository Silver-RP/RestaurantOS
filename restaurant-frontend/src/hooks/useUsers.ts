import { useEffect, useState } from 'react';
import { User } from 'types/User.type';
import { useSearchParams } from 'react-router-dom';
import { getAllUsers, UserQueryParams } from '@/api/UserApi';

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