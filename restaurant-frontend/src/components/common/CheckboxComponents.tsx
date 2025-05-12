import React from 'react';

interface CheckboxComponentProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({ label, checked, onChange, ...rest }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="w-4 h-4 border-2 border-gray-300 rounded-none checked:bg-blue-500 checked:border-blue-500 focus:ring-0 cursor-pointer"
        checked={checked}
        onChange={onChange}
        {...rest} 
      />
      <label className="ml-2 text-white">{label}</label>
    </div>
  );
};

export default CheckboxComponent;
