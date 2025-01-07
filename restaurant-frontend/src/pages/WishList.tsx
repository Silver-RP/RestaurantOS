import React from 'react';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import WishListSection from '../components/pages/wishlist/WishListSection';

const WishList = () => {
    return (
        <>
            <BreadCrumbComponents></BreadCrumbComponents>
            <WishListSection></WishListSection>
        </>
    )
}

export default WishList;