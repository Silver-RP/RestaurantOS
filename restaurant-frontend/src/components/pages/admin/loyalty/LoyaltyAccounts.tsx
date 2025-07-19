import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaEye, FaEdit } from 'react-icons/fa';
import { getAllLoyaltyAccounts, updateLoyaltyAccount } from '@/api/LoyaltyApi';

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const tierOptions = [
  { value: 'new', label: 'Mới', color: '#6B7280' },
  { value: 'bronze', label: 'Đồng', color: '#CD7F32' },
  { value: 'silver', label: 'Bạc', color: '#C0C0C0' },
  { value: 'gold', label: 'Vàng', color: '#FFD700' },
  { value: 'diamond', label: 'Kim cương', color: '#B9F2FF' },
];

interface LoyaltyAccount {
  _id: string;
  user_id: string;
  total_points: number;
  total_spent: number;
  current_tier?: {
    _id: string;
    tier_name: 'new' | 'bronze' | 'silver' | 'gold' | 'diamond';
    min_spent: number;
    discount: number;
    benefits?: string;
    sort_order: number;
    is_active?: boolean;
  };
  yearly_spending: Record<string, number>;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    email: string;
    full_name?: string;
  };
}

const LoyaltyAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<LoyaltyAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<LoyaltyAccount | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<{ total_points?: string }>({});
  const [editingAccount, setEditingAccount] = useState<LoyaltyAccount | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    loadAccounts();
    // eslint-disable-next-line
  }, [currentPage, debouncedSearchTerm]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await getAllLoyaltyAccounts({
        page: currentPage,
        limit: 20,
        search: debouncedSearchTerm
      });
      setAccounts(response.docs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast.error('Không thể tải danh sách tài khoản loyalty');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (account: LoyaltyAccount) => {
    setSelectedAccount(account);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (account: LoyaltyAccount) => {
    setEditingAccount(account);
    setEditForm({
      total_points: account.total_points.toString(),
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    if (!editingAccount) return;
    try {
      await updateLoyaltyAccount(editingAccount._id, {
        total_points: Number(editForm.total_points),
      });
      toast.success('Cập nhật tài khoản thành công');
      setIsEditModalOpen(false);
      setEditingAccount(null);
      loadAccounts();
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const getCurrentYearSpending = (account: LoyaltyAccount) => {
    const currentYear = new Date().getFullYear().toString();
    return account.yearly_spending[currentYear] || 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Tài khoản Loyalty</h2>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo username, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-adminprimary focus:border-adminprimary"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạng Hiện Tại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm Tích Lũy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng Chi Tiêu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chi Tiêu Năm {new Date().getFullYear()}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày cập nhật hạng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Không có tài khoản nào
                  </td>
                </tr>
              ) : (
                accounts.map((account) => {
                  const tierInfo = tierOptions.find(option => option.value === account.current_tier?.tier_name);
                  return (
                    <tr key={account._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {account.user?.username || 'N/A'}
                          </div>
                          <div className="text-gray-500">
                            {account.user?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: tierInfo?.color || '#3B82F6' }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {tierInfo?.label || account.current_tier?.tier_name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium text-green-600">
                          {account.total_points.toLocaleString()} điểm
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.total_spent.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getCurrentYearSpending(account).toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.updated_at ? new Date(account.updated_at).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(account)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(account)}
                          className="text-green-600 hover:text-green-900"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-adminprimary text-white border-adminprimary'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </nav>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết Tài khoản Loyalty
                </h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAccount.user?.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAccount.user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hạng hiện tại</label>
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: selectedAccount.current_tier?.color || '#3B82F6' }}
                      />
                      <span className="text-sm text-gray-900">{selectedAccount.current_tier?.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Điểm tích lũy</label>
                    <p className="mt-1 text-sm text-gray-900 font-medium text-green-600">
                      {selectedAccount.total_points.toLocaleString()} điểm
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tổng chi tiêu</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedAccount.total_spent.toLocaleString()}đ
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chi tiêu năm {new Date().getFullYear()}</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {getCurrentYearSpending(selectedAccount).toLocaleString()}đ
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chi tiêu theo năm</label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {Object.entries(selectedAccount.yearly_spending).map(([year, amount]) => (
                      <div key={year} className="flex justify-between text-sm">
                        <span className="text-gray-600">Năm {year}:</span>
                        <span className="text-gray-900 font-medium">{amount.toLocaleString()}đ</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">              
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày cập nhật hạng</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedAccount.updated_at ? new Date(selectedAccount.updated_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingAccount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chỉnh sửa tài khoản Loyalty</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Điểm tích lũy</label>
                  <input
                    type="number"
                    name="total_points"
                    value={editForm.total_points}
                    onChange={handleEditFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditingAccount(null); }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-adminprimary text-white rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyAccounts; 