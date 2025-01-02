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
  const [userLocation, setUserLocation] = useState({ x: 0, y: 0, latitude: 0, longitude: 0 });
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const smoothingFactor = 0.3; // This controls how much the new data should influence the result
  const movementThreshold = 0.00005; // Minimum change in position before updating (this helps to ignore tiny fluctuations)
  const xMinMovementThreshold = 3;
  const xMaxMovementThreshold = 17; // Minimum change in x (scaled) position before updating (helps control x movement)
  const yMinMovementThreshold = 2;
  const yMaxMovementThreshold = 10;
  const [lastLatitude, setLastLatitude] = useState(null);
  const [lastLongitude, setLastLongitude] = useState(null);
  const [lastX, setLastX] = useState(null); // Track last X coordinate
  const [lastY, setLastY] = useState(null); // Track last Y coordinate

  const calculateMapDimensions = () => {
    if (imageRef.current) {
      const width = imageRef.current.clientWidth;
      const height = imageRef.current.clientHeight;
      setMapDimensions({ width, height });
      setScaleFactor(width / 729); // Adjust scale factor based on your map dimensions
    }
  };

  useEffect(() => {
    window.addEventListener("resize", calculateMapDimensions);

    return () => {
      window.removeEventListener("resize", calculateMapDimensions);
    };
  }, []);
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition (
        (position) => {
          const { latitude, longitude } = position.coords;
          updateUserLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [scaleFactor]);

  const updateUserLocation = (latitude, longitude) => {
    if (!scaleFactor || !mapDimensions.width || !mapDimensions.height) return;

    // Apply smoothing based on previous values
    const smoothedLat = applySmoothing(lastLatitude, latitude);
    const smoothedLong = applySmoothing(lastLongitude, longitude);

    // Map-specific latitude and longitude bounds (for converting to map coordinates)
    const minLat = 24.8656097;
    const maxLat = 24.8658097;
    const minLong = 67.0292175;
    const maxLong = 67.0294125;

    // Convert latitude and longitude to x and y on the map
    let scaledX = ((smoothedLong - minLong) / (maxLong - minLong)) * mapDimensions.width;
    let scaledY = ((smoothedLat - minLat) / (maxLat - minLat)) * mapDimensions.height;

    // Control the x movement to ensure it doesn't change drastically
    if (lastX !== null && Math.abs(scaledX - lastX) > xMinMovementThreshold && Math.abs(scaledX - lastX) < xMaxMovementThreshold ) {
      scaledX = lastX; // Prevent drastic movement in x direction
    }

    if (lastY !== null && Math.abs(scaledY - lastY) > yMinMovementThreshold && Math.abs(scaledY - lastY) > yMaxMovementThreshold) {
      scaledY = lastY; // Prevent drastic movement in x direction
    }

    // Log the smoothed values
    console.log({
      x: scaledX,
      y: scaledY,
      latitude: smoothedLat,
      longitude: smoothedLong,
    });

    setUserLocation({
      x: scaledX.toFixed(0),
      y: scaledY.toFixed(0),
      latitude: smoothedLat,
      longitude: smoothedLong,
    });

    // Update the last known position for future smoothing
    setLastLatitude(smoothedLat);
    setLastLongitude(smoothedLong);
    setLastX(scaledX); // Store the last X value
    setLastY(scaledY); // Store the last Y value
  };

  const applySmoothing = (lastValue, newValue) => {
    if (lastValue === null) {
      return newValue; // No previous value, return the new one
    }

    // If the difference between the last and new value is below the threshold, ignore the update
    if (Math.abs(newValue - lastValue) < movementThreshold) {
      return lastValue; // Return last value to ignore minor fluctuations
    }

    // Apply exponential smoothing
    return smoothingFactor * newValue + (1 - smoothingFactor) * lastValue;
  };

  const handleWheel = (event) => {
    event.preventDefault();

    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - container.left;
    const mouseY = event.clientY - container.top;
    const zoomIntensity = 0.002;
    const newScale = Math.min(Math.max(scale + event.deltaY * -zoomIntensity, 1), 30);
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
        const midX = (event.touches[0].clientX + event.touches[1].clientX) / 2 - container.left;
        const midY = (event.touches[0].clientY + event.touches[1].clientY) / 2 - container.top;
        const scaleChange = distance / lastTouchDistance;
        const newScale = Math.min(Math.max(scale * scaleChange, 1), 30);
        const scaleFactor = newScale / scale;
        const offsetX = midX - (position.x + container.width / 2);
        const offsetY = midY - (position.y + container.height / 2);

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
        <button
          onClick={onHomeClick}
          className="rounded-full flex justify-center items-center text-center bg-gray-100 shadow-sm p-2"
        >
          <FaHome size={20} />
        </button>
        <button
          onClick={toggleDirectionPage}
          className="rounded-full flex justify-center items-center text-center bg-gray-100 shadow-sm p-2"
        >
          <FaDirections size={20} />
        </button>
        <button
          onClick={resetZoom}
          className="rounded-full flex justify-center items-center text-center bg-gray-100 shadow-sm p-2"
        >
          <TbZoomReset size={20} />
        </button>
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
          onLoad={calculateMapDimensions}
        />

        <div className={`fixed z-10 top-0 left-0 w-full h-full`}>
          <div
            className="absolute h-2 w-2 rounded-full bg-green-500"
            style={{
              left: `${userLocation.x}px`,
              top: `${userLocation.y}px`,
            }}
          />
          <div>
            {userLocation.x} <br />
            {userLocation.y} <br />
            {userLocation.longitude} <br /> {userLocation.latitude}
          </div>
        </div>
      </div>
    </div>
  );
}
