import React from 'react';

type Props = {
  htmlType?: 'button' | 'submit' | 'reset';
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const ButtonComponent: React.FC<Props> = ({
  htmlType = 'button',
  text = 'Đăng Ký',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={htmlType}
      onClick={onClick}
      disabled={disabled}
      className={`mt-6 px-4 py-2 w-full text-lg font-medium border 
        ${disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
          : 'bg-secondaryColor text-bodyBackground border-secondaryColor hover:bg-bodyBackground hover:text-secondaryColor hover:border-secondaryColor'
        }`}
    >
      {text}
    </button>
  );
};

export default ButtonComponent;