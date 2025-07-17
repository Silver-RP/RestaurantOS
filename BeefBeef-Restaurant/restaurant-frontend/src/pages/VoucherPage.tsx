import BreadCrumbComponents from '@/components/common/BreadCrumbComponents';
import Container from '@/components/common/Container';
import ShowcaseSection from '@/components/common/ShowcaseSection';
import VoucherList from '@/components/pages/voucher/VoucherList';
import React from 'react';


const VoucherPage: React.FC = () => {
  return (
    <>
        <BreadCrumbComponents></BreadCrumbComponents>
        <Container>
        <VoucherList />
        </Container>
        <ShowcaseSection></ShowcaseSection>
    </> 
  );
};

export default VoucherPage; 