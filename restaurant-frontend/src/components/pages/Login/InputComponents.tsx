import React, { useState, forwardRef } from 'react';
import { Input } from 'antd';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type Props = {
  type: string;
  value: string;
  placeholder?: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

// 👇 forwardRef cho phép nhận ref từ bên ngoài
const InputComponent = forwardRef<HTMLInputElement, Props>(
  ({ type, value, placeholder, name, onChange, onKeyDown  }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    return (
      <div className="relative">
        <Input
          onKeyDown={onKeyDown}
          ref={ref} // 👈 sử dụng ref chính xác
          type={type === 'password' && isPasswordVisible ? 'text' : type}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="on"
          className="bg-transparent mt-6 w-full px-4 py-3 text-white hover:bg-transparent focus:bg-transparent border border-white rounded-md placeholder-gray-400 focus:ring-white"
        />
        {type === 'password' && (
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-6 top-2/3 transform -translate-y-1/2 cursor-pointer text-white hover:text-gray-200"
          >
            {isPasswordVisible ? (
              <FaEyeSlash size={20} color="#fff" />
            ) : (
              <FaEye size={20} color="#fff" />
            )}
          </span>
        )}
      </div>
    );
  }
);

// 👇 thêm display name để debug dễ hơn
InputComponent.displayName = 'InputComponent';

export default InputComponent;
