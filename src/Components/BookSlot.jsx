import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";

export default function BookSlot({ onHomeClick }) {
  const [mySlots, setMySlots] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [previousSelectedFloor, setPreviousSelectedFloor] = useState(0); // Track previous selection

  useEffect(() => {
    // Store the previous floor when selectedFloor changes
    setPreviousSelectedFloor(selectedFloor);
  }, [selectedFloor]);

  useEffect(() => {
    // Retrieve slots from local storage or initialize
    let slots = JSON.parse(localStorage.getItem("slots")) || [];
    if (slots.length === 0) {
      slots = [
        {
          floor: "Floor 1",
          slots: [
            { id: "F1-S1", reserved: true },
            { id: "F1-S2", reserved: true },
            { id: "F1-S3", reserved: true },
            { id: "F1-S4", reserved: true },
            { id: "F1-S5", reserved: true },
            { id: "F1-S6", reserved: true },
          ],
        },
        {
          floor: "Floor 2",
          slots: [
            { id: "F2-S1", reserved: true },
            { id: "F2-S2", reserved: true },
            { id: "F2-S3", reserved: true },
            { id: "F2-S4", reserved: false },
            { id: "F2-S5", reserved: true },
            { id: "F2-S6", reserved: false },
          ],
        },
        {
          floor: "Floor 3",
          slots: [
            { id: "F3-S1", reserved: false },
            { id: "F3-S2", reserved: false },
            { id: "F3-S3", reserved: true },
            { id: "F3-S4", reserved: true },
            { id: "F3-S5", reserved: false },
            { id: "F3-S6", reserved: false },
          ],
        },
      ];
      localStorage.setItem("slots", JSON.stringify(slots));
    }
    setMySlots(slots);
  }, []);

  const handleSlotClick = (slot) => {
    const bookedSlot = localStorage.getItem("bookedSlot");
    if (bookedSlot) {
      Swal.fire({
        icon: "warning",
        title: "Slot Already Booked",
        text: "You have already booked a slot.",
      });
      return;
    }

    if (slot.reserved) {
      // If the slot is reserved by another user
      Swal.fire({
        icon: "error",
        title: "Slot Already Reserved",
        text: `Slot ${slot.id} is already reserved by another user.`,
      });
      return;
    }

    // If the slot is not reserved, proceed with booking
    Swal.fire({
      title: `Reserve Slot ${slot.id}?`,
      text: "Do you want to confirm your reservation?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reserve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmReservation(slot); // Call reservation function
      }
    });
  };

  const confirmReservation = (slot) => {
    const updatedSlots = mySlots.map((floor) => ({
      ...floor,
      slots: floor.slots.map((s) =>
        s.id === slot.id ? { ...s, reserved: true } : s
      ),
    }));
    setMySlots(updatedSlots);
    localStorage.setItem("slots", JSON.stringify(updatedSlots));
    localStorage.setItem("bookedSlot", slot.id);
    Swal.fire({
      icon: "success",
      title: "Reservation Confirmed",
      text: `Slot ${slot.id} is reserved for you!`,
    });
  };

  return (
    <div className="bg-white  pb-32 scrollbar-hide md:scrollbar-default">
      <div className="bg-slate-100 shadow-2xl">
        {/* Home Button */}
        <div className="flex py-4 px-3 items-center justify-center cursor-pointer rounded">
          <div className="text-[#2cc40d] ml-2 font-extrabold text-2xl">
            BOOK PARKING SLOT
          </div>
        </div>

        {/* Floor Slider */}
        <FloorSlider mySlots={mySlots} />
      </div>
      {/* Slot Container */}
    </div>
  );
}

const FloorSlider = ({ mySlots }) => {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [tabWidth, setTabWidth] = useState(0);
  const [tabPosition, setTabPosition] = useState(0);

  // Handle floor selection click
  const handleFloorClick = (index) => {
    setSelectedFloor(index);
  };

  useEffect(() => {
    // Calculate width and position of the active floor tab dynamically
    const activeTabElement = document.getElementById(`floor-${selectedFloor}`);
    if (activeTabElement) {
      setTabWidth(activeTabElement.offsetWidth);
      setTabPosition(activeTabElement.offsetLeft);
    }
  }, [selectedFloor]);

  return (
    <div className="floor-slider justify-around w-full flex mb-5 relative">
      {/* Tab options - Floor buttons */}
      {mySlots.map((floor, index) => (
        <div
          key={index}
          id={`floor-${index}`}
          onClick={() => handleFloorClick(index)}
          className={`flex py-3 px-2 cursor-pointer items-center justify-center text-base font-semibold relative`}
        >
          <span>{floor.floor}</span>
        </div>
      ))}

      {/* Sliding Green Border */}
      <div
        className="absolute bottom-0 h-1 bg-[#17502d] transition-all duration-300 ease-in-out"
        style={{
          left: `${tabPosition}px`, // Position of the active floor
          width: `${tabWidth}px`, // Width of the active floor tab
        }}
      />
    </div>
  );
};
