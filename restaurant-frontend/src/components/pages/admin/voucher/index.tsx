import React, { useState } from 'react';
import { useVouchers, useDeleteVoucher } from '../../../../hooks/useVouchers';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSort, FaArrowUp, FaSearch, FaEdit, FaEye } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import ConfirmModal from '../../../common/ConfirmModal';
import AdminPagination from '../AdminPagination';

const VoucherDetailModal = ({ open, onClose, voucher }: { open: boolean, onClose: () => void, voucher: any }) => {
  if (!open || !voucher) return null;
  const getTypeLabel = (type: string) => {
    if (type === 'public') return 'Công khai';
    if (type === 'private') return 'Riêng tư';
    if (type === 'gift') return 'Quà tặng';
    return type;
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Chi tiết Voucher</h2>
        <div className="space-y-2 text-sm">
          <div><b>Mã:</b> {voucher.code}</div>
          <div><b>Loại:</b> {getTypeLabel(voucher.type)}</div>
          <div><b>Mô tả:</b> {voucher.description || 'Không có'}</div>
          <div><b>Loại giảm giá:</b> {voucher.discount_type === 'percent' ? 'Phần trăm' : 'Số tiền cố định'}</div>
          <div><b>Giá trị giảm giá:</b> {voucher.discount_type === 'percent' ? `${voucher.discount_value}%` : `${voucher.discount_value?.toLocaleString()} VNĐ`}</div>
          <div><b>Giảm tối đa:</b> {voucher.max_discount_value ? `${voucher.max_discount_value.toLocaleString()} VNĐ` : '-'}</div>
          <div><b>Đơn hàng tối thiểu:</b> {voucher.min_order_value ? `${voucher.min_order_value.toLocaleString()} VNĐ` : '-'}</div>
          <div><b>Số lượng:</b> {voucher.quantity}</div>
          <div><b>Đã dùng:</b> {voucher.used}</div>
          <div><b>Ngày bắt đầu:</b> {voucher.start_date ? new Date(voucher.start_date).toLocaleDateString() : '-'}</div>
          <div><b>Ngày kết thúc:</b> {voucher.end_date ? new Date(voucher.end_date).toLocaleDateString() : '-'}</div>
          <div><b>Trạng thái:</b> {voucher.status === 'active' ? 'Hoạt động' : voucher.status === 'inactive' ? 'Chưa hoạt động' : voucher.status === 'expired' ? 'Hết hạn' : 'Hết lượt'}</div>
        </div>
      </div>
    </div>
  );
};

const VoucherList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  const params = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 12,
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    status: searchParams.get('status') as 'active' | 'inactive' | 'expired' | 'out_of_stock' || undefined,
    discount_type: searchParams.get('discount_type') as 'percent' | 'fixed' || undefined,
  };

  const { data: vouchers, isLoading, isError } = useVouchers(params);
  const deleteVoucherMutation = useDeleteVoucher();

  const handleSort = (field: string) => {
    const newSortOrder = params.sort === field ? '' : field;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newSortOrder) {
      newSearchParams.set('sort', newSortOrder);
    } else {
      newSearchParams.delete('sort');
    }
    setSearchParams(newSearchParams);
  };

  const getSortIcon = (field: string) => {
    if (params.sort === field) {
      return <FaArrowUp />;
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
          setShowConfirm(false);
          setVoucherToDelete(null);
        },
        onError: () => {
          setShowConfirm(false);
          setVoucherToDelete(null);
        },
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không có';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getTypeLabel = (type: string) => {
    if (type === 'public') return 'Công khai';
    if (type === 'private') return 'Riêng tư';
    if (type === 'gift') return 'Quà tặng';
    return type;
  };

  return (
    <div >
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
          <button
            onClick={() => navigate('/admin/vouchers/trash')}
            className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2 hover:bg-red-700"
          >
            <FiTrash2 /> ĐÃ XOÁ
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Xác nhận xoá"
          description={`Bạn có chắc chắn muốn xoá voucher "${vouchers?.docs.find(v => v._id === voucherToDelete)?.code || 'này'}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <VoucherDetailModal open={showDetail} onClose={() => setShowDetail(false)} voucher={selectedVoucher} />

      <div className="text-sm text-gray-700 mb-2">
        Hiển thị <strong>{vouchers?.docs.length || 0}</strong> trên tổng{' '}
        <strong>{vouchers?.totalDocs || 0}</strong> voucher
      </div>

      {isLoading ? (
        <p className="text-center text-lg font-semibold">Đang tải dữ liệu...</p>
      ) : isError ? (
        <p className="text-red-500 text-center">Có lỗi xảy ra khi tải dữ liệu voucher.</p>
      ) : vouchers?.docs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Không có voucher nào</p>         
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1000px] w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 text-left">No.</th>
                  <th className="px-4 py-2 text-left">Mã</th>
                  <th className="px-4 py-2 text-left">Loại</th>
                  <th className="px-4 py-2 text-left">Mô tả</th>
                  <th className="px-4 py-2 text-left">Giảm giá</th>
                  <th className="px-4 py-2 text-left">Số lượng</th>
                  <th className="px-4 py-2 text-left">Ngày bắt đầu</th>
                  <th className="px-4 py-2 text-left">Ngày kết thúc</th>
                  <th className="px-4 py-2 text-left">Trạng thái</th>
                  <th className="px-4 py-2 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {vouchers?.docs.map((voucher, idx) => (
                  <tr key={voucher._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{((vouchers.page - 1) * vouchers.limit) + idx + 1}</td>
                    <td className="px-4 py-2">{voucher.code}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        voucher.type === 'public' 
                          ? 'bg-green-100 text-green-800' 
                          : voucher.type === 'gift'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getTypeLabel(voucher.type)}
                      </span>
                    </td>
                    <td className="px-4 py-2">{voucher.description}</td>
                    <td className="px-4 py-2">
                      {voucher.discount_type === 'percent' ? 'Phần trăm' : 'Số tiền cố định'}<br />
                      {voucher.discount_type === 'percent'
                        ? `${voucher.discount_value}%`
                        : `${voucher.discount_value.toLocaleString()} VNĐ`}
                    </td>
                    <td className="px-4 py-2">{voucher.quantity}</td>
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
                    <td className="px-4 py-2 space-x-2 flex items-center">
                      <button
                        className="text-gray-600 hover:text-blue-600"
                        title="Xem chi tiết"
                        onClick={() => { setSelectedVoucher(voucher); setShowDetail(true); }}
                      >
                        <FaEye className="text-lg" />
                      </button>
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

          {vouchers && vouchers.totalDocs > vouchers.limit && (
            <AdminPagination
              currentPage={vouchers.page}
              totalPages={vouchers.totalPages}
              onPageChange={(page) => {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.set('page', String(page));
                setSearchParams(newParams);
              }}
              limit={Number(searchParams.get('limit') || 12)}
              onLimitChange={(newLimit) => {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  newParams.set('limit', newLimit.toString());
                  newParams.delete('page');
                  return newParams;
                });
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VoucherList; 