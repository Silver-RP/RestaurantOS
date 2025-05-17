/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Category, CategoryResponse, CategoryCreatePayload  } from '../types/Category.type';
import { AxiosError } from 'axios';
import { deleteCategory, fetchAllCategories, fetchCategoryById, updateCategory } from '../api/CategoryApi';
import { addCategory } from '@/api/CategoryApi';
import { toast } from 'react-toastify';



export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCategories();
      setCategories(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        'Đã xảy ra lỗi khi tải danh mục';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  loadCategories();
}, [setCategories]); 

  return {
    categories,
    loading,
    error,
    refetch: loadCategories, 
    setCategories
  };
};

export const useCategoryDetail = (id: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const data = await fetchCategoryById(id);
        setCategory(data);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || 'Không thể tải danh mục';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadCategory();
  }, [id]);

  return { category, loading, error };
};

export const useAddCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addNewCategory = async (
    data: CategoryCreatePayload,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      
      const formData = new FormData();
      formData.append('Cate_name', data.Cate_name);
      formData.append('Cate_slug', data.Cate_slug);
      formData.append('Cate_type', data.Cate_type);

      if (data.parentCate) {
        formData.append('parentCate', data.parentCate);
      }

      if (data.Cate_img) {
          formData.append('Cate_img', data.Cate_img);
      }

      const res = await addCategory(formData);
      setSuccessMessage(res.message ?? null);
      onSuccess?.();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Đã xảy ra lỗi khi thêm danh mục';
      setError(message);
         toast.error(message); 
    } finally {
      setLoading(false);
    }
  };

  return {
    addNewCategory,
    loading,
    error,
    successMessage,
  };
};

export const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateExistingCategory = async (
    id: string,
    data: CategoryCreatePayload,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('Cate_name', data.Cate_name);
      formData.append('Cate_slug', data.Cate_slug);
      formData.append('Cate_type', data.Cate_type);

      if (data.parentCate) {
        formData.append('parentCate', data.parentCate);
      }

      if (data.Cate_img instanceof File) {
        formData.append('Cate_img', data.Cate_img);
      }

      const res = await updateCategory(id, formData);
      setSuccessMessage(res.message);
      onSuccess?.();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật danh mục';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { updateExistingCategory, loading, error, successMessage };
};

export const useDeleteCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDeleteCategory = async (
    id: string,
    options?: {
      onSuccess?: () => void;
      refetch?: () => void;
    }
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await deleteCategory(id);
      setSuccessMessage(res.message);

      if (options?.refetch) options.refetch(); 
      if (options?.onSuccess) options.onSuccess(); 
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Lỗi khi xoá danh mục';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDeleteCategory,
    loading,
    error,
    successMessage,
  };
};