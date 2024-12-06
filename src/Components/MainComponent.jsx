import Logo from "../assets/Logo.jpg";
export default function MainComponent({ onSelect }) {
  return (
    <div className='flex flex-col justify-start overflow-scroll'>
      <div className='flex flex-col -mt-5 justify-start items-center bg-none border-b-black '>
        <img className='w-3/5' src={Logo} alt='Logo' />
        <span className='font-bold text-3xl -mt-2'>User Dashboard</span>
      </div>
      <div className="p-5 mt-20 h-full my-auto">
        <h1 className="font-bold text-3xl">Hi</h1>
        <p className="text-lg">There is no any event or notice for now in KIET.</p>
        <p className="text-lg">Use KIET Parking and Navigation facility peacefully.</p>       </div>
    </div>
  );
}