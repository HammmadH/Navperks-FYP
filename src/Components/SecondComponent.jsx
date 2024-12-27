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
      <div className='flex justify-start items-start mt-32 gap-x-3'>
        <div className="inline-flex items-center">
          <label className="flex items-center cursor-pointer relative">
            <input type="checkbox" onClick={()=>{setIsChecked(!isChecked)}} className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-green-600 checked:border-green-600" id="check4" />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </span>
          </label>
        </div>
        <p>
          I agree to the <span className='text-blue-500 underline'>Terms and <br />Conditions</span> described in the user policy
        </p>
      </div>
      <br />
      <button onClick={handleAgree} disabled={!isChecked} className='w-full rounded-xl  py-2 bg-[#2cc40d] hover:bg-[#17502d] transition-all ease-in-out duration-300'>
        Continue
      </button>
    </div>
  );
}
