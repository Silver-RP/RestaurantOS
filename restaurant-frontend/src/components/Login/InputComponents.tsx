import React from 'react';
import { Input } from 'antd';

type Props = {
  placeholder: string;
  type: string;
  value: string;
  
};

const InputComponent: React.FC<Props> = ({ placeholder, type, value, ...rest }) => {
  return (
    <div>
      <Input
        className="bg-transparent mt-6 w-11/12 px-4 py-2 text-white hover:bg-transparent focus:bg-transparent border-1 border-white rounded-md placeholder-gray-400 hover:border-white focus:border-white focus:ring-white"
        placeholder={placeholder}
        type={type}
        value={value}
        {...rest} // Truyền các props bổ sung vào Ant Design Input
      />
    </div>
  );
};

export default InputComponent;
