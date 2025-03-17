import React, { useState } from 'react';
import InputComponent from '../components/pages/Login/InputComponents';
import ButtonComponent from '../components/pages/Login/ButtonComponents';
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import CheckboxComponent from '../components/common/CheckboxComponents';
import { Link } from 'react-router-dom';
import { SlActionUndo } from 'react-icons/sl';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Đăng nhập</h1>
        <form onSubmit={handleSubmit}>
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
          <div className="flex justify-between items-center mt-6 mb-3">
            <CheckboxComponent 
              label="Ghi nhớ đăng nhập" 
              checked={rememberMe} 
              onChange={handleCheckboxChange} 
            />
            <Link to="#" className="text-sm text-white hover:text-secondaryColor hover:underline">Quên mật khẩu?</Link>
          </div>
          <ButtonComponent htmlType="submit" text="Đăng nhập" />
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
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="text-white underline hover:text-secondaryColor">
              Đăng ký tại đây
            </Link>
          </p>
          <p className="flex items-center justify-start mt-6">
            <Link to="/" className="flex items-center text-white hover:text-secondaryColor">
              <SlActionUndo className="mr-1 text-lg" />
              Quay lại trang chủ
            </Link>
          </p>
        </div>
      </div> 
    </div>
  );
};

export default Login;
