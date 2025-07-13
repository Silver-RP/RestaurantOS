/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react';
import {
  getAllTablesApi,
  getTableByCodeApi,
  createTableApi,
  updateTableApi,
  toggleTableAvailabilityApi,
  deleteTableApi,
} from '@/api/TableApi';
import { toastService } from '@/utils/toastService';
import { ITable } from '@/types/Table.type';

export const useTables = () => {
  const getAllTables = useCallback(async () => {
    try {
      const data = await getAllTablesApi();
      console.log('📦 Fetched Tables:', data);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      toastService.error('Không thể tải danh sách bàn');
    }
  }, []);

  const getTableDetail = useCallback(async (code: string) => {
    try {
      return await getTableByCodeApi(code);
    } catch (error: any) {
      console.error('❌ getTableDetail error:', error?.response || error);
      toastService.error('Không thể tải chi tiết bàn');
    }
  }, []);

  const createTable = useCallback(async (data: Partial<ITable>) => {
    try {
      const res = await createTableApi(data);
      toastService.success('Tạo bàn mới thành công');
      return res;
    } catch (error: any) {
      console.error('❌ createTable error:', error?.response || error);
      toastService.error(error?.response?.data?.message || 'Tạo bàn thất bại');
    }
  }, []);

  const updateTable = useCallback(
    async (code: string, data: Partial<ITable>) => {
      try {
        const res = await updateTableApi(code, data);
        toastService.success('Cập nhật bàn thành công');
        return res;
      } catch (error: any) {
        console.error('❌ updateTable error:', error?.response || error);
        toastService.error(
          error?.response?.data?.message || 'Cập nhật bàn thất bại',
        );
      }
    },
    [],
  );

  const toggleAvailability = useCallback(async (code: string) => {
    try {
      const res = await toggleTableAvailabilityApi(code);
      toastService.success('Thay đổi trạng thái bàn thành công');
      return res;
    } catch (error: any) {
      console.error('❌ toggleAvailability error:', error?.response || error);
      toastService.error('Không thể thay đổi trạng thái bàn');
    }
  }, []);

  const deleteTable = useCallback(async (code: string) => {
    try {
      const res = await deleteTableApi(code);
      toastService.success('Xoá bàn thành công');
      return res;
    } catch (error: any) {
      console.error('❌ deleteTable error:', error?.response || error);
      toastService.error('Không thể xoá bàn');
    }
  }, []);

  return {
    getAllTables,
    getTableDetail,
    createTable,
    updateTable,
    toggleAvailability,
    deleteTable,
  };
};

// Enhanced hook for table management with state
export const useTableManagement = () => {
  const [tables, setTables] = useState<ITable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTables = useCallback(
    async (params?: {
      search?: string;
      sortBy?: string;
      sortOrder?: string;
      page?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllTablesApi();

        // Simple filtering and sorting (you can enhance this based on your API)
        let filteredTables = data || [];

        if (params?.search) {
          filteredTables = filteredTables.filter(
            (table: ITable) =>
              table.code.toLowerCase().includes(params.search!.toLowerCase()) ||
              table.type.toLowerCase().includes(params.search!.toLowerCase()) ||
              table.zone.toLowerCase().includes(params.search!.toLowerCase()),
          );
        }

        if (params?.sortBy) {
          filteredTables.sort((a: ITable, b: ITable) => {
            const aValue = a[params.sortBy as keyof ITable];
            const bValue = b[params.sortBy as keyof ITable];

            if (aValue === undefined || bValue === undefined) return 0;

            if (params.sortOrder === 'desc') {
              return aValue < bValue ? 1 : -1;
            }
            return aValue > bValue ? 1 : -1;
          });
        }

        setTables(filteredTables);
        setTotalPages(Math.ceil(filteredTables.length / 10)); // Assuming 10 items per page
      } catch (error: any) {
        setError('Không thể tải danh sách bàn');
        console.error('Error fetching tables:', error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const toggleAvailability = useCallback(
    async (code: string) => {
      try {
        await toggleTableAvailabilityApi(code);
        toastService.success('Thay đổi trạng thái bàn thành công');
        // Refresh the table list
        fetchTables();
      } catch (error: any) {
        toastService.error('Không thể thay đổi trạng thái bàn');
        console.error('Error toggling availability:', error);
      }
    },
    [fetchTables],
  );

  return {
    tables,
    totalPages,
    loading,
    error,
    fetchTables,
    toggleAvailability,
  };
};
