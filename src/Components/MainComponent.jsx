import { useState } from "react";
import Logo from "../assets/Logo.jpg";
export default function MainComponent({ onSelect, announcements }) {
  const [text, setText] = useState("There is no any event or notice for now in KIET.");
  return (
    <div className='flex flex-col justify-start overflow-auto'>
      <div className='flex flex-col -mt-5 justify-start items-center bg-none border-b-black '>
        <img className='w-3/5' src={Logo} alt='Logo' />
        <span className='font-bold text-3xl -mt-2'>User Dashboard</span>
      </div>
      <div className="py-5 mt-10 h-full flex flex-col gap-y-5 my-auto ">
        <h1 className="font-bold text-4xl px-5">Hi,</h1>
        <div>

          {announcements.map((a) => (
            <div className="relative flex items-center justify-between  py-1" key={a.id}>
              <p className="text-lg text-[#17502d] font-semibold px-5">
                {a.announcementText}
              </p>
            </div>
          ))}
        </div>
    </div>
        <p className="text-lg text-[#2cc40d] z-10 relative  font-semibold bg-white bottom-20 text-center px-2">USE KIET PARKING AND NAVIGATION FACILITY PEACEFULLY.</p></div>
  );
}