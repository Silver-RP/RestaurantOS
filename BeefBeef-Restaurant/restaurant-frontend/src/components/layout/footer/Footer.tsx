import React from 'react';
import MobileFooter from './MobileFooter';
import PCFooter from './PCFooter';

const Footer = () => {
  return (
    <>
      <div className="hidden lg:block">
        <PCFooter />
      </div>

      <div className="block lg:hidden">
        <MobileFooter />
      </div>
    </>
  );
};

export default Footer;