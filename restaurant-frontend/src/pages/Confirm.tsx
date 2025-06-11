import ConfirmOrderSection from '../components/pages/confirm/ConfirmOrderSection';
import Container from '@/components/common/Container';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import React from 'react';
const ConfirmOrderPage = () => {
  return (
    <>
      <BreadCrumbComponents />

      <Container>
        <ConfirmOrderSection />
      </Container>
    </>
  );
};

export default ConfirmOrderPage;
