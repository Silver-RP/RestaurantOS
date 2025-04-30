import React from "react";
import { FaDiamond } from "react-icons/fa6";

interface TabNavigationProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex justify-center items-center space-x-4">
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => onTabChange(index)}
              className={`relative pb-2 text-sm font-normal uppercase flex items-center ${
                activeTab === index
                  ? "text-secondaryColor"
                  : " text-white hover:text-secondaryColor"
              } group`}
            >
              <span className="relative">
                {tab}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-secondaryColor transition-all duration-500 ease-in-out ${
                    activeTab === index ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </span>
            </button>
            {index < tabs.length - 1 && (
              <span className="flex items-center">
                <FaDiamond
                  className="text-secondaryColor"
                  style={{ fontSize: "7px", marginBottom: "10px" }}
                />
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <hr className="border-t border-hr mt-4" />
    </div>
  );
};

export default TabNavigation;