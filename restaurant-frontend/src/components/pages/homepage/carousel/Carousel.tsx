import React, { useState, useEffect, useRef } from "react";
import { MdRestaurant } from "react-icons/md";
import { BiDrink } from "react-icons/bi";
import { BsCupHot } from "react-icons/bs";
import { useGetActiveBanners } from "../../../../hooks/useBanner";
import { useNavigate } from "react-router-dom";

const icons = [
  <MdRestaurant key="restaurant" />,
  <BiDrink key="drink" />,
  <BsCupHot key="coffee" />
];

const Carousel = () => {
  const { activeBanners, loading, error, fetchActiveBanners } = useGetActiveBanners();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveBanners();
  }, [fetchActiveBanners]);

  const startInterval = () => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      handleNextSlide();
    }, 5000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (activeBanners.length > 0) {
    startInterval();
    }
    return () => stopInterval();
  }, [activeBanners]);

  const handleNextSlide = () => {
    if (isAnimating || activeBanners.length === 0) return;
    stopInterval();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
      setIsAnimating(false);
      startInterval();
    }, 100);
  };

  const handlePrevSlide = () => {
    if (isAnimating || activeBanners.length === 0) return;
    stopInterval();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
      setIsAnimating(false);
      startInterval();
    }, 100);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating || currentSlide === index || activeBanners.length === 0) return;
    stopInterval();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
      startInterval();
    }, 100);
  };

  if (loading) {
    return (
      <div className="h-[75vh] md:h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondaryColor"></div>
      </div>
    );
  }

  if (error || activeBanners.length === 0) {
    return (
      <div className="h-[75vh] md:h-screen w-full flex items-center justify-center">
        <p className="text-gray-500">Không có banner nào</p>
      </div>
    );
  }

  return (
    <div className="relative h-[75vh] md:h-screen w-full overflow-hidden group">
      {activeBanners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transform transition-transform duration-500 ${
            index === currentSlide
              ? "translate-x-0 z-10"
              : index > currentSlide
              ? "translate-x-full z-0"
              : "-translate-x-full z-0"
          }`}
          style={{
            backgroundImage: `url(${banner.image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div
            className={`relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6 transition-opacity duration-500 ${
              isAnimating && index !== currentSlide ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="text-secondaryColor text-2xl sm:text-3xl mb-4 animate-fade-down">
              {icons[index % icons.length]}
            </div>
            <h2 className="text-secondaryColor font-extralight font-sans text-xs sm:text-sm md:text-base tracking-wide uppercase mb-2 animate-fade-down">
              Welcome to Beef Beef
            </h2>
            <div className="flex justify-center space-x-1 sm:space-x-2 mb-6 animate-fade-down">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondaryColor rounded-full"></span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondaryColor rounded-full"></span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondaryColor rounded-full"></span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-snug font-medium font-restora text-white mb-6 drop-shadow-lg animate-fade-down">
              {(() => {
                const words = banner.title.split(' ');
                const midPoint = Math.ceil(words.length / 2);
                const line1 = words.slice(0, midPoint).join(' ');
                const line2 = words.slice(midPoint).join(' ');
                return (
                  <>
                    {line1} <br /> {line2}
                  </>
                );
              })()}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-8 animate-fade-down">
              {banner.description}
            </p>
            <button className="px-5 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 bg-transparent border border-secondaryColor text-secondaryColor hover:bg-secondaryColor hover:text-headerBackground transition animate-fade-down"
              onClick={()=> navigate('/menu?sort=categoryAZ')}
            >
              KHÁM PHÁ MENU
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handlePrevSlide}
        className="absolute top-1/2 z-20 left-2 sm:left-4 transform -translate-y-1/2 bg-secondaryColor text-headerBackground rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-80 hover:scale-110 transition-all duration-500 opacity-0 group-hover:opacity-100"
      >
        &#8592;
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute top-1/2 z-20 right-2 sm:right-4 transform -translate-y-1/2 bg-secondaryColor text-headerBackground rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-80 hover:scale-110 transition-all duration-500 opacity-0 group-hover:opacity-100"
      >
        &#8594;
      </button>

      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 z-20 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              currentSlide === index
                ? "bg-secondaryColor"
                : "bg-gray-500 hover:bg-secondaryColor"
            } transition`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;