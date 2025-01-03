import React from 'react';
import Carousel from '../components/carousel/Carousel';
import AboutSection from '../components/homepage/AboutSection';
import OrderOnlineSection from '../components/Home/OrderOnline';
import BestOffers from '../components/homepage/BestOffers';
const Homepage = () => {
    return (
        <>
            <Carousel></Carousel>
            <AboutSection></AboutSection>
            <OrderOnlineSection></OrderOnlineSection>
            <BestOffers></BestOffers>
        </>
    );
}

export default Homepage;