import React, { useState, useEffect, useRef } from "react";
import { MdRestaurant } from "react-icons/md";
import { BiDrink } from "react-icons/bi";
import { BsCupHot } from "react-icons/bs";

const Carousel = () => {
  const slides = [
    {
      id: 1,
      backgroundImage: "/assets/images/banner/banner1.webp",
      title: "Sự Tận Tâm",
      subtitle: "Trong Từng Hương Vị",
      description:
        "Sứ mệnh của chúng tôi là mang đến những bữa ăn đánh thức mọi giác quan - khơi nguồn cảm xúc, thử thách vị giác và làm phong phú tâm hồn.",
      icon: <MdRestaurant />,
    },
    {
      id: 2,
      backgroundImage: "/assets/images/banner/banner2.webp",
      title: "Hương Vị Tuyệt Vời",
      subtitle: "Trong Mỗi Món Ăn",
      description:
        "Khám phá sự đa dạng của ẩm thực với các nguyên liệu tươi ngon và cách chế biến độc đáo.",
      icon: <BiDrink />,
    },
    {
      id: 3,
      backgroundImage: "/assets/images/banner/banner3.webp",
      title: "Trải Nghiệm Đẳng Cấp",
      subtitle: "Trong Không Gian Sang Trọng",
      description:
        "Chúng tôi mang đến không gian ấm cúng và trải nghiệm ẩm thực cao cấp.",
      icon: <BsCupHot />,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<number | null>(null);

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
    startInterval();
    return () => stopInterval();
  }, []);

  const handleNextSlide = () => {
    if (isAnimating) return;
    stopInterval();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsAnimating(false);
      startInterval();
    }, 100);
  };

  const handlePrevSlide = () => {
    if (isAnimating) return;
    stopInterval();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsAnimating(false);
      startInterval();
    }, 100);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating || currentSlide === index) return;
    stopInterval();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
      startInterval();
    }, 100);
  };

  return (
    <div className="relative h-[75vh] md:h-screen overflow-hidden group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transform transition-transform duration-500 ${
            index === currentSlide
              ? "translate-x-0 z-10"
              : index > currentSlide
              ? "translate-x-full z-0"
              : "-translate-x-full z-0"
          }`}
          style={{
            backgroundImage: `url(${slide.backgroundImage})`,
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
              {slide.icon}
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
              {slide.title} <br /> {slide.subtitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-8 animate-fade-down">
              {slide.description}
            </p>
            <button className="px-5 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 bg-transparent border border-secondaryColor text-secondaryColor hover:bg-secondaryColor hover:text-headerBackground transition animate-fade-down">
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
        {slides.map((_, index) => (
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