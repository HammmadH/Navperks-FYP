import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Car from "../assets/car1.png";
import vertical from "../assets/car.png";
import { FaLongArrowAltUp } from "react-icons/fa";
import car1 from "../assets/SEDAN.jpeg";
import car2 from "../assets/SUV2.jpeg";
import car3 from "../assets/HATCHBACK.jpeg";
import car4 from "../assets/PICKUP.jpeg";

export const carNames = [
  { name: "Honda Civic", type: "Sedan" },
  { name: "Honda City", type: "Sedan" },
  { name: "Honda BR-V", type: "SUV" },

  { name: "Toyota Corolla", type: "Sedan" },
  { name: "Toyota Yaris", type: "Sedan" },
  { name: "Toyota Fortuner", type: "SUV" },
  { name: "Toyota Hilux", type: "Pickup" },
  { name: "Toyota Corolla Cross", type: "Hybrid SUV" },

  { name: "Suzuki Alto", type: "Hatchback" },
  { name: "Suzuki Cultus", type: "Hatchback" },
  { name: "Suzuki Wagon R", type: "Hatchback" },
  { name: "Suzuki Swift", type: "Hatchback" },
  { name: "Suzuki Bolan", type: "MPV" },
  { name: "Suzuki Ravi", type: "Mini Pickup" },

  {
    name: "Hyundai Elantra",
    type: "Sedaundai Sonata",
    type: "Sedaundai Tucson",
    type: "SUundai Santa Fe",
    type: "SUundai Staria",
    type: "Vaundai Ioniq 5",
    type: "EV SUundai Ioniq 6",
    type: "EV Sedaia Picanto",
    type: "Hatchbaca Sportage",
    type: "SUa Sorento",
    type: "SUa Carnival",
    type: "MPhangan Alsvin",
    type: "Sedan",
  },
  { name: "Changan Oshan X7", type: "SUV" },
  { name: "Changan Karvaan", type: "MPV" },
  { name: "Changan M9", type: "Pickup" },

  { name: "MG HS", type: "SUV" },
  { name: "MG ZS", type: "SUV" },
  { name: "MG ZS EV", type: "Electric SUV" },

  { name: "Haval H6", type: "SUV" },
  { name: "Haval Jolion", type: "SUV" },
  { name: "Ora 03", type: "Electric Hatchback" },

  { name: "BAIC D20", type: "Hatchback" },
  { name: "BAIC X25", type: "Compact SUV" },
  { name: "BAIC BJ40", type: "Off-road SUV" },

  { name: "Chery Tiggo 4 Pro", type: "SUV" },
  { name: "Chery Tiggo 8 Pro", type: "SUV" },

  { name: "FAW V2", type: "Hatchback" },
  { name: "FAW XP-V", type: "Van" },
  { name: "FAW Carrier", type: "Mini Pickup" },

  { name: "Proton Saga", type: "Sedan" },
  { name: "Proton X70", type: "SUV" },
];

export default function BookSlot({
  releasing,
  onSelect,
  slots: mySlots,
  bookedSlot,
  bookSlot,
}) {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [animatingSlot, setAnimatingSlot] = useState(null);

 const handleSlotClick = (slot) => {
  if (bookedSlot != null) {
    Swal.fire({
      icon: "warning",
      title: "Slot Already Booked",
      text: "You have already booked a slot.",
    });
    return;
  }

  if (releasing) {
    Swal.fire({
      icon: "warning",
      title: "Releasing",
      text: "Your slot is releasing.",
    });
    return;
  }

  if (slot.reserved) {
    Swal.fire({
      icon: "error",
      title: "Slot Already Reserved",
      text: `Slot ${slot.code} is already reserved by another user.`,
    });
    return;
  }

  Swal.fire({
    title: `Reserve Slot ${slot.code}?`,
    html: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 10px;">
        <div class="car-option" data-value="sedan" style="text-align: center; border: 1px solid #ccc; padding: 10px; cursor: pointer; border-radius: 8px;">
          <img src=${car1} style="width: 100%; height: 90px;" />
          <div style="margin-top: 8px; font-weight: 500;">Sedan</div>
        </div>
        <div class="car-option" data-value="suv" style="text-align: center; border: 1px solid #ccc; padding: 10px; cursor: pointer; border-radius: 8px;">
          <img src=${car2} style="width: 100%; height: 90px;" />
          <div style="margin-top: 8px; font-weight: 500;">SUV</div>
        </div>
        <div class="car-option" data-value="hatchback" style="text-align: center; border: 1px solid #ccc; padding: 10px; cursor: pointer; border-radius: 8px;">
          <img src=${car3} style="width: 100%; height: 90px;" />
          <div style="margin-top: 8px; font-weight: 500;">Hatchback</div>
        </div>
        <div class="car-option" data-value="pickup" style="text-align: center; border: 1px solid #ccc; padding: 10px; cursor: pointer; border-radius: 8px;">
          <img src=${car4} style="width: 100%; height: 90px;" />
          <div style="margin-top: 8px; font-weight: 500;">Pickup</div>
        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonColor: "#d33",
    showConfirmButton: false,
    didOpen: () => {
      const options = Swal.getHtmlContainer().querySelectorAll(".car-option");
      options.forEach((option) =>
        option.addEventListener("click", () => {
          const selectedType = option.getAttribute("data-value");
          Swal.fire({
            title: "Confirm",
            icon: "info",
            text: `Are you sure you want to reserve ${slot.code}?`,
            showCancelButton: true,
            showCloseButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reserve it!",
            cancelButtonText: "No",
          }).then((result) => {
            if (result.isConfirmed) {
              confirmReservation(slot, selectedType);
              Swal.close();
            }
          });
          
        })
      );
    },
  });
};


  const confirmReservation = (slot, carType) => {
    setAnimatingSlot(slot.id);
    setTimeout(() => {
      bookSlot(slot.code, carType);
      setAnimatingSlot(null);
      onSelect("yourSlot");
    }, 4000); // Adjust this timing to match your CSS animation duration
  };

  return (
    <div className="flex flex-col">
      <div className="bg-slate-100 shadow-xl left-0 fixed z-20 w-full top-0">
        {/* Header */}
        <div className="flex py-4 px-3 items-center justify-center rounded">
          <div className="text-[#2cc40d] ml-2 font-extrabold text-2xl">
            BOOK PARKING SLOT
          </div>
        </div>

        {/* Floor Selector */}
        <FloorSlider
          mySlots={mySlots}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
        />
      </div>
      {/* slot container */}
      <div className="grid h-4/6 overflow-y-scroll pt-40 pb-20 grid-cols-3 gap-4 px-4">
        {/* Odd Slots */}
        <div className="py-2 border-t  border-b border-l border-dotted border-gray-400">
          {/* Empty Slot (Above Odd Slots) */}
          <div className="relative h-14 mb-4 cursor-pointer ml-2 p-4 rounded-se-full  shadow bg-gray-100"></div>

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
                  {slot.reserved ? (
                    <img src={Car} className="m-auto" />
                  ) : (
                    <div className="m-auto">Available</div>
                  )}
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
          <div className="relative h-14 cursor-pointer ml-2 p-4 rounded-ee-full shadow bg-gray-100"></div>
        </div>

        {/* Spacer Column */}
        <div className="flex relative flex-col gap-y-4 justify-between items-center h-full pt-32 ">
          {/* Free Slots Information */}
          <div className="flex flex-col justify-center items-center h-[100%] text-gray-200 text-3xl font-extrabold -rotate-90 p-4">
            <div>
              {(() => {
                const freeSlotsCount = mySlots[selectedFloor]?.slots?.filter(
                  (slot) => !slot.reserved
                ).length;
                return freeSlotsCount === 1 ? (
                  <div className="flex gap-x-3">
                    <p className="">{freeSlotsCount} </p>
                    <p>SLOT</p>
                    <p>FREE</p>
                  </div>
                ) : freeSlotsCount && freeSlotsCount > 0 ? (
                  <div className="flex gap-x-3">
                    <p className="">{freeSlotsCount} </p>
                    <p>SLOTS</p>
                    <p>FREE</p>
                  </div>
                ) : (
                  <div className="flex text-red-300 gap-x-3">
                    <p className="">NO </p>
                    <p>SLOT</p>
                    <p>AVAILABLE</p>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <FaLongArrowAltUp className="text-center text-gray-300" size={25} />
            <div className="font-bold text-green-200 ">Entry</div>
          </div>
          {animatingSlot ? (
            <div className="absolute bottom-0 w-full">
              <img
                src={vertical}
                className="animate-car-vanish opacity-60 mx-auto"
                height={0}
                width={40}
                alt="Animating car"
              />
            </div>
          ) : (
            <div className="">
              <img
                src={vertical}
                className="opacity-60"
                height={0}
                width={40}
              />
            </div>
          )}
        </div>
        {/* Even Slots */}
        <div className="py-2 border-t border-b border-r border-dotted border-gray-400">
          {/* Empty Slot (Above Even Slots) */}
          <div className="relative mr-2 h-14 mb-4 cursor-pointer p-4 rounded-ss-full shadow bg-gray-100"></div>

          {/* Locked Slot (Above Even Slots) */}
          <div className="relative mr-2  h-14 mb-4">
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
                  className={`cursor-pointer h-full mr-2 flex  rounded `}
                >
                  {slot.reserved ? (
                    <img src={Car} className="m-auto rotate-180" />
                  ) : (
                    <div className="m-auto">Available</div>
                  )}
                </div>
                {/* Divider Line */}
                <div className="absolute inset-x-0 -bottom-2 h-[1px] border-t border-dotted border-gray-400" />
              </div>
            ))}

          {/* Locked Slot (Below Even Slots) */}
          <div className="relative mr-2 mb-4">
            <div className="cursor-pointer p-4 rounded h-full shadow bg-gray-200">
              <div>Locked</div>
            </div>
          </div>

          {/* Empty Slot (Below Even Slots) */}
          <div className="relative mr-2 cursor-pointer p-4 rounded-es-full h-14 shadow bg-gray-100">
            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FloorSlider = ({ mySlots, selectedFloor, setSelectedFloor }) => {
  const [tabWidth, setTabWidth] = useState(60);
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
          <span>{floor.floor == "CS" ? "COCIS" : "COMS"}</span>
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
