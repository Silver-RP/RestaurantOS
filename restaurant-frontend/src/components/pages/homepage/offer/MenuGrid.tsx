import React from "react";
import MenuItem from "./MenuItem";

interface MenuGridProps {
  items: {
    name: string;
    price: number;
    description: string;
    image: string;
    hoverImage: string;
    slug: string;
    average_rating: number;
  }[];
}

const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 py-4 gap-x-6 gap-y-8">
      {items.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </div>
  );
};

export default MenuGrid;