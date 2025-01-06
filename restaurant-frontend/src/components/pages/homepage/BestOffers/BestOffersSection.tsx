import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import MenuGrid from "./MenuGrid";

const BestOffersSection: React.FC = () => {
  const tabs = ["Morning", "Weekday Lunch", "Dinner", "Wines"];
  const [activeTab, setActiveTab] = useState(0);

  const menuData = [
    [
      {
        name: "Spaghetti Pasta",
        price: 19.12,
        description: "Regular fit, round neckline, short sleeves.",
        image: "/assets/images/products/SP1.1.jpg",
        hoverImage: "/assets/images/products/SP1.jpg",
      },
      {
        name: "Beef Meat Steak",
        price: 28.72,
        description: "100% cotton, brushed inner side.",
        image: "/assets/images/products/SP2.1.jpg",
        hoverImage: "/assets/images/products/SP2.jpg",
      },
      {
        name: "Lomo De Salmon",
        price: 29.0,
        description: "Printed on rigid matt paper.",
        image: "/assets/images/products/SP3.1.jpg",
        hoverImage: "/assets/images/products/SP3.jpg",
      },
      {
        name: "Chicken Alfredo",
        price: 15.99,
        description: "Served with creamy Alfredo sauce.",
        image: "/assets/images/products/SP4.1.jpg",
        hoverImage: "/assets/images/products/SP4.jpg",
      },
      {
        name: "Vegetarian Pizza",
        price: 12.5,
        description: "Topped with fresh vegetables.",
        image: "/assets/images/products/SP5.1.jpg",
        hoverImage: "/assets/images/products/SP5.jpg",
      },
      {
        name: "Caesar Salad",
        price: 9.99,
        description: "Fresh romaine lettuce with Caesar dressing.",
        image: "/assets/images/products/SP6.1.jpg",
        hoverImage: "/assets/images/products/SP6.jpg",
      },
    ],
    [
      {
        name: "Steamed Lobster",
        price: 29.0,
        description: "Printed on rigid matt finish.",
        image: "/assets/images/products/SP7.1.jpg",
        hoverImage: "/assets/images/products/SP7.jpg",
      },
      {
        name: "Pumpkin Soup",
        price: 29.0,
        description: "Printed on rigid paper.",
        image: "/assets/images/products/SP8.1.jpg",
        hoverImage: "/assets/images/products/SP8.jpg",
      },
      {
        name: "Garlic Shrimp Spaghetti",
        price: 11.9,
        description: "White Ceramic Mug.",
        image: "/assets/images/products/SP9.1.jpg",
        hoverImage: "/assets/images/products/SP9.jpg",
      },
      {
        name: "Grilled Chicken Sandwich",
        price: 14.99,
        description: "Served with lettuce and tomato.",
        image: "/assets/images/products/SP10.1.jpg",
        hoverImage: "/assets/images/products/SP10.jpg",
      },
      {
        name: "Classic Cheeseburger",
        price: 10.5,
        description: "Topped with cheddar cheese and pickles.",
        image: "/assets/images/products/SP1.1.jpg",
        hoverImage: "/assets/images/products/SP1.jpg",
      },
      {
        name: "French Fries",
        price: 5.0,
        description: "Crispy and golden.",
        image: "/assets/images/products/SP2.1.jpg",
        hoverImage: "/assets/images/products/SP2.jpg",
      },
    ],
    [
      {
        name: "Roast Beef",
        price: 22.99,
        description: "Tender roast beef with gravy.",
        image: "/assets/images/products/SP3.1.jpg",
        hoverImage: "/assets/images/products/SP3.jpg",
      },
      {
        name: "Baked Ziti",
        price: 18.5,
        description: "Pasta baked with marinara and cheese.",
        image: "/assets/images/products/SP4.1.jpg",
        hoverImage: "/assets/images/products/SP4.jpg",
      },
      {
        name: "Barbecue Ribs",
        price: 25.0,
        description: "Smoked ribs with barbecue sauce.",
        image: "/assets/images/products/SP5.1.jpg",
        hoverImage: "/assets/images/products/SP5.jpg",
      },
      {
        name: "Stuffed Peppers",
        price: 16.0,
        description: "Peppers stuffed with rice and beef.",
        image: "/assets/images/products/SP6.1.jpg",
        hoverImage: "/assets/images/products/SP6.jpg",
      },
      {
        name: "Chicken Tenders",
        price: 12.5,
        description: "Breaded and fried chicken strips.",
        image: "/assets/images/products/SP7.1.jpg",
        hoverImage: "/assets/images/products/SP7.jpg",
      },
      {
        name: "Mashed Potatoes",
        price: 8.0,
        description: "Served with butter and cream.",
        image: "/assets/images/products/SP8.1.jpg",
        hoverImage: "/assets/images/products/SP8.jpg",
      },
    ],
    [
      {
        name: "Chardonnay",
        price: 45.0,
        description: "Smooth and buttery white wine.",
        image: "/assets/images/products/SP9.1.jpg",
        hoverImage: "/assets/images/products/SP9.jpg",
      },
      {
        name: "Merlot",
        price: 50.0,
        description: "Full-bodied red wine.",
        image: "/assets/images/products/SP10.1.jpg",
        hoverImage: "/assets/images/products/SP10.jpg",
      },
      {
        name: "Cabernet Sauvignon",
        price: 60.0,
        description: "Rich and complex red wine.",
        image: "/assets/images/products/SP1.1.jpg",
        hoverImage: "/assets/images/products/SP1.jpg",
      },
      {
        name: "Pinot Noir",
        price: 55.0,
        description: "Light and fruity red wine.",
        image: "/assets/images/products/SP2.1.jpg",
        hoverImage: "/assets/images/products/SP2.jpg",
      },
      {
        name: "Riesling",
        price: 40.0,
        description: "Sweet and crisp white wine.",
        image: "/assets/images/products/SP3.1.jpg",
        hoverImage: "/assets/images/products/SP3.jpg",
      },
      {
        name: "Sparkling Rosé",
        price: 48.0,
        description: "Bubbly and refreshing.",
        image: "/assets/images/products/SP6.1.jpg",
        hoverImage: "/assets/images/products/SP6.jpg",
      },
    ],
  ];

  const currentMenu = menuData[activeTab] || [];

  return (
    <section className="w-full bg-bodyBackground px-6 py-16">
      <img src="/assets/images/home/IconOnline.svg" alt="Icon" className="mx-auto mb-8" />
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora justify-center text-white flex font-thin mb-4">
        Best Offers
      </h2>
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {currentMenu.length > 0 ? (
        <MenuGrid items={currentMenu} />
      ) : (
        <div className="text-center text-gray-400 mt-8">
          <p>No items available for this category.</p>
        </div>
      )}
      <div className="mt-12 text-center">
      {/* Thời gian hoạt động */}
      <p className="text-sm md:text-base text-gray-300 mb-4">
        Phục vụ hàng ngày từ{" "}
        <span className="text-secondaryColor font-semibold">8:30 am</span> to{" "}
        <span className="text-secondaryColor font-semibold">11:00 pm</span>
      </p>
      
      {/* Nút xem menu */}
      <button className="mt-4 px-8 py-3 text-sm md:text-base font-semibold text-secondaryColor border border-secondaryColor hover:bg-secondaryColor hover:text-black transition-all duration-300">
        XEM THỰC ĐƠN
      </button>
    </div>
    </section>
  );
};

export default BestOffersSection;