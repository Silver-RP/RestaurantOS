import React from "react";

interface BadgeProps {
  text: string;
  className?: string; 
}

const Badge: React.FC<BadgeProps> = ({ text, className = "" }) => {
  return (
    <div
      className={`bg-secondaryColor text-headerBackground px-4 py-1 rounded font-semibold text-sm ${className}`}
    >
      {text}
    </div>
  );
};

export default Badge;