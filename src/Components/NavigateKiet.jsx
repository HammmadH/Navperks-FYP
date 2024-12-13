import { useState, useEffect, useRef } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import {
  FaBuilding,
  FaPrayingHands,
  FaUserFriends,
  FaMoneyCheck,
  FaBook,
} from "react-icons/fa";
import { MdOutlineSportsEsports, MdOutlineRoom } from "react-icons/md";
import { GiFactory, GiSofa } from "react-icons/gi"; // Add more icons
import Map from "./Map";
import gcr from "../assets/gcr.png";
import accounts from "../assets/accounts.png";
import library from "../assets/library.png";
import pray from "../assets/pray.png";

export default function NavigateKiet({ onHomeClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVerticalMenuOpen, setIsVerticalMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [activeFloor, setActiveFloor] = useState(null);
  const menuRef = useRef(null);

  const departments = {
    cocis: {
      // Add icon here
      floors: {
        "Floor 1": [
          { name: "Helmet Area", icon: <MdOutlineRoom size={20} /> },
          { name: "IT Room", icon: <MdOutlineRoom size={20} /> },
          {
            name: "COCIS Accounts",
            icon: <img src={accounts} height={20} width={20} />,
          },
          { name: "COCIS Examinations", icon: <FaBook size={20} /> },
          { name: "Sports Room", icon: <MdOutlineSportsEsports size={20} /> },
          { name: "Lab 1", icon: <MdOutlineRoom size={20} /> },
          { name: "Lab 2", icon: <MdOutlineRoom size={20} /> },
          { name: "Lab 3", icon: <MdOutlineRoom size={20} /> },
          { name: "DLD Lab", icon: <MdOutlineRoom size={20} /> },
          { name: "Notice Board", icon: <GiSofa size={20} /> },
        ],
        "Floor 2": [
          { name: "ATM", icon: <FaMoneyCheck size={20} /> },
          { name: "Faculty Room", icon: <FaBuilding size={20} /> },
          { name: "HODS Room", icon: <FaBuilding size={20} /> },
          { name: "COCIS Academics", icon: <FaBook size={20} /> },
          { name: "Notice Board", icon: <GiSofa size={20} /> },
          { name: "Room 1B", icon: <MdOutlineRoom size={20} /> },
          { name: "Room 2B", icon: <MdOutlineRoom size={20} /> },
          { name: "Room 3B", icon: <MdOutlineRoom size={20} /> },
          { name: "GCR", icon: <img src={gcr} height={20} width={20} /> }, // Girls Common Room
        ],
      },
    },
    coms: {
      // Example icon for COMS
      floors: {
        "Floor 1": [
          { name: "Helmet Area", icon: <MdOutlineRoom size={20} /> },
          { name: "Auditorium", icon: <MdOutlineRoom size={20} /> },
          {
            name: "COMS Accounts",
            icon: <img src={accounts} height={20} width={20} />,
          },
          { name: "COMS Examinations", icon: <FaBook size={20} /> },
          { name: "Room 1A", icon: <MdOutlineRoom size={20} /> },
          { name: "Room 1B", icon: <MdOutlineRoom size={20} /> },
          { name: "Room 1C", icon: <MdOutlineRoom size={20} /> },
        ],
        "Floor 2": [
          { name: "Faculty Room", icon: <FaBuilding size={20} /> },
          { name: "HODS Room", icon: <FaBuilding size={20} /> },
          { name: "COMS Academics", icon: <FaBook size={20} /> },
          { name: "Notice Board", icon: <GiSofa size={20} /> },
          {
            name: "Library",
            icon: <img src={library} height={20} width={20} />,
          },
          {
            name: "Prayer Area",
            icon: <img src={pray} height={20} width={20} />,
          },
        ],
        "Floor 3": [
          { name: "Cafeteria", icon: <GiSofa size={20} /> },
          { name: "Foosball", icon: <MdOutlineSportsEsports size={20} /> },
          { name: "Table Tennis", icon: <MdOutlineSportsEsports size={20} /> },
          { name: "Carrom", icon: <MdOutlineSportsEsports size={20} /> },
          { name: "Sitting Area", icon: <GiSofa size={20} /> },
        ],
      },
    },
  };

  const facilities = {
    "Prayer Area": { department: "coms", floor: "Floor 2" },
    "Girls' Common Room": { department: "cocis", floor: "Floor 2" },
    Accounts: { department: "cocis", floor: "Floor 1" },
    Library: { department: "coms", floor: "Floor 2" },
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSection(null);
  };

  const toggleVerticalMenu = () => {
    setIsVerticalMenuOpen(!isVerticalMenuOpen);
  };

  const handleFacilityClick = (facility) => {
    const { department, floor } = facilities[facility];
    setActiveSection(department);
    setActiveFloor(floor);
    setIsVerticalMenuOpen(false);
    setIsMenuOpen(true);
  };

  const handleDepartmentClick = (department) => {
    setActiveSection(department);
    setActiveFloor(null);
    setIsVerticalMenuOpen(false);
    setIsMenuOpen(true);
  };

  const toggleFloor = (floor) => {
    setActiveFloor(activeFloor === floor ? null : floor);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsVerticalMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isVerticalMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVerticalMenuOpen]);

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <div className="flex fixed top-0 inset-x-0 w-full pb-2 pt-5 gap-x-10 px-3 justify-between items-center transition-all duration-300">
        <IoHomeOutline
          onClick={onHomeClick}
          color="#17502d"
          className="bg-white"
          size={35}
        />
        <div className="relative">
          <IoIosSearch
            size={35}
            className="absolute text-gray-400 top-1 left-1"
          />
          <input
            type="text"
            className="w-full border h-11 rounded-full py-1 pl-10"
            placeholder="Search"
          />
        </div>
        <HiOutlineMenu size={35} onClick={toggleVerticalMenu} />
      </div>

      {/* Vertical Navbar */}
      {isVerticalMenuOpen && (
        <div
          ref={menuRef}
          className={`fixed top-14 right-0 bottom-0 w-16 gap-y-3  text-sm bg-white shadow-lg z-50 flex flex-col items-center overflow-hidden transition-transform duration-700 ease-in-out transform ${isVerticalMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{ marginTop: "px" }}
        >
          <div
            className="m-4 cursor-pointer flex justify-center items-center w-12 h-12 rounded-full bg-green-500 text-white text-lg font-bold"
            onClick={toggleMenu}
          >
            K
          </div>
          <div className="flex flex-col justify-center">
            <FaBuilding
              className="mx-4 cursor-pointer"
              size={30}
              onClick={() => handleDepartmentClick("cocis")}
              title="COCIS Department"
            />
            <div className="border-t mx-2 mt-2"></div>
            <div className="text-center text-gray-700/75">COCIS</div>
          </div>
          <div className="flex flex-col justify-center">

            <FaBuilding
              className="mx-4 cursor-pointer"
              size={30}
              onClick={() => handleDepartmentClick("coms")}
              title="COMS Department"
            />
            <div className="border-t mx-2 mt-2"></div>
            <div className="text-center text-gray-700/75">COMS</div>
          </div>
          <hr className="w-8 border-gray-300 my-4" />
          <div className="flex flex-col justify-center">

            <img src={pray} height={30} width={30}
              className="mx-4 cursor-pointer"
              onClick={() => handleFacilityClick("Prayer Area")}
              title="Prayer Area"
            />
            <div className="border-t mx-2 mt-2"></div>
            <div className="text-center text-gray-700/75">Pray</div>
          </div>
          <div className="flex flex-col justify-center">

            <img src={gcr} height={30} width={30}
              className="mx-4 cursor-pointer"
              onClick={() => handleFacilityClick("Girls' Common Room")}
              title="Girls' Common Room"
            />
            <div className="border-t mx-2 mt-2"></div>
            <div className="text-center text-gray-700/75">GCR</div>
          </div>
          <div className="flex flex-col justify-center">

            <img src={accounts} height={30} width={30}
              className="mx-4 cursor-pointer"
              onClick={() => handleFacilityClick("Accounts")}
              title="Accounts"
            />
            <div className="border-t mx-2 mt-2"></div>
            <div className="text-center text-gray-700/75">Accounts</div>
          </div>
          <div className="flex flex-col justify-center">

            <img src={library} height={30} width={30}
              className="mx-4 cursor-pointer"
              onClick={() => handleFacilityClick("Library")}
              title="Library"
            />
            <div className="border-t mx-2 mt-2"></div>
            <div className="text-center text-gray-700/75">Library</div>
          </div>
        </div>
      )}

      {/* Main Sidebar */}
      <div
        className={`fixed top-0 right-0 w-full h-full z-50 bg-white text-black transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-500 ease-in-out`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="font-semibold flex gap-x-2 items-center">
              <div className="w-12 h-12 bg-green-500 text-white text-center flex items-center justify-center rounded-full text-3xl font-semibold shadow-lg">
                K
              </div>
              <div>
                <div className="text-3xl">KIET</div>
              </div>
            </div>
            <div
              className="p-3 bg-gray-200 rounded-full cursor-pointer"
              onClick={toggleMenu}
            >
              <RxCross2 size={20} />
            </div>
          </div>

          <div className="mt-8 overflow-y-scroll h-full">
            {Object.keys(departments).map((dept) => (
              <div key={dept}>
                <div
                  className={`text-lg font-semibold cursor-pointer py-2 px-4 ${activeSection === dept ? "text-green-600" : ""
                    }`}
                  onClick={() => setActiveSection(dept)}
                >
                  {departments[dept].icon} {dept.toUpperCase()} DEPARTMENT
                </div>
                {activeSection === dept &&
                  Object.keys(departments[dept].floors).map((floor) => (
                    <div key={floor}>
                      <div
                        className={`ml-8 text-base font-medium cursor-pointer py-1 ${activeFloor === floor
                          ? "text-green-500"
                          : "text-gray-700"
                          }`}
                        onClick={() => toggleFloor(floor)}
                      >
                        {floor}
                      </div>
                      {activeFloor === floor && (
                        <ul className="ml-12">
                          {departments[dept].floors[floor].map((room) => (
                            <li
                              key={room.name}
                              className="text-sm text-gray-600 py-1 flex items-center gap-2"
                            >
                              {room.icon} {room.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Map />
    </div>
  );
}
