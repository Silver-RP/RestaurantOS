import React from "react";
interface TabsProps {
    tabs: string[];
    activeTab: number;
    setActiveTab: (index: number) => void;
  }
  
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
      <div className="flex justify-center items-center space-x-6 text-secondaryColor font-medium text-sm uppercase tracking-wide">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`pb-2 ${
              activeTab === index
                ? "border-b-2 border-secondaryColor"
                : "text-gray-400 hover:text-secondaryColor"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };

export default Tabs;