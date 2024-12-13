import { useState, useRef } from "react";
import map from "../assets/map.svg";

export default function Map() {
  const [scale, setScale] = useState(1); // Zoom scale
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Image position
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const prevDistanceRef = useRef(0); // For pinch-to-zoom distance tracking

  // Handle zooming with mouse wheel (desktop)
  const handleZoom = (e) => {
    e.preventDefault(); // Prevent default scrolling behavior

    const delta = e.deltaY > 0 ? -0.2 : 0.2; // Negative delta zooms out
    const newScale = Math.min(Math.max(scale + delta, 0.5), 15); // Clamp zoom scale between 0.5 and 15
    setScale(newScale);

    // Calculate new position based on mouse position for zoom
    const rect = mapRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const scaleDiff = newScale / scale;
    const newX = position.x - (offsetX * scaleDiff - offsetX);
    const newY = position.y - (offsetY * scaleDiff - offsetY);

    setPosition({ x: newX, y: newY });
  };

  // Handle drag start (mouse or touch)
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle drag end
  const handleMouseUp = () => setDragging(false);

  // Handle dragging (mouse or touch)
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const map = mapRef.current;

    // Get the bounds of the map image
    const mapWidth = map.width * scale;
    const mapHeight = map.height * scale;

    let newX = e.clientX - startPos.x;
    let newY = e.clientY - startPos.y;

    // Constrain dragging within the bounds of the image and container
    newX = Math.min(Math.max(newX, containerRef.current.offsetWidth - mapWidth), 0);
    newY = Math.min(Math.max(newY, containerRef.current.offsetHeight - mapHeight), 0);

    setPosition({ x: newX, y: newY });
  };

  // Handle pinch-to-zoom (mobile)
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault(); // Prevent default pinch zoom behavior

      const [touch1, touch2] = e.touches;
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      if (prevDistanceRef.current) {
        const scaleChange = (currentDistance - prevDistanceRef.current) / 200;
        setScale((prev) => Math.min(Math.max(prev + scaleChange, 0.5), 15)); // Clamp scale between 0.5 and 15
      }

      prevDistanceRef.current = currentDistance; // Save the current distance for next move
    }
  };

  // Reset distance on touch end (pinch-to-zoom)
  const handleTouchEnd = () => {
    prevDistanceRef.current = 0; // Reset the pinch distance
  };

  return (
    <div className="relative h-[80vh] mt-20 w-screen bg-gray-100" ref={containerRef}>
      {/* Zoom Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-3 z-50">
        <button
          onClick={() => setScale((prev) => Math.min(prev + 0.2, 15))}
          className="bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700"
        >
          +
        </button>
        <button
          onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.5))}
          className="bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700"
        >
          -
        </button>
      </div>

      {/* Map Container */}
      <div
        className="relative h-full w-full overflow-hidden border"
        style={{ touchAction: "none" }} // Disable scrolling and pinch zoom default behavior
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleZoom}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Map Image */}
        <img
          src={map}
          alt="Map"
          ref={mapRef}
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center", // Adjusted zoom origin for both desktop and mobile
            transition: dragging ? "none" : "transform 0.3s ease-in-out",
            cursor: dragging ? "grabbing" : "grab",
          }}
          className="select-none w-full h-full object-contain" // Prevents selecting the image
        />
      </div>
    </div>
  );
}
