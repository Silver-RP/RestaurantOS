import React from 'react';
import InputComponent from '../components/Login/InputComponents';
import ButtonComponent from '../components/Login/ButtonComponents';
import FormComponent from '../components/Login/FormComponents';

type Props = {};

const Register = () => {
  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-screen h-screen">
      <div className="p-6 text-center bg-black bg-opacity-80 rounded-lg shadow-lg w-4/12 h-4/5 flex-wrap">
        
        <h1 className="text-white font-bold text-3xl mb-6">
          Đăng ký tài khoản
        </h1>
        <FormComponent />
        <div className=" flex items-center my-4">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-sm text-gray-300">
            Hoặc đăng nhập bằng
          </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
