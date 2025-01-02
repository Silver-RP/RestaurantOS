import React from 'react';
import Sidebar from './components/sidebar/Sidebar'
import Carousel from './components/carousel/Carousel';
import AboutSection from './components/homepage/AboutSection';

function App() {

  return (
    <>
     <div className="flex h-screen">
      <div className="w-72 h-full fixed left-0 top-0">
        <Sidebar />
      </div>
      <div className="flex-1 ml-72">
        <Carousel />
        <AboutSection />
      </div>
    </div>
    </>
  );
}

export default App