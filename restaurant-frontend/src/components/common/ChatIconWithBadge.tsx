import React, { useEffect, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import { getUnreadMessageCount } from '@/api/ChatboxApi';

export const ChatIconWithBadge: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const unread = await getUnreadMessageCount();
        console.log('Unread messages count:', unread);
        setCount(unread);
      } catch {
        setCount(0);
      }
    };
    fetchUnread();
  }, []);

  return (
    <div className="relative">
      <FaComments className="text-lg" />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] px-1 py-[1px] rounded-full shadow-sm font-medium leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
};
