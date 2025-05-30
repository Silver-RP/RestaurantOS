import React from 'react';
import { FaComments } from 'react-icons/fa';

export const ChatIconWithBadge = ({ count }: { count: number }) => (
  <div className="relative">
    <FaComments className="text-lg" />
    {count > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] px-1 py-[1px] rounded-full shadow-sm font-medium leading-none">
        {count > 9 ? '9+' : count}
      </span>
    )}
  </div>
);
