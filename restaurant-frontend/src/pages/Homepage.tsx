import React from 'react';
import Carousel from '../components/carousel/Carousel';
import AboutSection from '../components/homepage/AboutSection';
import ContactCard from '../components/contact/Contact';
import ReservationSection from '../components/homepage/ReservationSection';
import FeatureSection from '../components/homepage/FeatureSection';
import OrderOnlineSection from '../components/homepage/OrderOnline';
import BestOffersSection from '../components/homepage/BestOffers/BestOffersSection';
const Homepage = () => {
    return (
        <>
            <Carousel></Carousel>
            <AboutSection></AboutSection>
            <ContactCard></ContactCard>
            <BestOffersSection></BestOffersSection>
            <FeatureSection></FeatureSection>
            <OrderOnlineSection></OrderOnlineSection>
            <ReservationSection></ReservationSection>
        </>
    );
}

export default Homepage;