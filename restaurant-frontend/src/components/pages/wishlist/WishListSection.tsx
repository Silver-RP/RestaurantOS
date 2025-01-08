import React, { useState } from "react";
import FoodItemCard from "./FoodItemCard";

interface FoodItem {
  id: number;
  price: number;
  imageSrc: string;
  title: string;
  category: string;
  thumbnails: string[];
  description: string; 
  isNew?: boolean;
  discount?: number;
}

const WishListSection: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: 1,
      imageSrc: "/assets/images/products/SP1.jpg",
      price: 150000,
      title: "Roast Chicken Drumsticks",
      category: "Món Gà",
      thumbnails: [
        "/assets/images/products/SP1.jpg",
        "/assets/images/products/SP2.jpg",
      ],
      description: "Một món gà thơm ngon với hương vị đậm đà, thích hợp cho mọi bữa ăn.",
      isNew: true,
      discount: 10,
    },
    {
      id: 2,
      imageSrc: "/assets/images/products/SP2.jpg",
      price: 180000,
      title: "Grilled Beef Steak",
      category: "Món Bò",
      thumbnails: [
        "/assets/images/products/SP2.jpg",
        "/assets/images/products/SP2.jpg",
      ],
      description: "Bít tết bò nướng chín tới, giữ nguyên vị ngọt tự nhiên của thịt.",
      discount: 15,
    },
    {
      id: 3,
      imageSrc: "/assets/images/products/SP3.jpg",
      price: 220000,
      title: "Spaghetti Pasta",
      category: "Món Ý",
      thumbnails: [
        "/assets/images/products/SP33.jpg",
        "/assets/images/products/SP33.jpg",
      ],
      description: "Mỳ Ý sốt cà chua và thịt bò bằm chuẩn vị truyền thống.", 
    },
    {
      id: 4,
      imageSrc: "/assets/images/products/SP4.jpg",
      price: 250000,
      title: "Beef Meat Steak",
      category: "Món Bò",
      thumbnails: [
        "/assets/images/products/SP4.jpg",
        "/assets/images/products/SP4.jpg",
      ],
      description: "Thịt bò bít tết mềm mại, dùng kèm sốt đặc biệt.",
      isNew: true,
    },
  ]);

  const handleDelete = (id: number) => {
    setFoodItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <section className="bg-bodyBackground w-full text-white py-16">
      <div className="w-container95 mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin text-white">
            Danh sách yêu thích
          </h1>
        </div>

        {foodItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {foodItems.map((item) => (
              <FoodItemCard
                key={item.id}
                imageSrc={item.imageSrc}
                price={item.price}
                title={item.title}
                category={item.category}
                thumbnails={item.thumbnails}
                description={item.description}
                isNew={item.isNew}
                discount={item.discount}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-xl font-light text-secondaryColor">
            Danh sách yêu thích của bạn hiện đang trống.
          </p>
        )}
      </div>
    </section>
  );
};

export default WishListSection;
