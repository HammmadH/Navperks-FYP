import { IoHomeOutline } from "react-icons/io5"
export default function NavigateSlot({ onHomeClick }) {
    return (
      <div>
        
        <div onClick={onHomeClick} className="cursor-pointer">
          <IoHomeOutline color='#2cc40d' /> Navigate Booked Slot Component
        </div>
      </div>
    );
  }