import React from 'react';
import Carousel from '../components/pages/homepage/carousel/Carousel';
import AboutSection from '../components/pages/homepage/AboutSection';
import ContactCard from '../components/pages/homepage/contact/Contact';
import ReservationSection from '../components/pages/homepage/ReservationSection';
import FeatureSection from '../components/pages/homepage/FeatureSection';
import OrderOnlineSection from '../components/pages/homepage/OrderOnline';
import BestOffersSection from '../components/pages/homepage/bestoffers/BestOffersSection';
import Postcomponent from '../components/pages/homepage/post/Post';
import PostSection from '../components/pages/homepage/PostSection';

const posts = [
    {
      badgeText: "18 FEB 2022",
      title: "Nullam ullamcorper nisl quis ornare molestie",
      category: "HEALTHY FOOD, NEWS",
      description:
        "Suspendisse posuere, diam in bibendum lobortis, turpis ipsum aliquam risus, sit amet dictum ligula lorem non nisl Urna pretium elit mauris cursus Curabitur at elit...",
      image: "/assets/images/posts/Post.jpg",
    },
    {
      badgeText: "18 MAY 2022",
      title: "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus",
      category: "HEALTHY FOOD, NEWS",
      description:
        "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus. Nunc urna Morbi fringilla vitae orci convallis condimentum auctor sit dui. Urna pretium elit mauris cursus Curabitur a...",
      image: "/assets/images/posts/Post.jpg",
    },
    {
      badgeText: "18 FEB 2022",
      title: "Morbi condimentum molestie Nam enim odio sodales",
      category: "HEALTHY FOOD, NEWS",
      description:
        "Sed mauris Pellentesque elit Aliquam at lacus interdum nascetur elit ipsum. Enim ipsum hendrerit Suspendisse turpis laoreet fames tempus ligula pede ac. Et Lorem...",
      image: "/assets/images/posts/Post.jpg",
    },
    {
        badgeText: "18 FEB 2022",
        title: "Morbi condimentum molestie Nam enim odio sodales",
        category: "HEALTHY FOOD, NEWS",
        description:
          "Sed mauris Pellentesque elit Aliquam at lacus interdum nascetur elit ipsum. Enim ipsum hendrerit Suspendisse turpis laoreet fames tempus ligula pede ac. Et Lorem...",
        image: "/assets/images/posts/Post.jpg",
      },
      {
        badgeText: "18 FEB 2022",
        title: "Morbi condimentum molestie Nam enim odio sodales",
        category: "HEALTHY FOOD, NEWS",
        description:
          "Sed mauris Pellentesque elit Aliquam at lacus interdum nascetur elit ipsum. Enim ipsum hendrerit Suspendisse turpis laoreet fames tempus ligula pede ac. Et Lorem...",
        image: "/assets/images/posts/Post.jpg",
      },
  ];
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
            <PostSection posts={posts} />
            <></>
        </>
    );
}

export default Homepage;