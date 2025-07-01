import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode | string;
}

interface ProductTabsProps {
  tabs: TabItem[];
  defaultOpenTab?: string | null;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ tabs, defaultOpenTab = null }) => {
  const [openTab, setOpenTab] = useState<string | null>(defaultOpenTab);
  
  return (
    <div className="mt-8">
      {tabs.map((item) => (
        <Tab 
          key={item.id} 
          item={item} 
          isOpen={openTab === item.id} 
          onToggle={(id) => setOpenTab(prev => prev === id ? null : id)} 
        />
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
  const [height, setHeight] = useState('0px');
  
  useEffect(() => {
    if (isOpen) {
      setHeight(`${contentRef.current?.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [isOpen]);
  
  return (
    <div className="border border-hr rounded-lg px-4 mb-4">
    <button
      onClick={() => onToggle(item.id)}
      className="w-full flex items-center justify-between text-left py-4 text-white font-medium"
    >
      <span className="leading-none">{item.title}</span>
      <span className="text-gray-400 text-lg">
        {isOpen ? <FaMinus /> : <FaPlus />}
      </span>
    </button>
  
    <div 
      ref={contentRef}
      style={{ 
        maxHeight: height,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out'
      }}
      className="px-2"
    >
      {typeof item.content === 'string' ? (
        <div className="text-white py-4 leading-relaxed">{item.content}</div>
      ) : (
        item.content
      )}
    </div>
  </div>
  );
};

export default ProductTabs;