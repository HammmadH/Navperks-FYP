// MyContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const ParkingContext = createContext();

// Context provider component
export const ParkingContextProvider = ({ children }) => {
  const [bookedSlot, setBookedSlot] = useState(localStorage.getItem("bookedSlot"));
  const [isParked, setIsParked] = useState(() => {
    const isParkedValue = localStorage.getItem("isParked");
    const bookedSlotValue = localStorage.getItem("bookedSlot");
  
    // Check if both values exist and are valid, otherwise set default to false
    return isParkedValue && bookedSlotValue ? JSON.parse(isParkedValue) : false;
  });
  
  
  useEffect(() => {
    if(bookedSlot == null) localStorage.removeItem("bookedSlot")
    else localStorage.setItem("bookedSlot", bookedSlot);
  }, [bookedSlot]);

  useEffect(() => {
    localStorage.setItem("isParked", isParked);
  }, [isParked]);


  const bookSlot = (slotCode) => {
    setIsParked(false);
    setBookedSlot(slotCode);
    setIsParked(false);

    setTimeout(() => {
      setIsParked(true);
    }, 10 * 1000);
  };

  return (
    <ParkingContext.Provider value={{ bookedSlot, setBookedSlot, isParked , bookSlot , setIsParked }}>
      {children}
    </ParkingContext.Provider>
  );
};

export default ParkingContext;
