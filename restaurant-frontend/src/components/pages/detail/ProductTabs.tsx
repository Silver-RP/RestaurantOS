import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

interface TabItem {
  id: string;
  title: string;
  content: string;
}

interface ProductTabsProps {
  tabs: TabItem[];
}

const ProductTabs: React.FC<ProductTabsProps> = ({ tabs }) => {
  const [openTab, setOpenTab] = useState<string | null>(null);

  const toggleTab = (id: string) => {
    setOpenTab((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-10">
      {tabs.map((item) => (
        <div
          key={item.id}
          className="p-4 text-white border border-hr"
        >
          <button
            onClick={() => toggleTab(item.id)}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="font-semibold">{item.title}</span>
            {openTab === item.id ? <FaMinus /> : <FaPlus />}
          </button>
          {openTab === item.id && (
            <div className="mt-3 text-sm text-gray-300">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductTabs;
