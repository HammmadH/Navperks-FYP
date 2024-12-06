import { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Map from "./Map";

export default function NavigateKiet({ onHomeClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // Track which section is open
  const [activeFloor, setActiveFloor] = useState(null); // Track the active floor within a department

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSection = (section) => {
    // If the clicked section is already open, close it. Otherwise, open it and close others.
    setActiveSection(activeSection === section ? null : section);
    setActiveFloor(null); // Reset the active floor when changing sections
  };

  const toggleFloor = (section, floor) => {
    // If the clicked floor is already open, close it. Otherwise, open it and close others.
    if (activeSection === section) {
      setActiveFloor(activeFloor === floor ? null : floor);
    }
  };

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <div className={`flex pb-2 pt-5 gap-x-10 px-3 justify-between items-center transition-all duration-300`}>
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
      <div
        className={`fixed top-0 right-0 w-full h-full z-50 bg-white text-black transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-500 ease-in-out`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="font-semibold flex gap-x-2 items-center">
              <div className="w-16 h-16 bg-green-500 text-white text-center flex items-center justify-center rounded-full text-4xl font-semibold shadow-lg">
                K
              </div>
              <div>
                <div className="text-3xl">KIET (NNZ)</div>
                <div className="text-xs font-normal">By Navperks</div>
              </div>
            </div>
            <div className="p-3 bg-gray-200 rounded-full cursor-pointer" onClick={toggleMenu}>
              <RxCross2 size={20} />
            </div>
          </div>

          <div className="mt-8 overflow-y-scroll h-full">
            {/* COCIS Department */}
            <div
              className="text-lg font-semibold cursor-pointer py-2 px-4"
              onClick={() => toggleSection("cocis")}
            >
              COCIS DEPARTMENT
            </div>
            {activeSection === "cocis" && (
              <div className="ml-4">
                <div
                  className={`cursor-pointer py-2 px-4 ${activeFloor === "cocis-floor1" ? "bg-green-100" : ""}`}
                  onClick={() => toggleFloor("cocis", "cocis-floor1")}
                >
                  Floor 1
                </div>
                {activeFloor === "cocis-floor1" && (
                  <div className="ml-8 space-y-1">
                    <div>Helmet Area</div>
                    <div>IT Room</div>
                    <div>COCIS Accounts</div>
                    <div>COCIS Examinations</div>
                    <div>Sports Room</div>
                    <div>Lab 1</div>
                    <div>Lab 2</div>
                    <div>Lab 3</div>
                    <div>DLD Lab</div>
                    <div>Notice Board</div>
                  </div>
                )}
                <div
                  className={`cursor-pointer py-2 px-4 ${activeFloor === "cocis-floor2" ? "bg-green-100" : ""}`}
                  onClick={() => toggleFloor("cocis", "cocis-floor2")}
                >
                  Floor 2
                </div>
                {activeFloor === "cocis-floor2" && (
                  <div className="ml-8 space-y-1">
                    <div>ATM</div>
                    <div>Faculty Room</div>
                    <div>HODS Room</div>
                    <div>COCIS Academics</div>
                    <div>Notice Board</div>
                    <div>Room 1B</div>
                    <div>Room 2B</div>
                    <div>Room 3B</div>
                    <div>GCR</div>
                  </div>
                )}
              </div>
            )}

            {/* COMS Department */}
            <div
              className="text-lg font-semibold cursor-pointer py-2 px-4 mt-4"
              onClick={() => toggleSection("coms")}
            >
              COMS DEPARTMENT
            </div>
            {activeSection === "coms" && (
              <div className="ml-4">
                <div
                  className={`cursor-pointer py-2 px-4 ${activeFloor === "coms-floor1" ? "bg-green-100" : ""}`}
                  onClick={() => toggleFloor("coms", "coms-floor1")}
                >
                  Floor 1
                </div>
                {activeFloor === "coms-floor1" && (
                  <div className="ml-8 space-y-1">
                    <div>Helmet Area</div>
                    <div>Auditorium</div>
                    <div>COMS Accounts</div>
                    <div>COMS Examinations</div>
                    <div>Room 1A</div>
                    <div>Room 1B</div>
                    <div>Room 1C</div>
                  </div>
                )}
                <div
                  className={`cursor-pointer py-2 px-4 ${activeFloor === "coms-floor2" ? "bg-green-100" : ""}`}
                  onClick={() => toggleFloor("coms", "coms-floor2")}
                >
                  Floor 2
                </div>
                {activeFloor === "coms-floor2" && (
                  <div className="ml-8 space-y-1">
                    <div>Faculty Room</div>
                    <div>HODS Room</div>
                    <div>COMS Academics</div>
                    <div>Notice Board</div>
                    <div>Library</div>
                    <div>Prayer Area</div>
                  </div>
                )}
                <div
                  className={`cursor-pointer py-2 px-4 ${activeFloor === "coms-floor3" ? "bg-green-100" : ""}`}
                  onClick={() => toggleFloor("coms", "coms-floor3")}
                >
                  Floor 3
                </div>
                {activeFloor === "coms-floor3" && (
                  <div className="ml-8 space-y-1">
                    <div>Cafeteria</div>
                    <div>Foosball</div>
                    <div>Table Tennis</div>
                    <div>Carrom</div>
                    <div>Sitting Area</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Component */}
      <Map />
    </div>
  );
}
