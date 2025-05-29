import { useEffect, useState } from "react";
import Logo from "../assets/Logo.jpg";
import { getDeviceSpeed } from "../getSpeed";
export default function MainComponent({ onSelect, announcements }) {
  const [c1, setC1] =useState(0)
  const getSpeeed = async ()=>{
    const speed = await getDeviceSpeed(3)
    setC1(speed)
    return speed
  }
  useEffect(()=>{
    getSpeeed();
  },[])
  return (
    <div className='flex flex-col justify-start overflow-auto'>
      <div className='flex flex-col -mt-5 justify-start items-center bg-none border-b-black '>
        <img className='w-3/5' src={Logo} alt='Logo' />
        <span className='font-bold text-3xl -mt-2'>User Dashboard</span>
      </div>
      <div className="py-5 mt-10 h-full flex flex-col gap-y-5 my-auto ">
        <h1 className="font-bold text-4xl px-5">Hi,</h1>
        {/* <div className="absolute top-10 right-10 px-3 py-1 bg-slate-300 dark:bg-slate-900 dark:text-white rounded-full">{c1} km/h</div> */}
     
          {announcements?.map((a) => {

            return (
              <p className="text-lg text-[#17502d] font-semibold px-5" key={a.id}>
                {a.announcementText}
              </p>
            )
          })}
    </div>
        <p className="text-lg text-[#2cc40d] z-10 relative  font-semibold bg-white text-center px-2">USE KIET PARKING AND NAVIGATION FACILITY PEACEFULLY.</p></div>
  );
}