import React, { useState, useEffect } from "react";
import { IoHomeOutline, IoClipboardOutline, IoPlayOutline, IoMapOutline } from "react-icons/io5";

const BottomBar = ({ activeTab, onSelect }) => {
  const tabOptions = [
    { id: "home", label: "Home", icon: <IoHomeOutline size={24} /> },
    { id: "bookSlot", label: "Book Now", icon: <IoClipboardOutline size={24} /> },
    { id: "yourSlot", label: "Your Slot", icon: <IoPlayOutline size={24} /> },
    { id: "kiet", label: "Kiet", icon: <IoMapOutline size={24} /> },
  ];

  const [tabWidth, setTabWidth] = useState(0);
  const [tabPosition, setTabPosition] = useState(0);

  // Handle tab click
  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      onSelect(tab); // Update active tab
    }
  };

  useEffect(() => {
    // Calculate width and position of the active tab dynamically
    const activeTabElement = document.getElementById(activeTab);
    if (activeTabElement) {
      setTabWidth(activeTabElement.offsetWidth);
      setTabPosition(activeTabElement.offsetLeft);
    }
  }, [activeTab]);

  return (
    <div className=" fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-50">
      {/* Sliding Background */}
      <div
        className="absolute bottom-0 h-full bg-[#2cc40d] transition-all duration-300 ease-in-out"
        style={{
          width: `${tabWidth}px`,
          left: `${tabPosition}px`,
        }}
      ></div>

      {/* Tab options - Flex container with equal width for each tab */}
      <div className="flex w-full">
        {tabOptions.map((tab) => (
          <div
            key={tab.id}
            id={tab.id}
            className={`flex-1 flex flex-col items-center justify-center cursor-pointer p-3 transition-all duration-300 ${
              activeTab === tab.id ? "text-white z-10" : "text-black"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon}
            <span className="text-lg mt-1 text-center">{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomBar;

