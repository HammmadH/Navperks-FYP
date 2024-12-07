import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Car from "../assets/car.png"

export default function BookSlot({ onHomeClick }) {
  const [mySlots, setMySlots] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(0);

  useEffect(() => {
    // Retrieve slots from local storage or initialize them
    let slots = JSON.parse(localStorage.getItem("slots")) || [];
    if (slots.length === 0) {
      slots = [
        {
          floor: "Floor 1",
          slots: [
            { id: "F1-S1", reserved: true },
            { id: "F1-S2", reserved: false },
            { id: "F1-S3", reserved: true },
            { id: "F1-S4", reserved: false },
            { id: "F1-S5", reserved: true },
            { id: "F1-S6", reserved: false },
          ],
        },
        {
          floor: "Floor 2",
          slots: [
            { id: "F2-S1", reserved: false },
            { id: "F2-S2", reserved: true },
            { id: "F2-S3", reserved: false },
            { id: "F2-S4", reserved: true },
            { id: "F2-S5", reserved: false },
            { id: "F2-S6", reserved: true },
          ],
        },
        {
          floor: "Floor 3",
          slots: [
            { id: "F3-S1", reserved: true },
            { id: "F3-S2", reserved: false },
            { id: "F3-S3", reserved: false },
            { id: "F3-S4", reserved: true },
            { id: "F3-S5", reserved: false },
            { id: "F3-S6", reserved: true },
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
      Swal.fire({
        icon: "error",
        title: "Slot Already Reserved",
        text: `Slot ${slot.id} is already reserved by another user.`,
      });
      return;
    }

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
        confirmReservation(slot);
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
    <div className="">
      <div className="bg-slate-100 shadow-xl fixed z-20 w-full top-0">
        {/* Header */}
        <div className="flex py-4 px-3 items-center justify-center rounded">
          <div className="text-[#2cc40d] ml-2 font-extrabold text-2xl">
            BOOK PARKING SLOT
          </div>
        </div>

        {/* Floor Selector */}
        <FloorSlider mySlots={mySlots} selectedFloor={selectedFloor} setSelectedFloor={setSelectedFloor} />
      </div>
      {/* slot container */}
      <div className="grid mt-40 grid-cols-3 gap-4 px-4">
        {/* Odd Slots */}
        <div className="py-2 border-t  border-b border-l border-dotted border-gray-400">
          {/* Empty Slot (Above Odd Slots) */}
          <div className="relative h-14 mb-4 cursor-pointer ml-2 p-4 rounded-se-full  shadow bg-gray-100">
          </div>

          {/* Locked Slot (Above Odd Slots) */}
          <div className="relative h-14 mb-4">
            <div className="cursor-pointer ml-2 h-full p-4 rounded shadow bg-gray-200">
              <div>Locked</div>
            </div>
          </div>

          {/* Odd Slots with Divider Lines */}
          {mySlots[selectedFloor]?.slots
            ?.filter((_, index) => index % 2 === 0)
            .map((slot, index) => (
              <div key={slot.id} className="relative mb-4 h-14">
                <div
                  onClick={() => handleSlotClick(slot)}
                  className={`cursor-pointer h-full ml-2 flex  rounded `}
                >
                  {slot.reserved ? <img src={Car} className="m-auto" /> : <div className="m-auto">Available</div>}
                </div>
                {/* Divider Line */}
                <div className="absolute inset-x-0 -bottom-2 h-[1px] border-t border-dotted border-gray-400" />
              </div>
            ))}

          {/* Locked Slot (Below Odd Slots) */}
          <div className="relative h-14 mb-4">
            <div className="cursor-pointer h-full ml-2 p-4 rounded shadow bg-gray-200">
              <div>Locked</div>
            </div>
          </div>

          {/* Empty Slot (Below Odd Slots) */}
          <div className="relative h-14 cursor-pointer ml-2 p-4 rounded-ee-full shadow bg-gray-100">
          </div>
        </div>

        {/* Spacer Column */}
        <div className="flex flex-col gap-y-10  justify-between py-14 items-center h-full">
          {/* Free Slots Information */}
          <div className="flex flex-col justify-center items-center h-4/5  -rotate-90 p-4">
            <div>
              {(() => {
                const freeSlotsCount = mySlots[selectedFloor]?.slots?.filter(
                  (slot) => !slot.reserved
                ).length;
                return freeSlotsCount === 1 ? (
                  <div className="flex gap-x-3 text-xl font-bold">
                  <p className="">{freeSlotsCount}  </p>
                  <p>Slot</p>
                  <p>Free</p>
                  </div>
                ) : freeSlotsCount && freeSlotsCount > 0 ? (
                  <div className="flex gap-x-3 text-xl font-bold">
                  <p className="">{freeSlotsCount}  </p>
                  <p>Slots</p>
                  <p>Free</p>
                  </div>
                ) : (
                  <div className="flex text-red-300 text-xl font-bold gap-x-3">
                  <p className="">No  </p>
                  <p>Slot</p>
                  <p>Available</p>
                  </div>
                );
              })()}
            </div>
          </div>
          <div className="rotate-90"><img src={Car} className="opacity-60"/></div>
        </div>
        {/* Even Slots */}
        <div className="py-2 border-t border-b border-r border-dotted border-gray-400">
          {/* Empty Slot (Above Even Slots) */}
          <div className="relative h-14 mb-4 cursor-pointer p-4 rounded-ss-full shadow bg-gray-100">

          </div>

          {/* Locked Slot (Above Even Slots) */}
          <div className="relative  h-14 mb-4">
            <div className="cursor-pointer p-4 rounded shadow bg-gray-200">
              <div>Locked</div>
            </div>
          </div>

          {/* Even Slots with Divider Lines */}
          {mySlots[selectedFloor]?.slots
            ?.filter((_, index) => index % 2 !== 0)
            .map((slot, index) => (
              <div key={slot.id} className="relative mb-4 h-14">
                <div
                  onClick={() => handleSlotClick(slot)}
                  className={`cursor-pointer h-full ml-2 flex  rounded `}
                >
                  {slot.reserved ? <img src={Car} className="m-auto rotate-180" /> : <div className="m-auto">Available</div>}
                </div>
                {/* Divider Line */}
                <div className="absolute inset-x-0 -bottom-2 h-[1px] border-t border-dotted border-gray-400" />
              </div>
            ))}

          {/* Locked Slot (Below Even Slots) */}
          <div className="relative mb-4">
            <div className="cursor-pointer p-4 rounded h-full shadow bg-gray-200">
              <div>Locked</div>
            </div>
          </div>

          {/* Empty Slot (Below Even Slots) */}
          <div className="relative cursor-pointer p-4 rounded-es-full h-14 shadow bg-gray-100">
            <div className="">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const FloorSlider = ({ mySlots, selectedFloor, setSelectedFloor }) => {

  const [tabWidth, setTabWidth] = useState(70);
  const [tabPosition, setTabPosition] = useState(35);

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

