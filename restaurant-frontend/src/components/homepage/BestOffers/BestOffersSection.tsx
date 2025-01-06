import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import MenuGrid from "./MenuGrid";

const BestOffersSection: React.FC = () => {
  const tabs = ["Morning", "Weekday Lunch", "Dinner", "Wines"];
  const [activeTab, setActiveTab] = useState(0);

  const menuData = [
    [
      { name: "Spaghetti Pasta", price: 19.12, description: "Regular fit, round neckline, short sleeves.", image: "/assets/images/products/SP1.1.jpg" },
      { name: "Beef Meat Steak", price: 28.72, description: "100% cotton, brushed inner side.", image: "/assets/images/menu/steak.jpg" },
      { name: "Lomo De Salmon", price: 29.00, description: "Printed on rigid matt paper.", image: "/assets/images/menu/salmon.jpg" }
    ],
    [
      { name: "Steamed Lobster", price: 29.00, description: "Printed on rigid matt finish.", image: "/assets/images/menu/lobster.jpg" },
      { name: "Pumpkin Soup", price: 29.00, description: "Printed on rigid paper.", image: "/assets/images/menu/soup.jpg" },
      { name: "Garlic Shrimp Spaghetti", price: 11.90, description: "White Ceramic Mug.", image: "/assets/images/menu/spaghetti2.jpg" }
    ]
  ];

  return (
    <section className="w-full bg-bodyBackground px-6 py-16">
      <img src="/assets/images/home/IconOnline.svg" alt="Icon" className="mx-auto mb-8" />
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora justify-center text-white flex font-thin mb-4">Best Offers</h2>
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <MenuGrid items={menuData[activeTab]} />
    </section>
  );
};

export default BestOffersSection;