import React, { useState } from 'react';
import InputComponent from '../components/pages/login/InputComponents';
import ButtonComponent from '../components/pages/login/ButtonComponents';
import { Link } from 'react-router-dom';
import { SlActionUndo } from 'react-icons/sl';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Gửi OTP tới email:', email);
    // Thực hiện gửi OTP tại đây
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Quên Mật Khẩu</h1>
        <p className="text-gray-300 text-sm mb-6">
          Nhập email của bạn để nhận mã OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputComponent
            type="email"
            value={email}
            placeholder="Nhập Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <ButtonComponent htmlType="submit" text="Gửi Yêu Cầu" />
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

export default ForgotPassword;