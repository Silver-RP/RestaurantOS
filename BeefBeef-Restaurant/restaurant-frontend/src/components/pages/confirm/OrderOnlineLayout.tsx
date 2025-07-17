import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const OrderOnlineLayout = ({ children }: Props) => (
  <div className="min-h-screen bg-[#012B40] flex justify-center items-center py-8 px-4">
    <main className="w-full max-w-[1100px] sm:max-w-full lg:max-w-full xl:max-w-full">{children}</main>
  </div>
);

export default OrderOnlineLayout;
