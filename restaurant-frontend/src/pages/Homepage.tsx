import React from 'react';
import Carousel from '../components/pages/homepage/carousel/Carousel';
import AboutSection from '../components/pages/homepage/AboutSection';
import ContactCard from '../components/pages/homepage/contact/Contact';
import ReservationSection from '../components/pages/homepage/ReservationSection';
import FeatureSection from '../components/pages/homepage/FeatureSection';
import OrderOnlineSection from '../components/pages/homepage/OrderOnline';
import Postcomponent from '../components/pages/homepage/post/Post';
import BestOffersSection from '../components/pages/homepage/BestOffers/BestOffersSection';
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
            <Postcomponent></Postcomponent>
        </>
    );
}

export default Homepage;