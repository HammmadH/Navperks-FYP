import {
    IoHomeOutline,
    IoNavigateSharp,
    IoMapOutline,
    IoNavigateOutline,
    IoHomeSharp,
  } from "react-icons/io5";
  import { FaSquareParking } from "react-icons/fa6";
  import { FaMap } from "react-icons/fa";
  import { LuSquareParking } from "react-icons/lu";
  
  const AdminBottomBar = ({ activeTab, onSelect }) => {
    const tabOptions = [
      {
        id: "home",
        label: "Home",
        activeIcon: <IoHomeSharp size={20} />,
        icon: <IoHomeOutline size={20} />,
      },
      {
        id: "slots",
        label: "Slots",
        activeIcon: <FaSquareParking size={20} />,
        icon: <LuSquareParking size={20} />,
      },
      {
        id: "account",
        label: "Account",
        activeIcon: <IoNavigateSharp size={20} />,
        icon: <IoNavigateOutline size={20} />,
      }
    ];
  
    // Handle tab click
    const handleTabClick = (tab) => {
      if (tab !== activeTab) {
        onSelect(tab); // Update active tab
      }
    };
  
    return (
      <>
        
          <div className=" fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-50">
            <div className="flex w-full">
              {tabOptions.map((tab) => (
                <div
                  key={tab.id}
                  id={tab.id}
                  className={`flex-1 flex flex-col items-center justify-center cursor-pointer p-2 transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-black font-semibold"
                      : "text-black"
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {activeTab == tab.id ? tab.activeIcon : tab.icon}
                  <span className="text-sm mt-1 text-center">{tab.label}</span>
                </div>
              ))}
            </div>
          </div>
      </>
    );
  };
  
  export default AdminBottomBar;
  