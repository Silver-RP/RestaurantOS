import { useAddUser } from '@/hooks/useUsers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';

interface RoleOption {
  value: string;
  label: string;
}

interface CreateUserFormProps {
  roles: { _id: string; name: string }[];
  onSubmit: (formData: FormData) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ roles = [] }) => {
  const navigate = useNavigate();
  const { createUser, loading, error } = useAddUser();

  const roleOptions: RoleOption[] = roles.map((role) => ({
    value: role._id,
    label: role.name,
  }));

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('inactive');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // VALIDATION
    if (!username.trim() || !email.trim() || !password) {
      toast.error('Vui lòng nhập đầy đủ username, email và mật khẩu');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      toast.error('Email không hợp lệ');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không đúng');
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error('Bạn cần chọn ít nhất 1 vai trò');
      return;
    }

    // GỬI FORM
    const formData = new FormData();
    formData.append('username', username.trim());
    formData.append('email', email.trim());
    formData.append('password', password);
    formData.append('phone', phone);
    formData.append('birthday', birthday);
    formData.append('gender', gender);
    formData.append('status', status);
    formData.append('isEmailVerified', isEmailVerified.toString());
    selectedRoles.forEach((roleId) => formData.append('roles', roleId));
    console.log("formData", formData);
    
    createUser(formData, () => {
      toast.success('Thêm người dùng thành công!');
      navigate('/admin/users');
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Thêm người dùng mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm mb-1">
            Tên người dùng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm mb-1">
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full border px-3 py-2 rounded ${passwordError ? 'border-red-500' : ''}`}
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
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
          <label className="block text-sm mb-1">
            Vai trò <span className="text-red-500">*</span>
          </label>
          <Select
            isMulti
            options={roleOptions}
            value={roleOptions.filter((opt) =>
              selectedRoles.includes(opt.value)
            )}
            onChange={(selected) => {
              const roleIds = selected.map((opt) => opt.value);
              setSelectedRoles(roleIds);
            }}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Chọn vai trò..."
          />
        </div>

        {/* Submit button */}
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
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Đang lưu...' : 'Lưu người dùng'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
