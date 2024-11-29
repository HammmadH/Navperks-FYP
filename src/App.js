import { IoArrowDownOutline } from "react-icons/io5"; // Import down arrow icon
import React, { useState, useEffect } from 'react';
import FirstComponent from "./Components/Firstcomponent";
import SecondComponent from "./Components/SecondComponent"
import MainComponent from "./Components/MainComponent";
import BookSlot from "./Components/BookSlot"
import NavigateKiet from "./Components/NavigateKiet";
import NavigateSlot from "./Components/NavigateSlot";

function App() {
  const [step, setStep] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    const userAgreed = localStorage.getItem('userAgreement') === 'true';
    const timer = setTimeout(() => {
      if (userAgreed) {
        setStep(3); 
      } else {
        setStep(2); 
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setStep(3); // Move to MainComponent
  };

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  const handleHomeClick = () => {
    setSelectedComponent(null); // Return to MainComponent
  };

  return (
    <div>
      {step === 1 && <FirstComponent />}
      {step === 2 && <SecondComponent onContinue={handleContinue} />}
      {step === 3 && !selectedComponent && <MainComponent onSelect={handleSelectComponent} />}
      {selectedComponent === 'bookSlot' && <BookSlot onHomeClick={handleHomeClick} />}
      {selectedComponent === 'navigateSlot' && <NavigateSlot onHomeClick={handleHomeClick} />}
      {selectedComponent === 'navigateKiet' && <NavigateKiet onHomeClick={handleHomeClick} />}
    </div>
  );
}



export default App;
