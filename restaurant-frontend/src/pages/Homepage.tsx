import React from 'react';
import Carousel from '../components/carousel/Carousel';
import AboutSection from '../components/homepage/AboutSection';
import OrderOnlineSection from '../components/Home/OrderOnline';
import BestOffers from '../components/homepage/BestOffers';
import FeatureSection from '../components/Home/Discover';
const Homepage = () => {
    return (
        <>
            <Carousel></Carousel>
            <AboutSection></AboutSection>
            <FeatureSection></FeatureSection>
            <OrderOnlineSection></OrderOnlineSection>
            <BestOffers></BestOffers>
        </>
    );
}

export default Homepage;