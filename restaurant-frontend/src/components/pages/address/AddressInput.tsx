import React from 'react';

interface AddressInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = "Nhập địa chỉ chi tiết, ví dụ: 123 Tô Ký"
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-b border-white text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
      />
    </div>
  );
};
