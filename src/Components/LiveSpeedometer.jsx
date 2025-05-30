// LiveSpeedometer.js
import { useEffect, useState } from "react";

const LiveSpeedometer = () => {
  const [speed, setSpeed] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const speedMps = position.coords.speed;
        const speedKmph = speedMps !== null ? (speedMps * 3.6).toFixed(2) : null;
        setSpeed(speedKmph);
      },
      (err) => {
        setError("Error getting location: " + err.message);
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
  }, []);

  return (
    <div>
      <h3>Live Speedometer</h3>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>{speed !== null ? `${speed} km/h` : "Fetching speed..."}</p>
      )}
    </div>
  );
};

export default LiveSpeedometer;
