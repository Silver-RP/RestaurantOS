import React, { useState } from "react";

interface MenuItemProps {
  imageUrl: string;
  name: string;
  price: number;
  description: string;
}

interface TabProps {
  label: string;
  items: MenuItemProps[];
}

const BestOffers: React.FC = () => {
  const tabs: TabProps[] = [
    {
      label: "MORNING",
      items: [
        {
          imageUrl: "/assets/images/menu/spaghetti.jpg",
          name: "Spaghetti Pasta",
          price: 19.12,
          description:
            "Regular fit, round neckline, short sleeves. Made of extra long staple pima cotton.",
        },
        {
          imageUrl: "/assets/images/menu/steak.jpg",
          name: "Beef Meat Steak",
          price: 28.72,
          description:
            "Regular fit, round neckline, long sleeves. 100% cotton, brushed inner side for extra comfort.",
        },
        {
          imageUrl: "/assets/images/menu/salmon.jpg",
          name: "Lomo De Salmon",
          price: 29.0,
          description: "Printed on rigid matt paper and smooth surface.",
        },
      ],
    },
    {
      label: "WEEKDAY LUNCH",
      items: [
        {
          imageUrl: "/assets/images/menu/lobster.jpg",
          name: "Steamed Lobster",
          price: 29.0,
          description: "Printed on rigid matt finish and smooth surface.",
        },
        {
          imageUrl: "/assets/images/menu/soup.jpg",
          name: "Pumpkin Soup",
          price: 29.0,
          description:
            "Printed on rigid paper with matt finish and smooth surface.",
        },
        {
          imageUrl: "/assets/images/menu/spaghetti2.jpg",
          name: "Garlic Shrimp Spaghetti",
          price: 11.9,
          description: "White Ceramic Mug, 325ml.",
        },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-bodyBackground text-white py-16 px-6 lg:px-20">
      <div className="w-mainContainer mx-auto">
        <img
          src="/assets/images/home/IconOnline.svg"
          alt="Icon"
          className="mx-auto mb-8"
        />
        <h2 className="text-3xl text-center sm:text-4xl md:text-5xl font-restora font-extralight mb-4">
          Best Offers
        </h2>
        <div className="flex justify-center items-center space-x-4 text-secondaryColor font-medium text-sm uppercase tracking-wide mt-6">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`pb-2 ${
                activeTab === index
                  ? "border-b-2 border-secondaryColor"
                  : "text-gray-400 hover:text-secondaryColor"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <hr className="border-t border-hr mt-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {tabs[activeTab].items.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-restora font-bold">{item.name}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  {item.description}
                </p>
              </div>
              <p className="text-secondaryColor text-lg font-bold">
                ${item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="px-6 py-3 border border-secondaryColor text-secondaryColor hover:bg-secondaryColor hover:text-bodyBackground transition">
            View Our Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestOffers;