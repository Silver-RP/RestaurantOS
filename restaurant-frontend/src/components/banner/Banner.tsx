import React from "react";

const Banner = () => {
  return (
    <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('banner-placeholder.jpg')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-white flex flex-col items-center justify-center h-full px-8">
        <h2 className="text-lg uppercase text-yellow-500 mb-4">Welcome to Delicioz</h2>
        <h1 className="text-5xl font-bold text-center leading-snug">
          Incredible Food & <br />
          Heavenly Coffee
        </h1>
        <p className="text-lg text-gray-300 mt-4 text-center">
          Join us at the table as you dine for the perfect meal.
        </p>
        <button className="mt-8 bg-yellow-500 text-black px-6 py-3 rounded-md">
          Discover Menu
        </button>
      </div>
    </div>
  );
};

export default Banner;