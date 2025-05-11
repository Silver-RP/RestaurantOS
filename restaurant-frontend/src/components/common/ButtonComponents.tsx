import React from 'react';

interface ButtonProps {
  variant?: 'filled' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const ButtonComponents: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  children,
  onClick,
  className = '',
  type = 'button',
}) => {
  const baseStyles = `transition duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2`;

  const variantStyles = {
    filled: `bg-secondaryColor border border-secondaryColor text-headerBackground hover:bg-headerBackground hover:text-white`,
    outline: `bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground`,
  };

  const sizeStyles = {
    small: `px-4 py-2 text-sm`,
    medium: `px-6 py-3 text-base`,
    large: `px-6 py-2 md:px-10 md:py-3 text-lg`,
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonComponents;
