// useMyContext.js
import { useContext } from "react";
import ParkingContext from "./ParkingContext";


// Custom hook to use the context
const useParking = () => {
    return useContext(ParkingContext);
};

export default useParking;
