import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

interface ChatToggleButtonProps {
  unreadCount: number;
  onClick: () => void;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({
  unreadCount,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`relative w-12 h-12 rounded-full bg-[#FFDEA0] text-black flex items-center justify-center shadow-lg
      transition-transform duration-300 hover:scale-110 hover:bg-yellow-200
      ${unreadCount > 0 ? 'animate-shake' : ''}`}
  >
    <FiMessageSquare size={20} />
    {unreadCount > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-adminred text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md ring-2 ring-white">
        {unreadCount}
      </span>
    )}
  </button>
);

export default ChatToggleButton;
