import React, { useState, useRef, useEffect } from "react";
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
    <div className="mt-10 space-y-4">
      {tabs.map((item) => (
        <Tab key={item.id} item={item} isOpen={openTab === item.id} onToggle={toggleTab} />
      ))}
    </div>
  );
};

interface SingleTabProps {
  item: TabItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const Tab: React.FC<SingleTabProps> = ({ item, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>("0px");

  useEffect(() => {
    if (isOpen) {
      setHeight(`${contentRef.current?.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div className="p-4 text-white border border-hr rounded-md overflow-hidden transition-all duration-300">
      <button
        onClick={() => onToggle(item.id)}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-semibold">{item.title}</span>
        {isOpen ? <FaMinus /> : <FaPlus />}
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          height,
        }}
        className="transition-all duration-300 ease-in-out overflow-hidden text-sm text-gray-300"
      >
        <div className="pt-4">{item.content}</div>
      </div>
    </div>
  );
};

export default ProductTabs;