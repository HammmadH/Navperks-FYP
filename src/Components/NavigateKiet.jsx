import { useState, useEffect, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineSportsEsports, MdOutlineRoom } from "react-icons/md";
import { GiSofa } from "react-icons/gi"; // Add more icons
import { IoArrowBackSharp, IoMenu, IoLocationSharp } from "react-icons/io5";
import { PiDotsThreeVertical } from "react-icons/pi";
import {
  FaBuilding,
  FaMoneyCheck,
  FaBook,
  FaDotCircle
} from "react-icons/fa";
import Map from "./Map";
import gcr from "../assets/gcr.png";
import accounts from "../assets/accounts.png";
import library from "../assets/library.png";
import pray from "../assets/pray.png";

export default function NavigateKiet({ onHomeClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDirectionPageOpen, setIsDirectionPageOpen] = useState(false);
  const [isVerticalMenuOpen, setIsVerticalMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [activeFloor, setActiveFloor] = useState(null);
  const menuRef = useRef(null);

  const departments = {
    cocis: {
      // Add icon here

      "Floor 1": [
        // { name: "Helmet Area", icon: <MdOutlineRoom size={20} /> },
        // { name: "IT Room", icon: <MdOutlineRoom size={20} />, x: 369.98, y: 632, height: 54.05, width: 87.61 },
        {
          name: "COCIS Accounts",
          icon: <img src={accounts} height={20} width={20} />, x: 170.72, y: 686.79, height: 54.05, width: 87.61
        },
        { name: "COCIS Examinations", icon: <FaBook size={20} />, x: 62.98, y: 578.69, height: 79, width: 89.98 },
        { name: "Lab 1", icon: <MdOutlineRoom size={20} />, x: 62.98, y: 387.43, height: 93.55, width: 89.98 },
        { name: "Lab 2", icon: <MdOutlineRoom size={20} />, x: 62.98, y: 289.73, height: 93.55, width: 89.98 },
        { name: "Lab 3", icon: <MdOutlineRoom size={20} />, x: 232.28, y: 422.78, height: 93.55, width: 89.98 },
        { name: "Lab 4", icon: <MdOutlineRoom size={20} />, x: 232.28, y: 325.07, height: 93.55, width: 89.98 },
        { name: "Lab 5", icon: <MdOutlineRoom size={20} />, x: 232.28, y: 228.4, height: 93.55, width: 89.98 },
        { name: "Lab 6", icon: <MdOutlineRoom size={20} />, x: 232.28, y: 131.73, height: 93.55, width: 89.98 },
        { name: "DLD Lab", icon: <MdOutlineRoom size={20} />, x: 61.8, y: 131.73, height: 152.8, width: 89.98 },
        { name: "Server Room", icon: <MdOutlineRoom size={20} />, x: 62.98, y: 483.06, height: 44.7, width: 89.98 },
        { name: "Sports Room", icon: <MdOutlineSportsEsports size={20} />, x: 62.98, y: 530.88, height: 44.7, width: 89.98 },
        // { name: "Notice Board", icon: <GiSofa size={20} /> },
        { name: "Faculty Washroom 1", icon: <FaBook size={20} />, x: 60.61, y: 88.08, height: 39.5, width: 89.98 },
        { name: "Faculty Washroom 2", icon: <FaBook size={20} />, x: 233.47, y: 88.08, height: 39.5, width: 89.98 },
        { name: "President", icon: <FaBook />, x: 62.98, y: 660.81, height: 79, width: 68.67 },
        { name: "Washroom", icon: <FaBook />, x: 32.83, y: 702.38, height: 37.42, width: 34.33 }
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
    coms: {

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
  };

  const facilities = {
    "Prayer Area": { department: "coms", floor: "Floor 2" },
    "Girls' Common Room": { department: "cocis", floor: "Floor 2" },
    "Accounts": { department: "cocis", floor: "Floor 1" },
    "Library": { department: "coms", floor: "Floor 2" },
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSection(null);
  };

  const toggleVerticalMenu = () => {
    setIsVerticalMenuOpen(!isVerticalMenuOpen);
  };

  const toggleDirectionPage = () => {
    setIsDirectionPageOpen(!isDirectionPageOpen);
  }

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
      {/* Search Bar */}
      <div className=" fixed top-0 inset-x-0 w-full pt-5 pb-2 gap-x-10 px-3 bg-gray-100 transition-all duration-300">
        <div className="relative w-full">
          <FaLocationDot
            size={25}
            className="absolute text-gray-400 top-[10px] left-2"
          />
          <input
            type="text"
            className="w-full border h-12 bg-white rounded-full py-1 px-10 text-lg"
            placeholder="Search Here"
          />

          <div
            className="absolute top-2 right-2 cursor-pointer flex justify-center items-center w-[32px] h-[32px] rounded-full bg-[#2cc40d] text-white font-bold"
            onClick={toggleMenu}
          >
            K
          </div>
        </div>
        <div className="flex justify-start gap-x-2  overflow-x-scroll py-2">
          <div onClick={() => handleDepartmentClick("cocis")} className="flex gap-x-1 text-[12px] px-3 py-1 items-center rounded-full shadow-sm bg-white text-black justify-center cursor-pointer">
            <FaBuilding
              size={12}
              title="COCIS Department"
            />
            <div className="text-center text-gray-700/75">COCIS</div>
          </div>
          <div onClick={() => handleDepartmentClick("coms")} className="flex gap-x-1 text-[12px] px-3 py-1 items-center rounded-full shadow-sm bg-white text-black justify-center cursor-pointer">

            <FaBuilding
              size={12}
              title="COMS Department"
            />
            <div className="text-center text-gray-700/75">COMS</div>
          </div>
          <div onClick={() => handleFacilityClick("Prayer Area")} className="flex gap-x-1 text-[12px] px-3 py-1 items-center rounded-full shadow-sm bg-white text-black justify-center cursor-pointer">

            <img src={pray} height={12} width={12}
              title="Prayer Area"
            />
            <div className="text-center text-gray-700/75">Pray</div>
          </div>
          <div onClick={() => handleFacilityClick("Girls' Common Room")} className="flex gap-x-1 text-[12px] px-3 py-1 items-center rounded-full shadow-sm bg-white text-black justify-center cursor-pointer">

            <img src={gcr} height={12} width={12}
              title="Girls' Common Room"
            />
            <div className="text-center text-gray-700/75">GCR</div>
          </div>
          <div onClick={() => handleFacilityClick("Accounts")} className="flex gap-x-1 text-[12px] px-3 py-1 items-center rounded-full shadow-sm bg-white text-black justify-center cursor-pointer">
            <img src={accounts} height={12} width={12}
              title="Accounts"
            />
            <div className="text-center text-gray-700/75">Accounts</div>
          </div>
          <div onClick={() => handleFacilityClick("Library")} className="flex gap-x-1 text-[12px] px-3 py-1 items-center rounded-full shadow-sm bg-white text-black justify-center cursor-pointer">

            <img src={library} height={12} width={12}
              title="Library"
            />
            <div className="text-gray-700/75">Library</div>
          </div></div>
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

      <div
        className={`fixed top-0 inset-x-0 w-screen h-full z-30 bg-gray-100 text-black transform ${isDirectionPageOpen ? "translate-y-0" : "translate-y-full"
          } transition-transform duration-700 ease-in-out py-5 px-2`}
      >
        <div className="flex justify-center gap-x-2 items-start w-full">
          <button onClick={toggleDirectionPage} className="p-2 rounded-full shadow bg-white" ><IoArrowBackSharp size={20} /></button>
          <div className="flex justify-center gap-x-1">
            <div className="flex flex-col justify-center items-center gap-y-2">
              <FaDotCircle size={15} color="blue" />
              <PiDotsThreeVertical size={20} />
              <IoLocationSharp size={20} color="red" />
            </div>
            <div className="flex relative flex-col w-full gap-y-3">
              <input type="text" className="border rounded-md border-black bg-white text-lg px-3 py-2 w-full" placeholder="Select Your Location" />
             { <div className="absolute top-12 border border-black bg-white rounded h-[300px] p-2 w-full">
                <div className="w-full overflow-y-scroll h-full p-2">
                  {Object.keys(departments).map((departmentKey) => (
              <>
                      {Object.keys(departments[departmentKey]).map((floorKey) => (
                        <>
                          {departments[departmentKey][floorKey].map((room, index) => (
                            <div key={index} className="w-full p-1">{room.name}</div>
                          ))}
                        </>
                      ))}
                </>
                  ))}

                </div>
              </div>}
              <input type="text" className="border rounded-md border-black bg-white text-lg px-3 py-2 w-full" placeholder="Choose Destination" />
            </div>
          </div>
          <button onClick={toggleMenu} className="p-2 rounded-full shadow bg-white"><IoMenu size={20} /></button>
        </div>
      </div>
      <Map onHomeClick={onHomeClick} toggleDirectionPage={toggleDirectionPage} />
    </div>
  );
}
