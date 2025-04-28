import { useEffect, useState } from 'react';
import { CategoryResponse } from '../types/Category.type';
import { AxiosError } from 'axios';
import { fetchAllCategories } from '../api/Category';

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCategories();
        setCategories(data);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || 'Đã xảy ra lỗi khi tải danh mục';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};