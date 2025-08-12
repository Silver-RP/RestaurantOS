import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { toast } from 'react-toastify';

interface FaceScanModalProps {
  onClose: () => void;
  onVerified?: (data: { shift: string; action: string; verifiedAt: string }) => void;
}

const FaceScanModal: React.FC<FaceScanModalProps> = ({ onClose, onVerified }) => {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const captureAndVerify = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      toast.error('Không lấy được ảnh từ webcam!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], 'face.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('http://127.0.0.1:4000/api/auth_cashier/verify_face', formData);
      setResult(response.data.message || 'Xác thực thành công!');
      toast.success(response.data.message || 'Xác thực thành công!');
      // Chỉ đóng popup khi xác thực thành công
      if (response.data.success) {
        setTimeout(() => {
          onClose();
          if (onVerified) {
            onVerified({
              shift: response.data.shift,
              action: response.data.action,
              verifiedAt: response.data.verifiedAt,
            });
          }
        }, 800);
      }
    } catch (err: any) {
      setResult(err.response?.data?.message || 'Xác thực thất bại!');
      toast.error(err.response?.data?.message || 'Xác thực thất bại!');
      // Không đóng popup nếu xác thực thất bại
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        {/* Chỉ hiển thị nút đóng khi chưa xác thực hoặc đã xác thực thành công */}
        {(!result || (result && result.toLowerCase().includes('thành công'))) && (
          <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>×</button>
        )}
        <h2 className="text-lg font-bold mb-4">Quét khuôn mặt xác thực</h2>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          className="w-full h-64 mb-4 rounded border"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={captureAndVerify}
          disabled={loading}
        >
          {loading ? 'Đang xác thực...' : 'Quét & Xác thực'}
        </button>
        {result && <div className="mt-4 text-center text-red-600">{result}</div>}
      </div>
    </div>
  );
};

export default FaceScanModal;
