// File: src/pages/confirm/ConfirmOrderPage.tsx
import React from 'react';
import OrderOnlineLayout from '../components/pages/confirm/OrderOnlineLayout';
import ConfirmOrderSection from '../components/pages/confirm/ConfirmOrderSection';

const ConfirmOrderPage = () => {
  return (
    <OrderOnlineLayout>
      <ConfirmOrderSection />
    </OrderOnlineLayout>
  );
};

export default ConfirmOrderPage;
