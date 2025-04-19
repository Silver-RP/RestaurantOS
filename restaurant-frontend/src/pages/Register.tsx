import React, { useState } from 'react';
import InputComponent from '../components/pages/login/InputComponents';
import ButtonComponent from '../components/pages/login/ButtonComponents';
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { SlActionUndo } from 'react-icons/sl';

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
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Đăng ký tài khoản</h1>
        <form onSubmit={handleSubmit}>
          <InputComponent
            type="text"
            value={formData.username}
            placeholder="Tên tài khoản"
            name="username"
            onChange={handleChange}
          />
          <InputComponent
            type="email"
            value={formData.email}
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <InputComponent
            type="password"
            value={formData.password}
            placeholder="Mật khẩu"
            name="password"
            onChange={handleChange}
          />
          <InputComponent
            type="password"
            value={formData.confirmPassword}
            placeholder="Xác nhận mật khẩu"
            name="confirmPassword"
            onChange={handleChange}
          />
          <ButtonComponent htmlType="submit" text="Đăng ký" />
        </form>
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-sm text-gray-300">Hoặc đăng nhập bằng</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <div className="flex justify-center gap-8 mt-4">
          <FaFacebook className="text-facebook text-3xl cursor-pointer" />
          <FcGoogle className="text-3xl cursor-pointer" />
        </div>
        <div className="mt-6 text-sm text-white">
          <p>
            Bạn đã có tài khoản?{' '}
            <Link to="/login" className="text-white underline hover:text-secondaryColor">
              Đăng nhập tại đây
            </Link>
          </p>
          <p className="flex items-center justify-start mt-6">
            <Link to="/" className="flex items-center text-white hover:text-secondaryColor">
              <SlActionUndo className="mr-1 text-lg" />
              <SlActionUndo className="mr-1 text-lg" />
              Quay lại trang chủ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
