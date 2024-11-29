import React, { useState } from "react";

const UniversityMap = () => {
  const [selectedRoom, setSelectedRoom] = useState("");

  // Handler for when a room is clicked
  const handleRoomClick = (roomName) => {
    setSelectedRoom(roomName);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">University Map - COCIS & COMS</h1>
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
        {/* Floor 1 for COCIS Department */}
        <h2 className="text-xl font-semibold mb-2">COCIS - Floor 1</h2>
        <svg viewBox="0 0 200 200" className="w-full h-56 mb-4">
          {/* Helmet Area */}
          <rect
            x="10"
            y="10"
            width="40"
            height="40"
            fill="skyblue"
            onClick={() => handleRoomClick("Helmet Area")}
          />
          <text x="20" y="35" fontSize="10" fill="black">Helmet Area</text>

          {/* IT Room */}
          <rect
            x="60"
            y="10"
            width="40"
            height="40"
            fill="lightcoral"
            onClick={() => handleRoomClick("IT Room")}
          />
          <text x="70" y="35" fontSize="10" fill="black">IT Room</text>

          {/* COCIS Accounts */}
          <rect
            x="110"
            y="10"
            width="40"
            height="40"
            fill="lightgreen"
            onClick={() => handleRoomClick("COCIS Accounts")}
          />
          <text x="115" y="35" fontSize="10" fill="black">Accounts</text>

          {/* Lab 1 */}
          <rect
            x="10"
            y="60"
            width="40"
            height="40"
            fill="lightyellow"
            onClick={() => handleRoomClick("Lab 1")}
          />
          <text x="20" y="85" fontSize="10" fill="black">Lab 1</text>

          {/* Lab 2 */}
          <rect
            x="60"
            y="60"
            width="40"
            height="40"
            fill="lightyellow"
            onClick={() => handleRoomClick("Lab 2")}
          />
          <text x="70" y="85" fontSize="10" fill="black">Lab 2</text>

          {/* Add additional rooms as needed */}
        </svg>

        {/* Floor 1 for COMS Department */}
        <h2 className="text-xl font-semibold mb-2">COMS - Floor 1</h2>
        <svg viewBox="0 0 200 200" className="w-full h-56 mb-4">
          {/* Helmet Area */}
          <rect
            x="10"
            y="10"
            width="40"
            height="40"
            fill="skyblue"
            onClick={() => handleRoomClick("Helmet Area - COMS")}
          />
          <text x="20" y="35" fontSize="10" fill="black">Helmet Area</text>

          {/* Auditorium */}
          <rect
            x="60"
            y="10"
            width="40"
            height="40"
            fill="lightcoral"
            onClick={() => handleRoomClick("Auditorium")}
          />
          <text x="65" y="35" fontSize="10" fill="black">Auditorium</text>

          {/* Additional rooms */}
        </svg>
      </div>

      {/* Room Information Display */}
      {selectedRoom && (
        <div className="mt-4 p-4 bg-blue-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Selected Room</h3>
          <p>{selectedRoom}</p>
        </div>
      )}
    </div>
  );
};

export default UniversityMap;