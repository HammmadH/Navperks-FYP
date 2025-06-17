import React, { useEffect } from 'react';
import { Zoom } from 'react-toastify';

const IndoorMap = () => {
  useEffect(() => {
    const initMap = () => {
      // Check if Woosmap is loaded
      if (window.woosmap) {
        const isMobile = window.innerWidth <= 768; // Detect if the user is on mobile

        const myMap = new window.woosmap.map.Map(document.getElementById('map'), {
          gestureHandling: isMobile ? "cooperative" : "greedy",
          Zoom: 20,
          center: {lat:24.92786605915773,lng:67.04737722873689} // Adjust gesture handling for mobile
        });

        const indoorRendererConfiguration = {
          defaultFloor: 0,
          venue: "kiet",
          forceExtrusion: true,
          responsive: isMobile ? 'mobile' : 'desktop', // Make responsive based on device type
        };

        const indoorWidgetConfiguration = {
          autocompleteWithDistance: true,
        };

        window.map = myMap;

        const indoorWidget = new window.woosmap.map.IndoorWidget(
          indoorWidgetConfiguration,
          indoorRendererConfiguration
        );
        indoorWidget.setMap(myMap);

        indoorWidget.addListener("indoor_venue_loaded", () => {
          window.map.setTilt(isMobile ? 10 : 15); // Adjust tilt for mobile devices
        });
      } else {
        console.error('Woosmap SDK is not loaded.');
      }
    };

    const script = document.createElement("script");
    script.src =
      "https://sdk.woosmap.com/map/map.js?libraries=widgets&key=woos-503717c5-4818-33ac-95c4-27b30944fe13&callback=initMap";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.initMap = initMap;

    return () => {
      // Cleanup the script when component is unmounted
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="map"
      className="w-full h-screen sm:h-[calc(100vh-100px)] min-h-[600px]"
      style={{ height: '100%', width: 'auto' }}
    ></div>
  );
};

export default IndoorMap;








// import { useEffect, useRef, useState } from "react";

// const WoosmapMap = () => {
//   const [dimensions, setDimensions] = useState({ width: 300, height: 600 });
//   const divRef = useRef(null);

//   useEffect(() => {
//     if (divRef.current) {
//       const resizeObserver = new ResizeObserver(() => {
//         const { offsetWidth, offsetHeight } = divRef.current;
//         setDimensions({ width: offsetWidth, height: offsetHeight });
//       });
//       resizeObserver.observe(divRef.current);

//       return () => resizeObserver.disconnect(); // Cleanup
//     }
//   }, []);

//   useEffect(() => {
//     const initMap = () => {
//       const myMap = new window.woosmap.map.Map(document.getElementById("map"), {
//         gestureHandling: "greedy",
//       });

//       const indoorRendererConfiguration = {
//         defaultFloor: 0,
//         venue: "wgs",
//         forceExtrusion: true,
//       };

//       const indoorWidgetConfiguration = {
//         autocompleteWithDistance: true,
//       };

//       const indoorWidget = new window.woosmap.map.IndoorWidget(
//         indoorWidgetConfiguration,
//         indoorRendererConfiguration
//       );

//       indoorWidget.setMap(myMap);

//       indoorWidget.addListener("indoor_venue_loaded", () => {
//         indoorWidget.setUserLocation(
//           43.6065728,
//           3.92195288,
//           3, // User level
//           0, // Bearing in degrees
//           false // Force the focus (boolean)
//         );
//         myMap.setTilt(15);
//       });

//       window.map = myMap;
//     };

//     // Load Woosmap script dynamically
//     const script = document.createElement("script");
//     script.src =
//       "https://sdk.woosmap.com/map/map.js?libraries=widgets&key=woos-9c95113e-d4a4-3d68-ae13-01afebdc35e9&callback=initMap";
//     script.defer = true;
//     script.onload = initMap;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script); // Cleanup script
//     };
//   }, []);

//   return (
//     <div
//       ref={divRef}
//       className="relative w-full h-screen bg-gray-100"
//       style={{
//         overflow: "hidden",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <div
//         id="map"
//         style={{
//           height: `${dimensions.height}px`,
//           width: `${dimensions.width}px`,
//           borderRadius: "12px",
//           overflow: "hidden",
//         }}
//         className="border shadow-md"
//       ></div>
//     </div>
//   );
// };

// export default WoosmapMap;