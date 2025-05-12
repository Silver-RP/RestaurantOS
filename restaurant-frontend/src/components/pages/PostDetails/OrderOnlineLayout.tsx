import React, { ReactNode } from 'react';

import PostSidebar from './PostSidebar'; // 👉 import từ Posts folder

interface Props {
  children: ReactNode;
}

const OrderOnlineLayout = ({ children }: Props) => (
  <div className="min-h-screen bg-[#012B40] text-white flex flex-col">

    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
      {/* Đặt class thêm cho PostSidebar trong PostDetails */}
      <PostSidebar className="lg:w-[220px] xl:w-[250px] w-full" /> {/* Điều chỉnh chiều rộng */}
      <main className="flex-1 bg-white text-black">{children}</main>
    </div>
  </div>
);

export default OrderOnlineLayout;
