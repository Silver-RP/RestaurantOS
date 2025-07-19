/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaEye } from 'react-icons/fa';
import { useReservations } from '../../../../hooks/useReservations';
import AdminPagination from '../AdminPagination';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ReservationDetailModal from './ReservationDetail';

const ReservationTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const { getAllReservations } = useReservations();
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllReservations();
      setReservations(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [getAllReservations]);

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (search) newParams.set('keyword', search);
    else newParams.delete('keyword');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const formatDate = (date: string, time: string) => {
    try {
      return `${time} - ${format(new Date(date), 'dd/MM/yyyy', { locale: vi })}`;
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <main className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Tìm khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="px-4 py-2 border rounded-md w-full"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : !reservations?.length ? (
        <p className="text-gray-500">Không có đơn đặt bàn nào</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">STT</th>
                <th className="px-4 py-2">Tên khách</th>
                <th className="px-4 py-2">SĐT</th>
                <th className="px-4 py-2">Ngày giờ</th>
                <th className="px-4 py-2">Loại bàn</th>
                <th className="px-4 py-2">Số người</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ghi chú</th>
                <th className="px-4 py-2">Phương thức</th>
                <th className="px-4 py-2">Trạng thái thanh toán</th>
                <th className="px-4 py-2">Số tiền cọc</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r: any, index: number) => (
                <tr key={r._id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{r.full_name}</td>
                  <td className="px-4 py-2">{r.phone}</td>
                  <td className="px-4 py-2">{formatDate(r.date, r.time)}</td>
                  <td className="px-4 py-2">{r.table_type}</td>
                  <td className="px-4 py-2">{r.number_of_people}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : r.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600 italic max-w-[200px] truncate">
                    {r.note || '-'}
                  </td>
                  <td className="px-4 py-2">{r.payment_method || '-'}</td>
                  <td className="px-4 py-2">
                    {(() => {
                      switch (r.payment_status) {
                        case 'PAID':
                          return (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                              Đã thanh toán
                            </span>
                          );
                        case 'UNPAID':
                          return (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                              Chưa thanh toán
                            </span>
                          );
                        case 'FAILED':
                          return (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                              Thất bại
                            </span>
                          );
                        case 'REFUNDED':
                          return (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                              Đã hoàn tiền
                            </span>
                          );
                        default:
                          return '-';
                      }
                    })()}
                  </td>
                  <td className="px-4 py-2">
                    {r.deposit_amount
                      ? r.deposit_amount.toLocaleString('vi-VN') + '₫'
                      : '-'}
                  </td>

                  <button
                    onClick={() => setSelectedReservationId(r._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye />
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminPagination
        currentPage={currentPage}
        totalPages={5} // TODO: dynamic total pages
        onPageChange={(page) => {
          setCurrentPage(page);
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set('page', String(page));
          setSearchParams(newParams);
        }}
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set('limit', String(newLimit));
          newParams.set('page', '1');
          setSearchParams(newParams);
        }}
      />
      {selectedReservationId && (
        <ReservationDetailModal
          reservationId={selectedReservationId}
          open={true}
          onClose={() => setSelectedReservationId(null)}
          onUpdated={() => {
            setSelectedReservationId(null);
            fetchData();
          }}
        />
      )}
    </main>
  );
};

export default ReservationTable;
