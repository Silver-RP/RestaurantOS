import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAllContacts, useUpdateContactStatus } from '@/hooks/useContact';
import { ContactItem } from '@/types/Contact.type';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import AdminPagination from '@/components/pages/admin/AdminPagination';
import { ToastConfigAdmin } from '@/components/common/ToastConfig';
import { FaSearch, FaEye } from 'react-icons/fa';

const ContactAdminPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [date, setDate] = useState<string>(searchParams.get('date') || '');
    const [startDate, setStartDate] = useState<string>(
        searchParams.get('startDate') || '',
    );
    const [endDate, setEndDate] = useState<string>(
        searchParams.get('endDate') || '',
    );
    const [search, setSearch] = useState<string>(searchParams.get('search') || '');
    const [subject, setSubject] = useState<string>(searchParams.get('subject') || '');
    const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
    const currentPage = useMemo(() => Number(searchParams.get('page')) || 1, [searchParams]);
    const limit = useMemo(() => Number(searchParams.get('limit')) || 12, [searchParams]);

    const { data, isLoading, error } = useAllContacts({ date, startDate, endDate, search, subject, page: currentPage, limit });
    const updateStatusMutation = useUpdateContactStatus();

    const [viewing, setViewing] = useState<ContactItem | null>(null);
    const [confirming, setConfirming] = useState<ContactItem | null>(null);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        // reset date-related params first
        ['date', 'startDate', 'endDate'].forEach((k) => params.delete(k));
        if (date) {
            params.set('date', date);
        } else {
            if (startDate) params.set('startDate', startDate);
            if (endDate) params.set('endDate', endDate);
        }
        if (subject) params.set('subject', subject); else params.delete('subject');
        params.set('page', '1');
        params.set('limit', String(limit));
        setSearchParams(params);
        setShowFilterPanel(false);
    };

    const handleSearchSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (search) params.set('search', search); else params.delete('search');
        params.set('page', '1');
        setSearchParams(params);
    };

    const resetFilters = () => {
        setDate('');
        setStartDate('');
        setEndDate('');
        setSearch('');
        setSubject('');
        setSearchParams(new URLSearchParams());
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'HH:mm - dd/MM/yyyy', { locale: vi });
        } catch {
            return 'N/A';
        }
    };

    return (
        <main className="!p-0 bg-white rounded-lg">
            <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
                <div className="w-full md:w-64 relative">
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email, SĐT..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                        className="px-3 py-2 border rounded w-full pr-9"
                    />
                    <button
                        onClick={handleSearchSubmit}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                        aria-label="Search"
                    >
                        <FaSearch size={16} />
                    </button>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setShowFilterPanel((v) => !v)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                    >
                        {showFilterPanel ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                    </button>
                </div>
            </div>

            {showFilterPanel && (
                <div className="border rounded p-4 bg-white shadow-md w-full mx-auto mb-6">
                    <h2 className="text-lg font-semibold mb-4">Bộ lọc liên hệ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Ngày cụ thể</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Từ ngày</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-3 py-2 border rounded"
                                disabled={!!date}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Đến ngày</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-3 py-2 border rounded"
                                disabled={!!date}
                                min={startDate || undefined}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Chủ đề</label>
                            <select
                                className="px-3 py-2 border rounded"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                <option value="Dịch vụ khách hàng">Dịch vụ khách hàng</option>
                                <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
                                <option value="Góp ý">Góp ý</option>
                            </select>
                        </div>
                        <div className="flex gap-2 items-end">
                            <button
                                onClick={applyFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Áp dụng
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Xoá lọc
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Đang tải dữ liệu...</span>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">Có lỗi xảy ra khi tải dữ liệu</div>
            ) : !data?.data || data.data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không có liên hệ nào</div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[1000px] w-full bg-white text-sm text-gray-700">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="px-4 py-2">No.</th>
                                <th className="px-4 py-2">Chủ đề</th>
                                <th className="px-4 py-2">Tên</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">SĐT</th>
                                <th className="px-4 py-2">Nội dung</th>
                                <th className="px-4 py-2">Ngày tạo</th>
                                <th className="px-4 py-2">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map((item: ContactItem, index: number) => (
                                <tr key={item._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 text-center">{index + 1 + (data.currentPage - 1) * (limit || 12)}</td>
                                    <td className="px-4 py-2">{item.subject}</td>
                                    <td className="px-4 py-2">
                                        {item.user?.username || item.name || 'Ẩn danh'}
                                    </td>
                                    <td className="px-4 py-2">{item.user?.email || item.email || '—'}</td>
                                    <td className="px-4 py-2">{item.phone || '—'}</td>
                                    <td className="px-4 py-2 max-w-[250px] truncate" title={item.message}>
                                        {item.message}
                                    </td>
                                    <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setViewing(item)}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                                title="Xem chi tiết"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            <button
                                                onClick={() => setConfirming(item)}
                                                className={`px-2 py-1 rounded text-xs ${item.status === 'PROCESSED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} hover:opacity-90`}
                                            >
                                                {item.status === 'PROCESSED' ? 'Đã xử lí' : 'Chưa xử lí'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {data && data.totalPages > 1 && (
                <AdminPagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    onPageChange={(page) => {
                        const newParams = new URLSearchParams(searchParams.toString());
                        newParams.set('page', String(page));
                        setSearchParams(newParams);
                    }}
                    limit={limit}
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

            {viewing && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded shadow max-w-2xl w-full p-6 relative">
                        <button
                            className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-red-600"
                            onClick={() => setViewing(null)}
                        >
                            ×
                        </button>
                        <h3 className="text-lg font-semibold mb-3">Chi tiết liên hệ</h3>
                        <div className="space-y-2 text-sm">
                            <div><strong>Chủ đề:</strong> {viewing.subject}</div>
                            <div><strong>Tên:</strong> {viewing.user?.username || viewing.name || '—'}</div>
                            <div><strong>Email:</strong> {viewing.user?.email || viewing.email || '—'}</div>
                            <div><strong>SĐT:</strong> {viewing.phone || '—'}</div>
                            <div><strong>Ngày tạo:</strong> {formatDate(viewing.createdAt)}</div>
                            <div className="pt-2">
                                <div className="font-semibold mb-1">Nội dung</div>
                                <div className="border rounded p-3 whitespace-pre-wrap break-words max-h-[60vh] overflow-auto">
                                    {viewing.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {confirming && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded shadow max-w-md w-full p-6 relative">
                        <h3 className="text-lg font-semibold mb-3">Xác nhận xử lí</h3>
                        <p className="text-sm text-gray-600 mb-5">
                            Bạn có chắc muốn đánh dấu liên hệ này là đã xử lí? Hành động này giúp theo dõi trạng thái chăm sóc khách hàng.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setConfirming(null)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                                disabled={updateStatusMutation.isPending}
                                onClick={async () => {
                                    if (!confirming) return;
                                    await updateStatusMutation.mutateAsync({ id: confirming._id, status: 'PROCESSED' });
                                    setConfirming(null);
                                }}
                            >
                                {updateStatusMutation.isPending ? 'Đang cập nhật...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastConfigAdmin />
        </main>
    );
};

export default ContactAdminPage;
