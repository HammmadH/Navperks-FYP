import { IoArrowDownOutline } from "react-icons/io5"; // Import down arrow icon
import React, { useState, useEffect } from 'react';
import Logo from "./Logo.jpg";
import logo from "./logo2.jpg";
import car from "./car.jpg"
import { IoHomeOutline } from "react-icons/io5";

function FirstComponent() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <img src={Logo} alt='logo' />
    </div>
  );
}

function FirstComponent() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <img src={Logo} alt='logo' />
    </div>
  );
}

function SecondComponent({ onContinue }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAgree = () => {
    localStorage.setItem('userAgreement', 'true');
    onContinue(); // Proceed to MainComponent
  };

  return (
    <div className='flex flex-col justify-center p-5'>
      <img src={logo} alt='logo' className='w-3/5 h-auto -mt-5 mx-auto' />
      <p className='block px-3 -mt-5 text-sm py-2'>
        <span className='font-bold'>NAVPERKS</span> asks for your consent to use your personal data for the smooth 
        <span className='font-bold'> Parking Management</span> and <span className='font-bold'>Indoor Navigation</span>.
      </p>
      <div className='flex justify-start items-start mt-32'>
        <input
          type="checkbox"
          className='h-5 w-5 mr-2 mt-1' 
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <p>
          I agree to the <span className='text-blue-500 underline'>Terms and <br />Conditions</span> described in the user policy
        </p>
      </div>
      <br />
      <button onClick={handleAgree} disabled={!isChecked} className='w-full rounded-xl py-2 bg-[#2cc40d] hover:bg-[#17502d] transition-all ease-in-out duration-300'>
        Continue
      </button>
    </div>
  );
}

function MainComponent({ onSelect }) {
  return (
    <div className='flex flex-col justify-start'>
      <div className='flex flex-col -mt-5 justify-start items-center bg-none border-b-black '>
        <img className='w-3/5' src={Logo} alt='Logo' />
        <span className='font-bold text-3xl -mt-2'>User Dashboard</span>
      </div>
      <div className='flex h-96 flex-col justify-evenly mt-2'>
        <div className='rounded-xl flex mx-auto w-4/5 py-5 text-lg font-semibold bg-[#2cc40d] hover:bg-[#17502d] hover:text-white justify-center'
          onClick={() => onSelect('bookSlot')}
        >
          BOOK PARKING SLOT
        </div>
        <div className='rounded-xl flex mx-auto w-4/5 py-5 text-lg font-semibold bg-[#2cc40d] hover:bg-[#17502d] justify-center hover:text-white'
          onClick={() => onSelect('navigateSlot')}
        >
          NAVIGATE BOOKED SLOT
        </div>
        <div className='rounded-xl flex mx-auto w-4/5 py-5 text-lg bg-[#2cc40d] font-semibold hover:bg-[#17502d] hover:text-white justify-center'
          onClick={() => onSelect('navigateKiet')}
        >
          NAVIGATE KIET
        </div>
      </div>
    </div>
  );
}



function BookSlot({ onHomeClick }) {
  const [mySlots, setMySlots] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    // Retrieve slots from local storage or initialize
    let slots = JSON.parse(localStorage.getItem("slots")) || [];
    if (slots.length === 0) {
      slots = [
        {
          "floor": "Floor 1",
          "slots": [
            { "id": "F1-S1", "reserved": true },
            { "id": "F1-S2", "reserved": true },
            { "id": "F1-S3", "reserved": true },
            { "id": "F1-S4", "reserved": false },
            { "id": "F1-S5", "reserved": false },
            { "id": "F1-S6", "reserved": false }
          ]
        },
        {
          "floor": "Floor 2",
          "slots": [
            { "id": "F2-S1", "reserved": true },
            { "id": "F2-S2", "reserved": true },
            { "id": "F2-S3", "reserved": true },
            { "id": "F2-S4", "reserved": false },
            { "id": "F2-S5", "reserved": true },
            { "id": "F2-S6", "reserved": false }
          ]
        },
        {
          "floor": "Floor 3",
          "slots": [
            { "id": "F3-S1", "reserved": false },
            { "id": "F3-S2", "reserved": false },
            { "id": "F3-S3", "reserved": true },
            { "id": "F3-S4", "reserved": true },
            { "id": "F3-S5", "reserved": false },
            { "id": "F3-S6", "reserved": false }
          ]
        }
      ];
      localStorage.setItem("slots", JSON.stringify(slots));
    }
    setMySlots(slots);
  }, []);

  const handleSlotClick = (slot) => {
    const bookedSlot = localStorage.getItem("bookedSlot");
    if (bookedSlot) {
      alert("You have already booked a slot.");
      return;
    }
    if (!slot.reserved) {
      setSelectedSlot(slot);
      setIsModalOpen(true);
    }
  };

  const confirmReservation = () => {
    const updatedSlots = mySlots.map(floor => ({
      ...floor,
      slots: floor.slots.map(s => (s.id === selectedSlot.id ? { ...s, reserved: true } : s))
    }));
    setMySlots(updatedSlots);
    localStorage.setItem("slots", JSON.stringify(updatedSlots));
    localStorage.setItem("bookedSlot", selectedSlot.id); // Save booked slot
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="bg-gray-100 p-5">
      {/* Home Button */}
      <div onClick={onHomeClick} className="flex py-4 px-3 items-center justify-evenly bg-black cursor-pointer rounded">
        <IoHomeOutline color='#17502d' className='rounded-full p-3 bg-white' size={45} />
        <div className='ml-2 font-extrabold text-xl text-white'>BOOK PARKING SLOT</div>
      </div>

      {/* Floor Slider */}
      <div className="floor-slider mt-2 flex overflow-x-auto p-2">
        {mySlots.map((floor, index) => (
          <button
            key={index}
            onClick={() => setSelectedFloor(index)}
            className={`min-w-[100px] py-2 px-4 mx-2 rounded ${selectedFloor === index ? 'bg-blue-500' : 'bg-gray-300'} text-white`}
          >
            {floor.floor}
          </button>
        ))}
      </div>

      {/* Selected Floor Title */}
      {mySlots.length > 0 && (
        <h2 className="mb-3 text-2xl font-bold text-center">{mySlots[selectedFloor]?.floor.toUpperCase()} SLOTS</h2>
      )}

      {/* Slot Container */}
      <div className="slot-container flex flex-wrap gap-5 justify-center">
        {mySlots[selectedFloor]?.slots.map(slot => (
          <div
            key={slot.id}
            onClick={() => handleSlotClick(slot)}
            className={`w-20 h-36 flex items-center justify-center rounded-lg border border-gray-500 ${slot.reserved ? 'bg-red-500' : 'bg-gray-300'} cursor-pointer relative`}
          >
            {slot.reserved ? (
              <img src={car} alt='car' className='absolute inset-0 w-full h-full rounded-lg' />
            ) : (
              <span className="text-black font-semibold">{slot.id}</span>
            )}
            <div className="absolute bottom-0 right-0 mb-1 mr-1 text-gray-500">⬇️</div>
          </div>
        ))}
      </div>

      {/* Modal for Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 w-4/5 mx-auto h-44 mt-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5">
            <h3 className="text-lg font-bold mb-4">Confirm Reservation</h3>
            <p>Are you sure you want to reserve the slot: {selectedSlot?.id}?</p>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white py-1 px-3 rounded mr-2">Cancel</button>
              <button onClick={confirmReservation} className="bg-green-500 text-white py-1 px-3 rounded">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





function NavigateSlot({ onHomeClick }) {
  return (
    <div>
      <div onClick={onHomeClick} className="cursor-pointer">
        <IoHomeOutline color='#2cc40d' /> Navigate Booked Slot Component
      </div>
    </div>
  );
}

function NavigateKiet({ onHomeClick }) {
  return (
    <div>
      <div onClick={onHomeClick} className="cursor-pointer">
        <IoHomeOutline color='#2cc40d' /> Navigate KIET Component
      </div>
    </div>
  );
}

function App() {
  const [step, setStep] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Check localStorage for user agreement on mount
  useEffect(() => {
    const userAgreed = localStorage.getItem('userAgreement') === 'true';
   
    // Show FirstComponent for 3 seconds
    const timer = setTimeout(() => {
      if (userAgreed) {
        setStep(3); // If user agreed, move to MainComponent
      } else {
        setStep(2); // If user hasn't agreed, move to SecondComponent
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setStep(3); // Move to MainComponent
  };

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  const handleHomeClick = () => {
    setSelectedComponent(null); // Return to MainComponent
  };

  return (
    <div>
      {step === 1 && <FirstComponent />}
      {step === 2 && <SecondComponent onContinue={handleContinue} />}
      {step === 3 && !selectedComponent && <MainComponent onSelect={handleSelectComponent} />}
      {selectedComponent === 'bookSlot' && <BookSlot onHomeClick={handleHomeClick} />}
      {selectedComponent === 'navigateSlot' && <NavigateSlot onHomeClick={handleHomeClick} />}
      {selectedComponent === 'navigateKiet' && <NavigateKiet onHomeClick={handleHomeClick} />}
    </div>
  );
}



export default App;
