import React, { useEffect } from 'react';

const MapComponent = ({ lat, lng }) => {
  useEffect(() => {
    // Initialize the map
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat, lng },
      zoom: 15, // Adjust the zoom level as needed
    });

    // Create a marker for the location
    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: 'Location', // Optional, provides a tooltip for the marker
    });
  }, [lat, lng]);

  return <div id="map" style={{ height: '400px' }}></div>;
};

export default MapComponent;
