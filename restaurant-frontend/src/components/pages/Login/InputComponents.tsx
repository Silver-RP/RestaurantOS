import React, { useState } from 'react';
import { Input } from 'antd';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type Props = {
  type: string;
  value: string;
  placeholder?: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
};

const InputComponent: React.FC<Props> = ({ type, value, placeholder, name, onChange, ...rest }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        type={type === 'password' && isPasswordVisible ? 'text' : type}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent mt-6 w-full px-4 py-3 text-white hover:bg-transparent focus:bg-transparent border border-white rounded-md placeholder-gray-400 focus:ring-white"
        {...rest} 
      />
      {type === 'password' && (
        <span
          onClick={togglePasswordVisibility}
          className="absolute right-6 top-2/3 transform -translate-y-1/2 cursor-pointer text-white hover:text-gray-200"
        >
          {isPasswordVisible ? <FaEyeSlash size={20} color="#fff" /> : <FaEye size={20} color="#fff" />}
        </span>
      )}
    </div>
  );
};

export default InputComponent;
