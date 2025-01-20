import React, { useEffect, useRef } from 'react';

const WoosmapMap = () => {
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

export default WoosmapMap;
