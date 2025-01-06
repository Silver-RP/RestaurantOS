import React from "react";

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  image: string;
  hoverImage: string; 
}

const MenuItem: React.FC<MenuItemProps> = ({ name, price, description, image, hoverImage }) => {
  return (
    <div className="relative flex items-center space-x-4 py-4 group">
      <div className="relative w-20 h-20">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded transition-transform duration-500 group-hover:scale-110 group-hover:opacity-0"
        />

        <img
          src={hoverImage}
          alt={`${name} Hover`}
          className="absolute inset-0 w-full h-full object-cover rounded scale-50 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <div className="flex-grow border-t mt-4 border-dotted border-hr mx-4"></div>
          <p className="text-secondaryColor font-bold">${price.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-400 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default MenuItem;