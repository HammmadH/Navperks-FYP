import React, { useEffect, useRef } from 'react';

const indoorMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      // Check if Woosmap is loaded
      if (window.woosmap) {
        const myMap = new window.woosmap.map.Map(mapRef.current, {
          "gestureHandling": "greedy"
        });

        const indoorRendererConfiguration = {
          "defaultFloor": 3,
          "venue": "wgs",
          "forceExtrusion": true
        };

        const indoorWidgetConfiguration = {
          "autocompleteWithDistance": true
        };

        const indoorWidget = new window.woosmap.map.IndoorWidget(
          indoorWidgetConfiguration,
          indoorRendererConfiguration
        );
        indoorWidget.setMap(myMap);

        indoorWidget.addListener("indoor_venue_loaded", () => {
          indoorWidget.setUserLocation(
            43.6065728,
            3.92195288,
            3, // user level
            0, // bearing (in degrees)
            false // force the focus (boolean)
          );
          myMap.setTilt(15); // Use `myMap` to set tilt instead of window.map
        });
      } else {
        console.error('Woosmap SDK is not loaded.');
      }
    };

    const script = document.createElement("script");
    script.src =
      "https://sdk.woosmap.com/map/map.js?libraries=widgets&key=woos-9c95113e-d4a4-3d68-ae13-01afebdc35e9&callback=initMap";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup the script when component is unmounted
      document.body.removeChild(script);
    };
  }, []);

  return <div style={{ height: '600px', width: '100%' }} ref={mapRef} id="map"></div>;
};

export default indoorMap;








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