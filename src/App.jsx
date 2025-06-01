import React, { useState, useEffect } from "react";
import {
  IoHomeOutline,
  IoClipboardOutline,
  IoPlayOutline,
  IoMapOutline,
} from "react-icons/io5";
import FirstComponent from "./Components/FirstComponent";
import SecondComponent from "./Components/SecondComponent";
import MainComponent from "./Components/MainComponent";
import BookSlot from "./Components/BookSlot";
import NavigateKiet from "./Components/NavigateKiet";
import NavigateSlot from "./Components/NavigateSlot";
import BottomBar from "./Components/BottomBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAverageSpeed, getDeviceSpeed, sendSpeed } from "./getSpeed";
import GPSAccessPrompt from "./Components/GPSAccessPrompt";
import { simpleDecrypt } from "./datasafety";
import { simpleEncrypt } from "./datasafety";

const initialResponse = [
  {
    id: 1,
    announcementText: "There isn't any event or announcement for now in KIET.",
  },
];

const initialSlots = [
  {
    floor: "COCIS",
    slots: [
      { id: 1, code: "CS-S1", reserved: true },
      { id: 2, code: "CS-S2", reserved: false },
      { id: 3, code: "CS-S3", reserved: false },
      { id: 4, code: "CS-S4", reserved: false },
      { id: 5, code: "CS-S5", reserved: false },
      { id: 6, code: "CS-S6", reserved: false },
    ],
  },
  {
    floor: "COMS",
    slots: [
      { id: 7, code: "CM-S1", reserved: false },
      { id: 8, code: "CM-S2", reserved: false },
      { id: 9, code: "CM-S3", reserved: false },
      { id: 10, code: "CM-S4", reserved: false },
      { id: 11, code: "CM-S5", reserved: false },
      { id: 12, code: "CM-S6", reserved: false },
    ],
  },
];

function App() {
  const [step, setStep] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState("home");
  const [slots, setMySlots] = useState(initialSlots);
  const [announcements, setAnnouncements] = useState(initialResponse);
  const [speed, setSpeed] = useState(0);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [releasing, setReleasing] = useState(false)

  const [bookedSlot, setBookedSlot] = useState(
    simpleDecrypt(localStorage.getItem(simpleEncrypt("bookedSlot"))) || null
  );

  const [isParked, setIsParked] = useState(() => {
    const isParkedValue = simpleDecrypt(
      localStorage.getItem(simpleEncrypt("isParked"))
    );
    const bookedSlotValue = simpleDecrypt(
      localStorage.getItem(simpleEncrypt("bookedSlot"))
    );

    // Check if both values exist and are valid, otherwise set default to false
    return bookedSlotValue ? true : false;
  });

  const [carType, setCarType] = useState(() => {
    const isParkedValue = simpleDecrypt(
      localStorage.getItem(simpleEncrypt("isParked"))
    );
    const bookedSlotValue = simpleDecrypt(
      localStorage.getItem(simpleDecrypt("bookedSlot"))
    );

    const cartypeValue = simpleDecrypt(
      localStorage.getItem(simpleEncrypt("carType"))
    );

    return isParkedValue &&
      bookedSlotValue &&
      cartypeValue &&
      cartypeValue.length > 0
      ? cartypeValue
      : "";
  });
  const [remainingTime, setRemainingTime] = useState(0); // Timer state
  const [timerRunning, setTimerRunning] = useState(false);

  const [locationAllowed, setLocationAllowed] = useState(true);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setLocationAllowed(true);
        },
        (error) => {
          console.warn("Location error:", error);
          setLocationAllowed(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      setWatchId(id);
    } else {
      setLocationAllowed(false);
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const getUserConsent = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/User`, {
        method: "POST",
        headers: {
          "CONTENT-TYPE": "application/json",
        },
        body: JSON.stringify({
          consent: true,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(
          simpleEncrypt("userAgreement"),
          simpleEncrypt(data.userId)
        );
        toast.success("Thanks for coming.", {
          position: "top-right",
        });
      } else {
        toast.error("Server Error. please wait", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("Server Error. please wait", {
        position: "top-right",
      });
    }

    //  localStorage.setItem("userAgreement", "85 ");
  };

  const fetchannouncements = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Announcements`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result.length > 0) {
          setAnnouncements(result); // Ensure this function is defined in your component
        } else {
          setAnnouncements(initialResponse);
        }
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const getAllSlots = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/Reservation/real-time`
    );

    if (response.ok) {
      const slots = await response.json();
      const groupedSlots = slots.reduce((acc, slot) => {
        const floor = slot.slotCode.split("-")[0]; // Extract floor name from slotCode
        const floorIndex = acc.findIndex((item) => item.floor === floor);

        const slotData = {
          id: slot.slotId,
          code: slot.slotCode,
          reserved: !slot.isFree,
        };

        if (floorIndex >= 0) {
          // Add slot to existing floor
          acc[floorIndex].slots.push(slotData);
        } else {
          // Create a new floor group
          acc.push({
            floor: floor,
            slots: [slotData],
          });
        }

        return acc;
      }, []);
      setMySlots(groupedSlots);
      if (bookedSlot) {

        const myslotArray = groupedSlots.filter((s) => {
          return (
            s.floor.toLowerCase() === bookedSlot.split("-")[0].toLowerCase()
          );

          return false;
        });

        const mySlot = myslotArray[0]?.slots.find((s) => {
          return s.code.toLowerCase() === bookedSlot.toLowerCase()
        });

        if(mySlot && mySlot.reserved == false){
          setIsParked(false)
          setBookedSlot(null)
      
        }
      }

    } else {
      setMySlots(initialSlots);
    }
  };

  useEffect(() => {
    fetchannouncements();
    getAllSlots();
  }, []);

  useEffect(() => {
    if (bookedSlot == null) localStorage.removeItem("bookedSlot");
    else
      localStorage.setItem(
        simpleEncrypt("bookedSlot"),
        simpleEncrypt(bookedSlot)
      );
  }, [bookedSlot]);

  useEffect(() => {
    localStorage.setItem(simpleEncrypt("isParked"), simpleEncrypt(isParked));
  }, [isParked]);

  useEffect(() => {
    localStorage.setItem(simpleEncrypt("carType"), simpleEncrypt(carType));
  }, [carType]);

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

  useEffect(() => {
    const userAgreed = simpleDecrypt(
      localStorage.getItem(simpleEncrypt("userAgreement"))
    ); // Check if user has agreed

    if (userAgreed) {
      setStep(3); // Directly show MainComponent if user agreed
    } else {
      // Wait 3 seconds before showing user agreement
      const timer = setTimeout(() => {
        setStep(2); // Show user agreement step
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Hide bottom bar on scroll when on MainComponent
    const handleScroll = () => {
      if (selectedComponent === "home") {
        // Only apply scroll behavior when on MainComponent
        if (window.scrollY > lastScrollY) {
          setShowBottomBar(false); // Scrolling down, hide bottom bar
        } else {
          setShowBottomBar(true); // Scrolling up, show bottom bar
        }
        setLastScrollY(window.scrollY); // Update scroll position
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, selectedComponent]);

  const bookSlot = async (slotCode, carType) => {
    setIsParked(false);
    try {
      const uID = JSON.parse(
        simpleDecrypt(localStorage.getItem(simpleEncrypt("userAgreement")))
      );
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Reservation`,
        {
          method: "POST",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify({
            userId: uID,
            slotCode,
            carType,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(
          simpleEncrypt("reservationId"),
          simpleEncrypt(data.reservationId)
        );
        localStorage.setItem(simpleEncrypt("carType"), simpleEncrypt(carType));
        toast.success(`${data.message}`, {
          position: "top-right",
        });
        setBookedSlot(slotCode);
        getAllSlots();
        setIsParked(false);
        setTimeout(() => {
          setIsParked(true);
        }, 10 * 1000);
        const speed1 = await getAverageSpeed(3);
        setSpeed(speed1);
        const sResponse = await sendSpeed(speed1, data.reservationId);
        clg(sResponse);
      } else if (response.status === 409) {
        toast.error("You have already booked a slot", {
          position: "top-right",
        });
      }
    } catch(error) {
      alert(error)
      toast.error("Server Error. please wait", {
        position: "top-right",
      });
    }
  };

  const startTimer = () => {
    setRemainingTime(20);
    setTimerRunning(true);
  };

  const releaseSlot = async (slotCode) => {

    try {
      const reservationid = JSON.parse(
        simpleDecrypt(localStorage.getItem(simpleEncrypt("reservationId")))
      );
      const cartypee = simpleDecrypt(
        localStorage.getItem(simpleEncrypt("carType"))
      );

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Reservation/${reservationid}`,
        {
          method: "PUT",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify({
            userId: 0,
            userAId: 0,
            slotCode: slotCode,
          }),
        }
      );
      if (response.ok) {
        setReleasing(true)
        setTimeout(()=>{
          setReleasing(false)
        },20 * 1000)
        startTimer();
        toast.success("Slot Released", {
          position: "top-right",
        });
        getAllSlots();
      } else {
        toast.error("Server error", { position: "top-right" });
      }
    } catch (error) {
      toast.error(`Server error`, {
        position: "top-right",
      });
    }
  };

  const handleContinue = () => {
    setStep(3); // Move to MainComponent
  };

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  const handleHomeClick = () => {
    setSelectedComponent("home"); // Return to MainComponent
  };

  // Dynamic rendering of components based on selected component
  const renderComponent = () => {
    switch (selectedComponent) {
      case "home":
        return (
          <>
            <GPSAccessPrompt show={locationAllowed} />
            <MainComponent
              announcements={announcements}
              onSelect={handleSelectComponent}
            />
            <GPSAccessPrompt show={locationAllowed} />
          </>
        );
      case "bookSlot":
        return (
          <>
            <GPSAccessPrompt show={locationAllowed} />
            <BookSlot
            releasing={releasing}
              onSelect={handleSelectComponent}
              slots={slots}
              bookedSlot={bookedSlot}
              bookSlot={bookSlot}
            />
          </>
        );
      case "yourSlot":
        return (
          <>
            <GPSAccessPrompt show={locationAllowed} />
            <NavigateSlot
              speed={speed}
              releasing={releasing}
              onSelect={handleSelectComponent}
              releaseSlot={releaseSlot}
              bookedSlot={bookedSlot}
              isParked={isParked}
              remainingTime={remainingTime}
              setRemainingTime={setRemainingTime}
              timerRunning={timerRunning}
              setTimerRunning={setTimerRunning}
            />
          </>
        );
      case "kiet":
        return (
          <>
            <GPSAccessPrompt show={locationAllowed} />
            <NavigateKiet
              onHomeClick={handleHomeClick}
              onSelect={handleSelectComponent}
            />
          </>
        );
      default:
        return (
          <>
            <GPSAccessPrompt show={locationAllowed} />
            <MainComponent
              announcements={announcements}
              onSelect={handleSelectComponent}
            />
          </>
        );
    }
  };

  return (
    <div className="h-full overflow-none bg-white [::webkit-scrollbar]:0">
      <ToastContainer />
      {step === 1 && <FirstComponent />}
      {step === 2 && (
        <SecondComponent
          onContinue={handleContinue}
          getUserConsent={getUserConsent}
        />
      )}
      {step === 3 && renderComponent()}
      {step === 3 && showBottomBar && (
        <BottomBar
          selectedComponent={selectedComponent}
          onSelect={handleSelectComponent}
          activeTab={selectedComponent}
        />
      )}
    </div>
  );
}

export default App;
