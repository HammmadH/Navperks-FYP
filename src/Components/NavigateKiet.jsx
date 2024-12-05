import { useState } from "react";
import { IoHomeOutline,  } from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Map from "./Map";

export default function NavigateKiet({ onHomeClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu visibility
  const [expandedSections, setExpandedSections] = useState({}); // State for expanded menu sections

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log("toggle")
  };

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <div
        className={`flex pb-2 pt-5 gap-x-10 px-3 justify-between items-center transition-all duration-300`}
      >
        <IoHomeOutline
          onClick={onHomeClick}
          color="#17502d"
          className="bg-white"
          size={35}
        />
        <div className="relative">
          <IoIosSearch size={35} className="absolute text-gray-400 top-1 left-1" />
          <input
            type="text"
            className="w-full border h-11 rounded-full py-1 pl-10"
            placeholder="Search"
          />
        </div>
        <HiOutlineMenu size={35} onClick={toggleMenu} />
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="fixed h-full w-full bg-yellow-500 top-0 z-50 p-5">
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold">KIET</p>
            <div className="rounded-full bg-gray-500 p-3">
            <RxCross2 size={25} onClick={toggleMenu}/>
            </div>
          </div>
        </div>
      )}

      {/* Map Component */}
      <Map  />
    </div>
  );
}
