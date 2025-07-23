import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { getAllLoyaltyTransactions } from '@/api/LoyaltyApi';

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface LoyaltyTransaction {
  _id: string;
  account_id: string;
  order_id: string;
  points: number;
  amount: number;
  type: 'earn' | 'spend' | 'expire';
  note: string;
  created_at: string;
  user?: {
    username: string;
    email: string;
  };
}

const LoyaltyTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line
  }, [currentPage, filterType, debouncedSearchTerm]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await getAllLoyaltyTransactions({
        page: currentPage,
        limit: 20,
        search: debouncedSearchTerm,
        type: filterType === 'all' ? undefined : filterType
      });
      setTransactions(response.docs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'earn':
        return { label: 'Cộng điểm', color: 'bg-green-100 text-green-800' };
      case 'spend':
        return { label: 'Trừ điểm', color: 'bg-red-100 text-red-800' };
      case 'expire':
        return { label: 'Hết hạn', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: type, color: 'bg-gray-100 text-gray-800' };
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Lịch sử Giao dịch</h2>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
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
          
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-adminprimary focus:border-adminprimary"
            >
              <option value="all">Tất cả</option>
              <option value="earn">Cộng điểm</option>
              <option value="spend">Trừ điểm</option>
              <option value="expire">Hết hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Không có giao dịch nào
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const typeInfo = getTypeLabel(transaction.type);
                  return (
                    <tr key={transaction._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {transaction.user?.username || 'N/A'}
                          </div>
                          <div className="text-gray-500">
                            {transaction.user?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'earn' ? '+' : ''}{transaction.points} điểm
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.amount.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.note}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString('vi-VN')}
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
    </div>
  );
};

export default LoyaltyTransactions; 