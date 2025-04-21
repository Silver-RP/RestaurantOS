import React, { useState } from 'react';
import InputComponent from '../components/pages/login/InputComponents';
import ButtonComponent from '../components/pages/login/ButtonComponents';
import { Link } from 'react-router-dom';
import { SlActionUndo } from 'react-icons/sl';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { newPassword: '', confirmPassword: '' };

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
      valid = false;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      valid = false;
    }
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Reset mật khẩu mới:', formData);
      // Thực hiện gọi API reset mật khẩu ở đây
    }
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Đặt Lại Mật Khẩu</h1>
        <p className="text-gray-300 text-sm mb-6">Nhập mật khẩu mới để tiếp tục.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputComponent
            type="password"
            value={formData.newPassword}
            placeholder="Mật khẩu mới"
            name="newPassword"
            onChange={handleChange}
          />
          {errors.newPassword && <p className="text-red-400 text-sm text-left">{errors.newPassword}</p>}

          <InputComponent
            type="password"
            value={formData.confirmPassword}
            placeholder="Xác nhận mật khẩu"
            name="confirmPassword"
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="text-red-400 text-sm text-left">{errors.confirmPassword}</p>}

          <ButtonComponent htmlType="submit" text="Xác Nhận" />
        </form>

        <div className="mt-6 text-sm text-white">
          <p className="flex items-center justify-start mt-6">
            <Link to="/login" className="flex items-center text-white hover:text-secondaryColor">
              <SlActionUndo className="mr-1 text-lg" />
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;