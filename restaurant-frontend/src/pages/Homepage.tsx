import React from 'react';
import Carousel from '../components/carousel/Carousel';
import AboutSection from '../components/homepage/AboutSection';
import OrderOnlineSection from '../components/Home/OrderOnline';
const Homepage = () => {
    return (
        <>
            <Carousel></Carousel>
            <AboutSection></AboutSection>
            <OrderOnlineSection></OrderOnlineSection>
        </>
    );
}

export default Homepage;