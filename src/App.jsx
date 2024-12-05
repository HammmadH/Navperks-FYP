import React, { useState, useEffect } from 'react';
import { IoHomeOutline, IoClipboardOutline, IoPlayOutline, IoMapOutline } from 'react-icons/io5';
import FirstComponent from "./Components/FirstComponent";
import SecondComponent from "./Components/SecondComponent";
import MainComponent from "./Components/MainComponent";
import BookSlot from "./Components/BookSlot";
import NavigateKiet from "./Components/NavigateKiet";
import NavigateSlot from "./Components/NavigateSlot";
import BottomBar from "./Components/BottomBar";

function App() {
  const [step, setStep] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState('home'); // Default component is home
  const [showBottomBar, setShowBottomBar] = useState(true);  // To handle bottom bar visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position

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
        console.log("main");
        return <MainComponent onSelect={handleSelectComponent} />;
      case 'bookSlot':
        console.log("book")
        return <BookSlot onHomeClick={handleHomeClick} />;
      case 'yourSlot':
        console.log("slot")
        return <NavigateSlot onHomeClick={handleHomeClick} />;
      case 'kiet':
        console.log("kiet")
        return <NavigateKiet onHomeClick={handleHomeClick} />;
      default:
        return <MainComponent onSelect={handleSelectComponent} />;
    }
  };

  return (
    <div className='h-full overflow-none'>
      {step === 1 && <FirstComponent />}
      {step === 2 && <SecondComponent onContinue={handleContinue} />}
      {step === 3 && renderComponent()}

      {/* Show BottomBar on all components, but with scroll behavior only on MainComponent */}
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
