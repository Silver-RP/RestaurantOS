import React from 'react';
import Carousel from '../components/carousel/Carousel';
import AboutSection from '../components/homepage/AboutSection';
import OrderOnlineSection from '../components/Home/OrderOnline';
import FeatureSection from '../components/Home/Discover';
const Homepage = () => {
    return (
        <>
            <Carousel></Carousel>
            <AboutSection></AboutSection>
            <FeatureSection></FeatureSection>
            <OrderOnlineSection></OrderOnlineSection>
        </>
    );
}

export default Homepage;