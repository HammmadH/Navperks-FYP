import Logo from "../assets/Logo.jpg";
export default function MainComponent({ onSelect }) {
    return (
      <div className='flex flex-col justify-start overflow-scroll'>
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