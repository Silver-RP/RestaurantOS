import { ReactNode } from 'react';

import PostSidebar from './PostSidebar'; 

interface Props {
  children: ReactNode;
  className?: string;
}

const OrderOnlineLayout = ({ children, className }: Props) => (
  <div className={`min-h-screen bg-[#012B40] text-white flex flex-col ${className}`}>
    <div className="container">
      <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
        <main className="flex-1 bg-white text-black min-w-0">{children}</main>
      </div>
    </div>
  </div>
);

export default OrderOnlineLayout;
