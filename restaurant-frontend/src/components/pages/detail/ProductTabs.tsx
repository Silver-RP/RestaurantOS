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
  
  // Đảm bảo state được cập nhật khi defaultOpenTab thay đổi
  useEffect(() => {
    setOpenTab(defaultOpenTab);
  }, [defaultOpenTab]);
  
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
          maxHeight: isOpen ? '2000px' : '0px', // Đủ lớn để không bị cắt
          overflow: isOpen ? 'visible' : 'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)'
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