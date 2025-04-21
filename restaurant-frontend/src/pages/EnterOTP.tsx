import React, { useState } from 'react';
import InputComponent from '../components/pages/login/InputComponents';
import ButtonComponent from '../components/pages/login/ButtonComponents';
import { Link } from 'react-router-dom';
import { SlActionUndo } from 'react-icons/sl';

const EnterOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Vui lòng nhập mã OTP');
      return;
    }
    console.log('Mã OTP nhập:', otp);
    // Gọi API xác thực OTP ở đây
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Xác Thực OTP</h1>
        <p className="text-gray-300 text-sm mb-6">
          Vui lòng nhập mã OTP được gửi đến email của bạn.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputComponent
            type="text"
            value={otp}
            placeholder="Nhập mã OTP"
            name="otp"
            onChange={(e) => {
              setOtp(e.target.value);
              setError('');
            }}
          />
          {error && <p className="text-red-400 text-sm text-left">{error}</p>}

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

export default EnterOTP;