import { useRef, useState, useEffect } from "react";
import map from "../assets/map.svg";
import { FaHome, FaDirections } from "react-icons/fa";
import { TbZoomReset } from "react-icons/tb";

export default function Map({ onHomeClick, toggleDirectionPage, departments }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState(null);
  const [lastTouchDistance, setLastTouchDistance] = useState(null);
  const imageRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(null);
  const [path, setPath] = useState([]);
  const [userLocation, setUserLocation] = useState({ x: 0, y: 0, latitude: 0, longitude: 0 });
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Calculate map dimensions once the SVG has loaded
    const calculateMapDimensions = () => {
      if (imageRef.current) {
        const width = imageRef.current.clientWidth;
        const height = imageRef.current.clientHeight;
        setMapDimensions({ width, height });
      }
    };

    window.addEventListener('resize', calculateMapDimensions);
    calculateMapDimensions(); // Initial call to set the dimensions

    return () => {
      window.removeEventListener('resize', calculateMapDimensions);
    };
  }, []);

  useEffect(() => {
    // Use the browser's geolocation API to get the user's position
    if (navigator.geolocation) {
      const intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(updateUserLocation, (error) => {
          console.log('Error getting location:', error);
        }, {
          enableHighAccuracy: true, // Get the most accurate location possible
          timeout: 10000, // Set a timeout for location requests
          maximumAge: 0, // Do not use cached positions
        });
      }, 2000); // Update every 2 seconds

      return () => {
        clearInterval(intervalId); // Clean up the interval when the component is unmounted
      };
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Get user's position using the Geolocation API
  const updateUserLocation = (position) => {
    const { latitude, longitude } = position.coords;
    // Example: Convert the latitude and longitude into map coordinates
    const scaleLat = ((latitude - 24.8656200) / (24.8657360 - 24.8656200)) * 729 * scaleFactor; // Adjust based on map's scale factor
    const scaleLong = ((longitude - 67.0293150) / (67.0293500 - 67.0293150)) * 729 * scaleFactor; // Adjust this to your map's system

    // Set the user's location
    setUserLocation({
      x: Math.round(scaleLong),
      y: Math.round(scaleLat),
      latitude: latitude,
      longitude: longitude,
    });
  };

  useEffect(() => {
    if (imageRef.current) {
      setScaleFactor(imageRef.current.clientWidth / 729);
    }
  }, []); // Dependency array can be empty since `imageRef` doesn't change

  const handleWheel = (event) => {
    event.preventDefault();

    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();

    // Mouse position relative to the container
    const mouseX = event.clientX - container.left;
    const mouseY = event.clientY - container.top;

    // Calculate new scale
    const zoomIntensity = 0.002; // Adjust zoom sensitivity
    const newScale = Math.min(Math.max(scale + event.deltaY * -zoomIntensity, 1), 30);

    // Adjust position to keep the zoom centered around the mouse position
    const scaleFactor = newScale / scale;

    setPosition((prev) => ({
      x: mouseX - scaleFactor * (mouseX - prev.x),
      y: mouseY - scaleFactor * (mouseY - prev.y),
    }));

    setScale(newScale);
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setLastMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const dx = event.clientX - lastMousePosition.x;
    const dy = event.clientY - lastMousePosition.y;

    setPosition((prev) => constrainPosition(prev.x + dx, prev.y + dy));

    setLastMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setLastMousePosition(null);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      setIsDragging(true);
      setLastMousePosition({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      });
    } else if (event.touches.length === 2) {
      const distance = getTouchDistance(event.touches);
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 1 && isDragging) {
      const dx = event.touches[0].clientX - lastMousePosition.x;
      const dy = event.touches[0].clientY - lastMousePosition.y;

      setPosition((prev) => constrainPosition(prev.x + dx, prev.y + dy));

      setLastMousePosition({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      });
    } else if (event.touches.length === 2) {
      const distance = getTouchDistance(event.touches);

      if (lastTouchDistance && containerRef.current) {
        const container = containerRef.current.getBoundingClientRect();

        // Calculate the midpoint between the two touches
        const midX = (event.touches[0].clientX + event.touches[1].clientX) / 2 - container.left;
        const midY = (event.touches[0].clientY + event.touches[1].clientY) / 2 - container.top;

        // Calculate scale change
        const scaleChange = distance / lastTouchDistance;
        const newScale = Math.min(Math.max(scale * scaleChange, 1), 30);

        // Adjust the position based on the midpoint, scale change, and previous position
        const scaleFactor = newScale / scale;

        // Calculate how much the zoom moves the image
        const offsetX = midX - (position.x + container.width / 2);
        const offsetY = midY - (position.y + container.height / 2);

        // Apply the scale change and adjust the position accordingly
        setPosition((prev) => ({
          x: prev.x + offsetX * (1 - scaleFactor),
          y: prev.y + offsetY * (1 - scaleFactor),
        }));

        setScale(newScale);
      }

      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastMousePosition(null);
    setLastTouchDistance(null);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const constrainPosition = (x, y) => {
    if (!containerRef.current) return { x, y };

    const container = containerRef.current.getBoundingClientRect();
    const scaledWidth = container.width * scale;
    const scaledHeight = container.height * scale;

    const maxX = Math.max(0, (scaledWidth - container.width) / 2);
    const maxY = Math.max(0, (scaledHeight - container.height) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  return (
    <div
      className="relative mt-[107px] w-screen bg-gray-100 overflow-hidden"
      ref={containerRef}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute bottom-5 right-5 flex flex-col gap-y-5 z-20">
        <button onClick={onHomeClick} className="rounded-full flex justify-center items-center text-center bg-gray-100 shadow-sm p-2 "><FaHome size={20} /></button>
        <button onClick={toggleDirectionPage} className="rounded-full flex justify-center items-center text-center bg-gray-100 shadow-sm p-2"><FaDirections size={20} /></button>
        <button onClick={resetZoom} className="rounded-full flex justify-center items-center text-center bg-gray-100 shadow-sm p-2"><TbZoomReset size={20} /></button>
      </div>
      <div
        className="relative h-full w-full"
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? "none" : "transform 0.3s ease",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <img
          src={map}
          ref={imageRef}
          alt="Map"
          className="select-none pointer-events-none w-full h-full object-contain"
          draggable={false}
        />

        <div className={`fixed z-10 top-0 left-0 w-full h-full`}>
          <div
          className="absolute h-2 w-2 rounded-full bg-green-500"
          style={{
            left: `${userLocation.x}px`,
            top: `${userLocation.y}px`,
          }}
        />        
          <div>{userLocation.x} <br />{userLocation.y} <br />{userLocation.longitude} <br /> {userLocation.latitude} </div>
        </div>

      </div>
    </div>
  );
}
