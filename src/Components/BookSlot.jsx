import { useEffect, useState } from "react";
import car from "../assets/car.jpg";
import { IoHomeOutline } from "react-icons/io5";
import Swal from "sweetalert2";

export default function BookSlot({ onHomeClick }) {
  const [mySlots, setMySlots] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

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
            { id: "F1-S4", reserved: false },
            { id: "F1-S5", reserved: false },
            { id: "F1-S6", reserved: false },
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

 

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const floorWidth = e.target.clientWidth; // width of the container
    const floorIndex = Math.floor(scrollLeft / floorWidth); // calculate the index based on scroll position

    if (floorIndex !== selectedFloor) {
      setSelectedFloor(floorIndex);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX); // store the initial touch position
  };

  const handleTouchMove = (e) => {
    const touchEndX = e.touches[0].clientX;
    const touchDelta = touchEndX - touchStartX;

    if (touchDelta > 50 && selectedFloor > 0) {
      setSelectedFloor((prev) => prev - 1); // swipe right, go to the previous floor
    } else if (touchDelta < -50 && selectedFloor < mySlots.length - 1) {
      setSelectedFloor((prev) => prev + 1); // swipe left, go to the next floor
    }
  };

  return (
    <div
      className="bg-gray-100 p-5 mb-10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Home Button */}
      <div
        onClick={onHomeClick}
        className="flex py-4 px-3 items-center justify-evenly bg-black cursor-pointer rounded"
      >
        <IoHomeOutline
          color="#17502d"
          className="rounded-full p-3 bg-white"
          size={45}
        />
        <div className="ml-2 font-extrabold text-xl text-white">
          BOOK PARKING SLOT
        </div>
      </div>

      {/* Floor Slider */}
      <div
  className="floor-slider mt-2 flex p-2 justify-between"
  onScroll={handleScroll} // You can remove this if you don’t need scroll handling
>
  {mySlots.map((floor, index) => (
    <button
      key={index}
      onClick={() => setSelectedFloor(index)}
      className={`flex-1 py-3 px-6 text-base font-semibold rounded ${
        selectedFloor === index ? "bg-blue-500" : "bg-gray-300"
      } text-white mx-2`} // Added margin for spacing between buttons
    >
      {floor.floor}
    </button>
  ))}
</div>


      {/* Selected Floor Title */}
      {mySlots.length > 0 && (
        <h2 className="mb-3 text-2xl font-bold text-center">
          {mySlots[selectedFloor]?.floor.toUpperCase()} SLOTS
        </h2>
      )}

      {/* Slot Container */}
      <div className="slot-container grid grid-cols-2 gap-4 overflow-y-scroll">
        {mySlots[selectedFloor]?.slots.map((slot) => (
          <div
            key={slot.id}
            onClick={() => handleSlotClick(slot)}
            className={`h-52 flex items-center justify-center rounded-lg border border-gray-500 ${
              slot.reserved ? "bg-red-500" : "bg-gray-300"
            } cursor-pointer relative`}
          >
            {slot.reserved ? (
              <img
                src={car}
                alt="car"
                className="absolute inset-0 w-full h-full rounded-lg"
              />
            ) : (
              <span className="text-black font-semibold">{slot.id}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
