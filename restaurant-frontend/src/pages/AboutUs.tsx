import Experience from '../components/pages/aboutUs/experience/Experience';
import Menter from '../components/pages/aboutUs/menter/Menter';
import Menu from '../components/pages/aboutUs/menu/Menu';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import React from 'react';

const AboutUsPage = () => {
  return (
    <div>
       <BreadCrumbComponents />
       <Menu />
       <Experience /> 
       <Menter />
    </div>
   
  );
};
export default AboutUsPage;
