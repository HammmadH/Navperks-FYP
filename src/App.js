import React, { useState, useEffect } from 'react';
import Logo from "./Logo.jpg";
import logo from "./logo2.jpg";
import { IoHomeOutline } from "react-icons/io5";

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
        <div className='rounded-xl flex mx-auto w-4/5 py-4 font-semibold bg-[#2cc40d] hover:bg-[#17502d] hover:text-white justify-center'
          onClick={() => onSelect('bookSlot')}
        >
          BOOK PARKING SLOT
        </div>
        <div className='rounded-xl flex mx-auto w-4/5 py-4 font-semibold bg-[#2cc40d] hover:bg-[#17502d] justify-center hover:text-white'
          onClick={() => onSelect('navigateSlot')}
        >
          NAVIGATE BOOKED SLOT
        </div>
        <div className='rounded-xl flex mx-auto w-4/5 py-4 bg-[#2cc40d] font-semibold hover:bg-[#17502d] hover:text-white justify-center'
          onClick={() => onSelect('navigateKiet')}
        >
          NAVIGATE KIET
        </div>
      </div>
    </div>
  );
}

function BookSlot({ onHomeClick }) {
  return (
    <div>
      <div onClick={onHomeClick} className="cursor-pointer">
        <IoHomeOutline color='#2cc40d' /> Book Parking Slot Component
      </div>
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
