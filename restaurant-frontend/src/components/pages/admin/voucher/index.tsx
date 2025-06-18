import React, { useState } from 'react';
import { useVouchers, useDeleteVoucher } from '../../../../hooks/useVouchers';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSort, FaArrowUp, FaArrowDown, FaSearch, FaEdit } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../common/ConfirmModal'; // Assuming you have a ConfirmModal component

const VoucherList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null);

  const { data: vouchers, isLoading, isError } = useVouchers();
  const deleteVoucherMutation = useDeleteVoucher();

  const sortField = searchParams.get('sortField') || 'code';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  const handleSort = (field: string) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('sortField', field);
    newSearchParams.set('sortOrder', newSortOrder);
    setSearchParams(newSearchParams);
  };

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      if (sortOrder === 'asc') return <FaArrowUp />;
      return <FaArrowDown />;
    }
    return <FaSort />;
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (search) {
        newSearchParams.set('search', search);
      } else {
        newSearchParams.delete('search');
      }
      newSearchParams.set('page', '1');
      setSearchParams(newSearchParams);
    }
  };

  const handleDeleteClick = (id: string) => {
    setVoucherToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (voucherToDelete) {
      deleteVoucherMutation.mutate(voucherToDelete, {
        onSuccess: () => {
          toast.success('Xóa voucher thành công!');
          setShowConfirm(false);
          setVoucherToDelete(null);
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || 'Xóa voucher thất bại!');
          setShowConfirm(false);
          setVoucherToDelete(null);
        },
      });
    }
  };

  const filteredVouchers = vouchers?.filter(voucher =>
    voucher.code.toLowerCase().includes(search.toLowerCase()) ||
    voucher.description?.toLowerCase().includes(search.toLowerCase()) ||
    voucher.discount_type.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sortField === 'code') {
      return sortOrder === 'asc' ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
    }
    // Add more sorting logic for other fields if needed
    return 0;
  }) || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không có';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex gap-4 ">
          <div className="w-96 relative">
            <input
              type="text"
              placeholder="Tìm voucher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="px-4 py-2 border rounded-md w-full"
            />
            <button
              onClick={() => handleSearch({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              aria-label="Search"
              type="button"
            >
              <FaSearch size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate('/admin/vouchers/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Thêm Voucher
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Xác nhận xoá"
          description={`Bạn có chắc chắn muốn xoá voucher "${filteredVouchers.find(v => v._id === voucherToDelete)?.code || 'này'}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="text-sm text-gray-700 mb-2">
        Hiển thị <strong>{filteredVouchers.length}</strong> trên tổng{' '}
        <strong>{vouchers?.length || 0}</strong> voucher
      </div>

      {isLoading ? (
        <p className="text-center text-lg font-semibold">Đang tải dữ liệu...</p>
      ) : isError ? (
        <p className="text-red-500 text-center">Có lỗi xảy ra khi tải dữ liệu voucher.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full bg-white text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2 cursor-pointer whitespace-nowrap" onClick={() => handleSort('code')}>
                  <span className="flex items-center gap-1">
                    Mã Voucher {getSortIcon('code')}
                  </span>
                </th>
                <th className="px-4 py-2">Mô tả</th>
                <th className="px-4 py-2">Loại giảm giá</th>
                <th className="px-4 py-2">Giá trị giảm</th>
                <th className="px-4 py-2">Giảm tối đa</th>
                <th className="px-4 py-2">Đơn tối thiểu</th>
                <th className="px-4 py-2">Số lượng</th>
                <th className="px-4 py-2">Đã dùng</th>
                <th className="px-4 py-2">Ngày bắt đầu</th>
                <th className="px-4 py-2">Ngày kết thúc</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.map((voucher, index) => (
                <tr key={voucher._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{voucher.code}</td>
                  <td className="px-4 py-2">{voucher.description || 'N/A'}</td>
                  <td className="px-4 py-2">{voucher.discount_type === 'percent' ? 'Phần trăm' : 'Số tiền cố định'}</td>
                  <td className="px-4 py-2">{voucher.discount_value.toLocaleString()}
                    {voucher.discount_type === 'percent' ? '%' : ' VNĐ'}
                  </td>
                  <td className="px-4 py-2">{voucher.max_discount_value?.toLocaleString() || 'N/A'}</td>
                  <td className="px-4 py-2">{voucher.min_order_value?.toLocaleString() || 'N/A'}</td>
                  <td className="px-4 py-2">{voucher.quantity}</td>
                  <td className="px-4 py-2">{voucher.used}</td>
                  <td className="px-4 py-2">{formatDate(voucher.start_date)}</td>
                  <td className="px-4 py-2">{formatDate(voucher.end_date)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      voucher.status === 'active' ? 'bg-green-100 text-green-800' :
                      voucher.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      voucher.status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {voucher.status === 'active' ? 'Hoạt động' :
                       voucher.status === 'inactive' ? 'Chưa hoạt động' :
                       voucher.status === 'expired' ? 'Hết hạn' :
                       'Hết lượt'}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="relative group text-blue-500 hover:underline"
                      onClick={() => navigate(`/admin/vouchers/edit/${voucher._id}`)}
                      title="Chỉnh sửa"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      className="relative group text-red-500 hover:underline"
                      onClick={() => handleDeleteClick(voucher._id!)}
                      title="Xoá"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VoucherList; 