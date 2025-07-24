import React, { useEffect, useState } from 'react';
import PostReportApi, { PostReportType } from '../../../../api/PostReportApi';
import PostsApi from '../../../../api/PostsApi';
import { FiTrash2 } from 'react-icons/fi';

const ReportPostsPage = () => {
  const [reports, setReports] = useState<PostReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await PostReportApi.getAllReports();
      setReports(data);
    } catch (err: any) {
      setError('Không thể tải danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteReport = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) return;
    try {
      await PostReportApi.deleteReport(id);
      setReports(reports.filter(r => r._id !== id));
    } catch (err) {
      setError('Xóa báo cáo thất bại');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      await PostsApi.deletePost(postId);
      // Xóa tất cả báo cáo liên quan đến bài viết vừa xóa
      setReports(reports.filter(r => r.post_id?._id !== postId));
    } catch (err) {
      setError('Xóa bài viết thất bại');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo bài viết</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => window.location.href = '/admin/posts'}
          >
            Tổng quan
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="text-gray-600">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : reports.length === 0 ? (
            <div className="text-gray-600">Không có báo cáo nào.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Bài viết</th>
                  <th className="px-4 py-2">Người báo cáo</th>
                  <th className="px-4 py-2">Lý do</th>
                  <th className="px-4 py-2">Thời gian</th>
                  <th className="px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report._id}>
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-900">{report.post_id?.title || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{report.post_id?.desc || ''}</div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-900">{report.reporter_id?.username || 'Ẩn danh'}</div>
                      <div className="text-sm text-gray-500">{report.reporter_id?.email || ''}</div>
                    </td>
                    <td className="px-4 py-2">{report.reason}</td>
                    <td className="px-4 py-2">{new Date(report.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Xóa báo cáo"
                        onClick={() => handleDeleteReport(report._id)}
                      >
                        <FiTrash2 className="inline-block w-5 h-5" />
                      </button>
                      <button
                        className="text-orange-600 hover:text-orange-900"
                        title="Xóa bài viết"
                        onClick={() => handleDeletePost(report.post_id?._id)}
                        disabled={!report.post_id?._id}
                      >
                        <span className="inline-block w-5 h-5">🗑️</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPostsPage;
