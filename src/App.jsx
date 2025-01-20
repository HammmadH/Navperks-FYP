import React, { useState, useEffect } from 'react';
import { IoHomeOutline, IoClipboardOutline, IoPlayOutline, IoMapOutline } from 'react-icons/io5';
import FirstComponent from "./Components/FirstComponent";
import SecondComponent from "./Components/SecondComponent";
import MainComponent from "./Components/MainComponent";
import BookSlot from "./Components/BookSlot";
import NavigateKiet from "./Components/NavigateKiet";
import NavigateSlot from "./Components/NavigateSlot";
import BottomBar from "./Components/BottomBar";


const initialResponse = [
  {
    id: 1,
    announcementText: "There isn't any event or announcement for now in KIET.",
  },
  {
    id: 2,
    announcementText: "There isn't any event or announcement for now in KIET.",
  },
  {
    id: 3,
    announcementText: "There isn't any event or announcement for now in KIET.",
  },
  {
    id: 4,
    announcementText: "There isn't any event or announcement for now in KIET.",
  }, {
    id: 5,
    announcementText: "There isn't any event or announcement for now in KIET.",
  }, {
    id: 6,
    announcementText: "There isn't any event or announcement for now in KIET.",
  },
]


function App() {
  const [step, setStep] = useState(1);

  const [selectedComponent, setSelectedComponent] = useState('home'); 
    const [announcements, setAnnouncements] = useState(initialResponse);

  const [showBottomBar, setShowBottomBar] = useState(true); 
  const [lastScrollY, setLastScrollY] = useState(0); 

  const [bookedSlot, setBookedSlot] = useState(localStorage.getItem("bookedSlot"));
  const [isParked, setIsParked] = useState(() => {
    const isParkedValue = localStorage.getItem("isParked");
    const bookedSlotValue = localStorage.getItem("bookedSlot");

    // Check if both values exist and are valid, otherwise set default to false
    return isParkedValue && bookedSlotValue ? JSON.parse(isParkedValue) : false;
  });
  const [remainingTime, setRemainingTime] = useState(0); // Timer state
  const [timerRunning, setTimerRunning] = useState(false);


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
        }else {
          setAnnouncements(initialResponse);
        }
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchannouncements()
  }, []);

  useEffect(() => {
    if (bookedSlot == null) localStorage.removeItem("bookedSlot")
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

  useEffect(() => {
    const userAgreed = localStorage.getItem('userAgreement') === 'true'; // Check if user has agreed

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
      if (selectedComponent === 'home') {  // Only apply scroll behavior when on MainComponent
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

  const bookSlot = (slotCode) => {
    setIsParked(false);
    setBookedSlot(slotCode);
    setIsParked(false);

    setTimeout(() => {
      setIsParked(true);
    }, 10 * 1000);
  };

  const handleContinue = () => {
    setStep(3); // Move to MainComponent
  };

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  const handleHomeClick = () => {
    setSelectedComponent('home'); // Return to MainComponent
  };

  // Dynamic rendering of components based on selected component
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'home':
        return <MainComponent  announcements={announcements} onSelect={handleSelectComponent} />;
      case 'bookSlot':
        return <BookSlot onSelect={handleSelectComponent} />;
      case 'yourSlot':
        return <NavigateSlot onSelect={handleSelectComponent} />;
      case 'kiet':
        return <NavigateKiet onHomeClick={handleHomeClick} />;
      default:
        return <MainComponent  announcements={announcements} onSelect={handleSelectComponent} />;
    }
  };

  return (
    <div className='h-full overflow-none bg-white [::webkit-scrollbar]:0'>
      {step === 1 && <FirstComponent />}
      {step === 2 && <SecondComponent onContinue={handleContinue} />}
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
