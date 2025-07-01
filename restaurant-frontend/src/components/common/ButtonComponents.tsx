import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline' | 'selected'; 
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ButtonComponents: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  children,
  className = '',
  ...rest
}) => {
  const baseStyles =
    'transition duration-300 font-medium active:scale-95 focus:outline-none focus:ring-0 focus:ring-offset-0';

  const variantStyles = {
    filled:
      'bg-secondaryColor border border-secondaryColor text-headerBackground hover:bg-headerBackground hover:text-white focus:ring-bodyBackground  active:bg-headerBackground/90',
    outline:
      'bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground',
    selected: 
      'bg-headerBackground text-white font-semibold font-sans border border-secondaryColor',
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-6 py-2 md:px-10 md:py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ButtonComponents;
