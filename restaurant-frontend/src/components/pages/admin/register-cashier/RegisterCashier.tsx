import React, { useState } from 'react';
import { registerCashierApi } from '@/api/CashierApi';

const RegisterCashier: React.FC = () => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !employeeId || !image) {
      setMessage('Vui lòng nhập đầy đủ thông tin và chọn ảnh!');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('employeeId', employeeId);
    formData.append('image', image);
    try {
      const res = await registerCashierApi(formData);
      setMessage(res.data.message || 'Đăng ký thành công!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Đăng ký khuôn mặt cashier</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Tên nhân viên</label>
          <input type="text" className="w-full border px-2 py-1" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Mã nhân viên</label>
          <input type="text" className="w-full border px-2 py-1" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Ảnh khuôn mặt</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
      {message && <div className="mt-4 text-red-600">{message}</div>}
    </div>
  );
};

export default RegisterCashier;
