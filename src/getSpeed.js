// getSpeed.js

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
// getSpeed.js

export const getDeviceSpeed = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const speedInMps = position.coords.speed;

        // Stop watching after we get the first position
        navigator.geolocation.clearWatch(watchId);

        if (speedInMps === null) {
          reject("Speed not available from GPS.");
        } else {
          const speedInKmph = (speedInMps * 3.6).toFixed(2);
          resolve(speedInKmph);
        }
      },
      (error) => {
        navigator.geolocation.clearWatch(watchId);
        switch (error.code) {
          case 1:
            reject("User denied the request for Geolocation.");
            break;
          case 2:
            reject("Location information is unavailable.");
            break;
          case 3:
            reject("The request to get user location timed out.");
            break;
          default:
            reject("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  });
};

  


export const sendSpeed = async (speed, reservationId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/Speed/${reservationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carSpeed: speed }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send speed. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Speed sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending speed:", error);
    return null;
  }
};


export const getAverageSpeed = (durationInSeconds = 10) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported.");
      return;
    }

    const speedReadings = [];
    const startTime = Date.now();

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const speedMps = position.coords.speed;
        const now = Date.now();

        // Stop the watch after duration is reached
        if (now - startTime >= durationInSeconds * 1000) {
          navigator.geolocation.clearWatch(watchId);

          if (speedReadings.length === 0) {
            reject("No valid speed readings available.");
            return;
          }

          const sum = speedReadings.reduce((acc, val) => acc + val, 0);
          const average = (sum / speedReadings.length).toFixed(2);
          resolve(average);
          return;
        }

        // Only store valid speed values
        if (speedMps !== null && !isNaN(speedMps)) {
          const speedKmph = speedMps * 3.6;
          speedReadings.push(speedKmph);
          console.log(`Speed Reading: ${speedKmph.toFixed(2)} km/h`);
        } else {
          console.warn("Invalid speed reading (null or NaN).");
        }
      },
      (err) => {
        navigator.geolocation.clearWatch(watchId);
        reject("Error getting location: " + err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  });
};
