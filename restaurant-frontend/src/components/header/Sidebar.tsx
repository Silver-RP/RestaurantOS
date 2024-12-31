import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-headerBackground text-white w-72 h-screen px-6 py-8 flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="flex items-center mb-8">
          <img
            src="logo-placeholder.png" // Thay bằng đường dẫn logo thực tế của bạn
            alt="Delicioz Logo"
            className="h-10 w-10 mr-2"
          />
          <h1 className="text-2xl font-bold">Delicioz</h1>
          <span className="text-sm text-gray-400 ml-2">RESTAURANT & BAR</span>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-4">
            <li className="hover:text-secondaryColor">
              <a href="#">HOME</a>
            </li>
            <li className="hover:text-secondaryColor">
              <a href="#">ABOUT</a>
            </li>
            <li className="hover:text-secondaryColor flex justify-between">
              MENU <span className="text-gray-400">▼</span>
            </li>
            <li className="hover:text-secondaryColor flex justify-between">
              BLOG <span className="text-gray-400">▼</span>
            </li>
            <li className="hover:text-secondaryColor flex justify-between">
              PAGES <span className="text-gray-400">▼</span>
            </li>
            <li className="hover:text-secondaryColor">
              <a href="#">SHOP</a>
            </li>
            <li className="hover:text-secondaryColor">
              <a href="#">CONTACT</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Reservation Button */}
      <div>
        <button className="bg-secondaryColor text-black px-6 py-3 rounded-md w-full mb-8">
          RESERVATION
        </button>

        {/* Booking Info */}
        <div className="text-center text-sm">
          <h3 className="text-lg font-semibold mb-2">Booking Info</h3>
          <p>71 Madison Ave, New York, USA</p>
          <p>+39-055-123456</p>
          <p>demo@demo.com</p>

          {/* Social Icons */}
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-secondaryColor">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-secondaryColor">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-secondaryColor">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-secondaryColor">
              <i className="fab fa-pinterest"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-secondaryColor">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;