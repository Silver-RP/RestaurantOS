import React from "react";
import MenuItem from "./MenuItem";

interface MenuGridProps {
  items: { name: string; price: number; description: string; image: string; hoverImage: string, slug: string  }[];
}

const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32">
      {items.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </div>
  );
};

export default MenuGrid;