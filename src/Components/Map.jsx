import { useRef, useState, useEffect } from "react";
import map from "../assets/map.svg";

export default function Map() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState(null);
  const [lastTouchDistance, setLastTouchDistance] = useState(null);

  // Prevent default browser zoom and scroll behavior
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    document.addEventListener("wheel", preventDefault, { passive: false });
    document.addEventListener("gesturestart", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("wheel", preventDefault);
      document.removeEventListener("gesturestart", preventDefault);
    };
  }, []);

  const handleWheel = (event) => {
    event.preventDefault();

    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();

    // Mouse position relative to the container
    const mouseX = event.clientX - container.left;
    const mouseY = event.clientY - container.top;

    // Calculate new scale
    const zoomIntensity = 0.002; // Adjust zoom sensitivity
    const newScale = Math.min(Math.max(scale + event.deltaY * -zoomIntensity, 1), 25);

    // Adjust position to keep the zoom centered around the mouse position
    const scaleFactor = newScale / scale;

    setPosition((prev) => ({
      x: (prev.x - mouseX) * scaleFactor + mouseX,
      y: (prev.y - mouseY) * scaleFactor + mouseY,
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

        // Midpoint between two touches
        const midX =
          (event.touches[0].clientX + event.touches[1].clientX) / 2 - container.left;
        const midY =
          (event.touches[0].clientY + event.touches[1].clientY) / 2 - container.top;

        // Calculate scale change
        const scaleChange = distance / lastTouchDistance;
        const newScale = Math.min(Math.max(scale * scaleChange, 1), 25);

        // Adjust position to center zoom around midpoint
        const scaleFactor = newScale / scale;

        setPosition((prev) => ({
          x: (prev.x - midX) * scaleFactor + midX,
          y: (prev.y - midY) * scaleFactor + midY,
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
      className="relative h-[80vh] mt-20 w-screen bg-gray-100 overflow-hidden"
      ref={containerRef}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute z-10 flex gap-2 top-4 left-4">
        <button
          onClick={() => setScale((prev) => Math.min(prev + 0.5, 25))}
          className="p-2 bg-white border rounded shadow"
        >
          +
        </button>
        <button
          onClick={() => setScale((prev) => Math.max(prev - 0.5, 1))}
          className="p-2 bg-white border rounded shadow"
        >
          -
        </button>
        <button
          onClick={resetZoom}
          className="p-2 bg-white border rounded shadow"
        >
          Reset
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
          alt="Map"
          className="select-none pointer-events-none w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}
