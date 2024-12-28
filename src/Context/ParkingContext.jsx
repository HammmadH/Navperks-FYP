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
  const [remainingTime, setRemainingTime] = useState(0); // Timer state
  const [timerRunning, setTimerRunning] = useState(false); 
  
  useEffect(() => {
    if(bookedSlot == null) localStorage.removeItem("bookedSlot")
    else localStorage.setItem("bookedSlot", bookedSlot);
  }, [bookedSlot]);

  useEffect(() => {
    localStorage.setItem("isParked", isParked);
  }, [isParked]);

  useEffect(() => {
    let timerInterval;
    if (timerRunning && remainingTime > 0) {
      timerInterval = setInterval(() => {
        setRemainingTime((prev) => Math.max(prev - 1, 0));
      }, 1000);
    } else if (remainingTime === 0 && timerRunning) {
      // Timer ends, reset localStorage
      setBookedSlot(null);
      setIsParked(false);
      setTimerRunning(false);
    }

    return () => clearInterval(timerInterval);
  }, [timerRunning, remainingTime, setBookedSlot, setIsParked]);
  const bookSlot = (slotCode) => {
    setIsParked(false);
    setBookedSlot(slotCode);
    setIsParked(false);

    setTimeout(() => {
      setIsParked(true);
    }, 10 * 1000);
  };

  return (
    <ParkingContext.Provider value={{ bookedSlot, setBookedSlot, isParked , bookSlot , setIsParked , remainingTime, setRemainingTime , timerRunning, setTimerRunning  }}>
      {children}
    </ParkingContext.Provider>
  );
};

export default ParkingContext;
