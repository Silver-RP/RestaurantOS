import React, { useState } from "react";
import FoodItemCard from "./FoodItemCard";

interface FoodItem {
  id: number;
  price: number;
  imageSrc: string;
  title: string;
}

const WishListSection: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: 1,
      imageSrc: '/assets/images/products/SP1.jpg',
      price: 150000,
      title: 'Roast Chicken Drumsticks',
    },
    {
      id: 2,
      imageSrc: '/assets/images/products/SP2.jpg',
      price: 180000,
      title: 'Grilled Beef Steak',
    },
    {
      id: 3,
      imageSrc: '/assets/images/products/SP3.jpg',
      price: 220000,
      title: 'Spaghetti Pasta',
    },
    {
      id: 4,
      imageSrc: '/assets/images/products/SP4.jpg',
      price: 250000,
      title: 'Beef Meat Steak',
    },
  ]);

  const handleDelete = (id: number) => {
    setFoodItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <section className="bg-bodyBackground w-full text-white py-16">
      <div className="w-mainContainer mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin text-white">
            Danh sách yêu thích
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {foodItems.map((item) => (
            <FoodItemCard
              key={item.id}
              imageSrc={item.imageSrc}
              price={item.price}
              title={item.title}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WishListSection;
