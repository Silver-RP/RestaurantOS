import React, { useState } from 'react';
import InputComponent from '../components/Login/InputComponents';
import ButtonComponent from '../components/Login/ButtonComponents';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Cập nhật chính xác trường dựa trên name
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-screen h-screen">
      <div className="p-6 text-center bg-black bg-opacity-80 rounded-lg shadow-lg w-4/12 h-4/5">
        <h1 className="text-white font-bold text-3xl mb-6">Đăng ký tài khoản</h1>
        <form onSubmit={handleSubmit}>
          <InputComponent
            type='text'
            value={formData.username}
            placeholder="Tên tài khoản"
            name="username"
            onChange={handleChange}
          />
          <InputComponent
            value={formData.email}
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <InputComponent
            value={formData.password}
            placeholder="Mật khẩu"
            name="password"
            onChange={handleChange}
          />
          <InputComponent
            value={formData.confirmPassword}
            placeholder="Xác nhận mật khẩu"
            name="confirmPassword"
            onChange={handleChange}
          />
          <ButtonComponent htmlType="submit" text="Đăng ký" />
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-sm text-gray-300">Hoặc đăng nhập bằng</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
