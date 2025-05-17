import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';

interface RoleOption {
  value: string;
  label: string;
}

interface EditUserFormProps {
  roles: { _id: string; name: string }[];
  userData: any;
  onSubmit: (data: any) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ roles = [], userData, onSubmit }) => {
  const navigate = useNavigate();

  const roleOptions: RoleOption[] = roles.map((role) => ({
    value: role._id,
    label: role.name,
  }));

  const [username, setUsername] = useState(userData?.username || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [birthday, setBirthday] = useState(userData?.birthday?.slice(0, 10) || '');
  const [gender, setGender] = useState(userData?.gender || '');
  const [status, setStatus] = useState(userData?.status || 'inactive');
  const [isEmailVerified, setIsEmailVerified] = useState(userData?.isEmailVerified || false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(userData?.roles || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      toast.error('Vui lòng nhập đầy đủ username và email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Email không hợp lệ');
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error('Bạn cần chọn ít nhất 1 vai trò');
      return;
    }

    const data = {
      ...userData,
      username: username.trim(),
      email: email.trim(),
      phone,
      birthday,
      gender,
      status,
      isEmailVerified,
      roles: selectedRoles,
    };

    onSubmit(data);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa người dùng</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm mb-1">Tên người dùng *</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Phone & Birthday */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày sinh</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm mb-1">Giới tính</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm mb-1">Trạng thái tài khoản</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="block">Bị khóa</option>
          </select>
        </div>

        {/* Email verified */}
        <div>
          <label className="block text-sm mb-1">Xác minh email</label>
          <select
            value={isEmailVerified ? 'true' : 'false'}
            onChange={(e) => setIsEmailVerified(e.target.value === 'true')}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="false">Chưa xác minh</option>
            <option value="true">Đã xác minh</option>
          </select>
        </div>

        {/* Roles */}
        <div>
          <label className="block text-sm mb-1">Vai trò *</label>
          <Select
            isMulti
            options={roleOptions}
            value={roleOptions.filter((opt) => selectedRoles.includes(opt.value))}
            onChange={(selected) => {
              const roleIds = selected.map((opt) => opt.value);
              setSelectedRoles(roleIds);
            }}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Chọn vai trò..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
