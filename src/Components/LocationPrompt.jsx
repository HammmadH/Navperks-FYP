import { useState, useEffect } from 'react';

const LocationPrompt = () => {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLocationChecked, setIsLocationChecked] = useState(false); // To track if location is checked

  // Function to request the location
  const handleLocationRequest = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords); // Store the location coordinates
          setErrorMessage(null); // Clear any previous error messages
          setIsLocationChecked(true); // Mark location as checked
        },
        (error) => {
          setLocation(null); // Clear location data if there's an error
          setErrorMessage(error.message); // Show error message if unable to fetch location
          setIsLocationChecked(true); // Mark location as checked
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsLocationChecked(true); // Mark location as checked when geolocation is not supported
    }
  };

  useEffect(() => {
    // Automatically check location when component mounts
    handleLocationRequest();
  }, []);

  return (
    <>
      {!isLocationChecked ? (
        <div className="bg-white w-full h-full fixed inset-0 z-50 flex justify-center flex-col p-2 items-center">
          <p>Checking your location...</p> {/* Show message while waiting for location */}
        </div>
      ) : !location ? (
        <div className="bg-white w-full h-full fixed inset-0 z-50 flex justify-center flex-col p-2 items-center">
          <button
            onClick={handleLocationRequest}
            className="bg-green-500 rounded-md p-2 text-white font-bold text-lg"
          >
            Get My Location
          </button>
          {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default LocationPrompt;
