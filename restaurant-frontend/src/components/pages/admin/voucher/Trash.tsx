import React, { useState } from 'react';
import { useTrashVouchers, useRestoreVoucher, useForceDeleteVoucher } from '@/hooks/useVouchers';
import { Voucher } from '@/types/Voucher.type';
import AdminPagination from '../AdminPagination';
import { FaUndoAlt, FaSearch, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '@/components/common/ConfirmModal';

const Trash: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useTrashVouchers({ page, limit, search });
  const restoreVoucherMutation = useRestoreVoucher();
  const forceDeleteVoucherMutation = useForceDeleteVoucher();
  const [voucherToActOn, setVoucherToActOn] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showForceDeleteConfirm, setShowForceDeleteConfirm] = useState(false);
  const vouchers: Voucher[] = data?.docs || [];
  const totalPages = data?.totalPages || 1;
  const navigate = useNavigate();

  const handleRestoreClick = (id: string) => {
    setVoucherToActOn(id);
    setShowRestoreConfirm(true);
  };

  const handleConfirmRestore = () => {
    if (voucherToActOn) {
      restoreVoucherMutation.mutate(voucherToActOn, {
        onSuccess: () => {
          setShowRestoreConfirm(false);
          setVoucherToActOn(null);
        }
      });
    }
  };

  const handleForceDeleteClick = (id: string) => {
    setVoucherToActOn(id);
    setShowForceDeleteConfirm(true);
  };

  const handleConfirmForceDelete = () => {
    if (voucherToActOn) {
      forceDeleteVoucherMutation.mutate(voucherToActOn, {
        onSuccess: () => {
          setShowForceDeleteConfirm(false);
          setVoucherToActOn(null);
        },
      });
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1);
    }
  };

  return (
    <div>
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
              onClick={() => setPage(1)}
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
            onClick={() => navigate('/admin/vouchers')}
            className="flex px-4 py-2 gap-2 border bg-gray-100 border-gray-300 text-gray-700 rounded hover:bg-gray-200"
          >
            <FaUndoAlt size={18} />
            <span>Quay về</span>
          </button>
        </div>
      </div>
      {showRestoreConfirm && (
        <ConfirmModal
          title="Xác nhận khôi phục"
          description="Bạn có chắc chắn muốn khôi phục voucher này?"
          onConfirm={handleConfirmRestore}
          onCancel={() => setShowRestoreConfirm(false)}
        />
      )}

      {showForceDeleteConfirm && (
        <ConfirmModal
          title="XÁC NHẬN XOÁ VĨNH VIỄN"
          description="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa vĩnh viễn voucher này không?"
          onConfirm={handleConfirmForceDelete}
          onCancel={() => setShowForceDeleteConfirm(false)}
          confirmText="Xóa vĩnh viễn"
          confirmVariant="danger"
        />
      )}

      <div className="text-sm text-gray-700 mb-2">
        Hiển thị <strong>{vouchers.length}</strong> trên tổng{' '}
        <strong>{data?.totalDocs || 0}</strong> voucher đã xóa
      </div>
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : vouchers.length === 0 ? (
        <p className="text-gray-500 mt-4">Không có voucher nào bị xoá trong thùng rác.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full bg-white text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Mã</th>
                <th className="px-4 py-2">Mô tả</th>
                <th className="px-4 py-2">Loại</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngày xóa</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher, idx) => (
                <tr key={voucher._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{((page - 1) * limit) + idx + 1}</td>
                  <td className="px-4 py-2">{voucher.code}</td>
                  <td className="px-4 py-2">{voucher.description}</td>
                  <td className="px-4 py-2">{voucher.type}</td>
                  <td className="px-4 py-2">{voucher.status}</td>
                  <td className="px-4 py-2">{voucher.updated_at ? new Date(voucher.updated_at).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ''}</td>
                  <td className="px-4 py-2 flex items-center gap-4">
                    <button
                      className="relative group text-green-600 hover:text-green-800"
                      title="Khôi phục"
                      onClick={() => handleRestoreClick(voucher._id!)}
                      disabled={restoreVoucherMutation.isPending}
                    >
                      <FaUndoAlt size={16} />
                    </button>
                    <button
                      className="relative group text-red-600 hover:text-red-800"
                      title="Xóa vĩnh viễn"
                      onClick={() => handleForceDeleteClick(voucher._id!)}
                      disabled={forceDeleteVoucherMutation.isPending}
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            limit={limit}
            onLimitChange={setLimit}
            showLimit={true}
          />
        </div>
      )}
    </div>
  );
};

export default Trash; 