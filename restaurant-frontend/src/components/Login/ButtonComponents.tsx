import React from 'react';
import { Button } from 'antd';

type Props = {
  htmlType?: 'button' | 'submit' | 'reset'; // Loại nút HTML
  text?: string; // Văn bản hiển thị trên nút
  onClick?: () => void; // Xử lý sự kiện khi nút được nhấn
};

const ButtonComponent: React.FC<Props> = ({ htmlType = 'button', text = 'Đăng Ký', onClick }) => {
  return (
    <div>
      <Button
        htmlType={htmlType} // Sử dụng htmlType thay cho type
        onClick={onClick}
        className="mt-6 px-4 py-5 w-11/12 text-lg font-medium bg-secondaryColor text-bodyBackground border border-secondaryColor rounded hover:bg-bodyBackground hover:text-secondaryColor hover:border-secondaryColor"
      >
        {text}
      </Button>
    </div>
  );
};

export default ButtonComponent;
