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
    className={`relative w-12 h-12 rounded-full bg-[#FFDEA0] text-black flex items-center justify-center shadow-lg overflow-visible
      transition-transform duration-300 hover:scale-110
      ${unreadCount > 0 ? 'ring-animation' : ''}`}
  >
    <style>{`
      .ring-animation::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(255, 222, 160, 0.6);
        border-radius: 9999px;
        z-index: -1;
        animation: ripple 1.5s ease-out infinite;
      }

      @keyframes ripple {
        0% {
          transform: scale(1);
          opacity: 0.6;
        }
        70% {
          transform: scale(2.6);
          opacity: 0;
        }
        100% {
          transform: scale(1.8);
          opacity: 0;
        }
      }
    `}</style>

    <FiMessageSquare size={20} />
    {unreadCount > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md ring-2 ring-white">
        {unreadCount}
      </span>
    )}
  </button>
);


export default ChatToggleButton;
