import { Input } from '@headlessui/react';
import React from 'react';

interface InputProps {
  type: string;
  value: string;
  placeholder?: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputComponent: React.FC<InputProps> = ({ type, value, placeholder, name, onChange }) => {
  return (
    <div className="mb-4">
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        className="py-2 px-4 rounded-lg"
      />
    </div>
  );
};

export default InputComponent;
