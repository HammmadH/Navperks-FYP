import { useState } from "react";
import logo from "../assets/logo2.jpg"
export default function SecondComponent({ onContinue }) {
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
  