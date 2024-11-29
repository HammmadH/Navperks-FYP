import { IoHomeOutline } from "react-icons/io5"
export default function NavigateKiet({ onHomeClick }) {
    return (
      <div>
        <div onClick={onHomeClick} className="flex py-4 px-3 items-center justify-evenly bg-black cursor-pointer rounded">
          <IoHomeOutline color='#17502d' className='rounded-full p-3 bg-white' size={45} />
          <div className='ml-2 font-extrabold text-xl text-white'>KIET</div>
          return (
        </div>
      </div>
    );
  }