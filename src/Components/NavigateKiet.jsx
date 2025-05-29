import {
  IoHomeOutline,
  IoNavigateSharp,
  IoMapOutline,
  IoNavigateOutline,
  IoHomeSharp,
} from "react-icons/io5";
import IndoorMap from "./IndoorMap";

export default function NavigateKiet({ onHomeClick }) {
  return (<>
    <IoHomeOutline size={40} className="absolute top-14 right-2 rounded-full p-2 bg-white z-[999]" onClick={onHomeClick} /><IndoorMap /></>)
}
