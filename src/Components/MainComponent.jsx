import { useState } from "react";
import Logo from "../assets/Logo.jpg";
export default function MainComponent({ onSelect }) {
  const [text, setText] = useState("There is no any event or notice for now in KIET.");
  return (
    <div className='flex flex-col justify-start overflow-scroll'>
      <div className='flex flex-col -mt-5 justify-start items-center bg-none border-b-black '>
        <img className='w-3/5' src={Logo} alt='Logo' />
        <span className='font-bold text-3xl -mt-2'>User Dashboard</span>
      </div>
      <div className="py-5 mt-10 h-full flex flex-col gap-y-5 my-auto ">
        <h1 className="font-bold text-4xl px-5">Hi,</h1>
        <p className="text-lg text-[#17502d] font-semibold px-5">{text}</p>
        <p className="text-lg text-[#2cc40d] font-semibold fixed bottom-20 text-center">USE KIET PARKING AND NAVIGATION FACILITY PEACEFULLY.</p></div>
    </div>
  );
}