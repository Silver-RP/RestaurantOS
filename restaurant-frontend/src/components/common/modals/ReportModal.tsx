import React, { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportContent: string) => void;
  title: string;
  placeholder: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, title, placeholder }) => {
  const [reportContent, setReportContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(reportContent);
    setReportContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          rows={5}
          placeholder={placeholder}
          value={reportContent}
          onChange={(e) => setReportContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!reportContent.trim()}
          >
            Gửi báo cáo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal; 