import React from "react";

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  image: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, description, image }) => {
  return (
    <div className="flex items-center space-x-4">
      <img src={image} alt={name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <p className="text-secondaryColor font-bold">${price.toFixed(2)}</p>
    </div>
  );
};

export default MenuItem;