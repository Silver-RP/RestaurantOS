/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { User } from 'types/User.type';
import { useSearchParams } from 'react-router-dom';
import {
  getAllUsers,
  filterUsers,
  updateUserInfoAPI,
  UserQueryParams,
  FilterUserParams,
} from '@/api/UserApi';
import { addUser } from '@/api/UserApi';
import { checkUserPassword as checkPasswordAPI } from '@/api/UserApi';
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!searchParams.get('limit')) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('limit', '12');
      setSearchParams(newParams);
    }
  }, []);
  useEffect(() => {
    const limitParam = Number(searchParams.get('limit') || 12);
    if (limit !== limitParam) {
      setLimit(limitParam);
    }
  }, [searchParams]);
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const keyword = searchParams.get('keyword') || '';
      const page = Number(searchParams.get('page') || 1);
      const limit = Number(searchParams.get('limit') || 12);

      // Kiểm tra có dùng filter nâng cao không
      const hasFilter =
        searchParams.get('role') ||
        searchParams.get('gender') ||
        searchParams.get('status') ||
        searchParams.get('isVerified') ||
        searchParams.get('birthdayFrom') ||
        searchParams.get('birthdayTo');

      if (hasFilter) {
        const query: FilterUserParams = {};
        for (const [key, value] of searchParams.entries()) {
          if (value !== '') query[key as keyof FilterUserParams] = value;
        }

        const res = await filterUsers(query);
        setUsers(res.users);
        setTotalDocs(res.totalDocs);
        setTotalPages(res.totalPages);
        setPage(res.page);
        setLimit(res.pageSize);
      } else {
        const sort = searchParams.get('sort') || '';
        const order = searchParams.get('order') || '';
        const query: UserQueryParams = { keyword, page, limit, sort, order };
        const res = await getAllUsers(query);
        setUsers(res.users);
        setTotalDocs(res.totalDocs);
        setTotalPages(res.totalPages);
        setPage(res.page);
        setLimit(res.limit);
      }
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
    fetchUsers,
  };
};

export const useAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createUser = async (
    userData: Partial<User>,
    onSuccess?: (data: User) => void,
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

export const useCheckPassword = () => {
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkPassword = async (
    userId: string,
    password: string,
    onSuccess?: (match: boolean) => void,
  ) => {
    setLoading(true);
    setError(null);
    setMatch(null);

    try {
      const res = await checkPasswordAPI(userId, password);
      setMatch(res.match);
      onSuccess?.(res.match);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Lỗi kiểm tra mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return {
    checkPassword,
    match,
    loading,
    error,
  };
};

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserById = async (userId: string, data: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateUserInfoAPI(userId, data);
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi cập nhật người dùng');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser: updateUserById,
    loading,
    error,
  };
};
