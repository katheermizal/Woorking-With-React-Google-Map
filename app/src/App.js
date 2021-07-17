import React from 'react';
import WrappedMap from './components/google-map/Map';
import useGeoLocation from './hooks/useGeoLocation';
import Geocode from 'react-geocode';
// Geocode.setApiKey( GoogleMapsAPI );
Geocode.enableDebug();

function App() {
  const location = useGeoLocation();
  if(location.loaded){
    console.log(location.coordinates);
  }
  return (
    <div style={{width: '100vw', height: '100vh', position: 'relative'}}>
      {
        location.loaded ? (
          <WrappedMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=YOUR_API_KEY`}
            loadingElement={<div style={{ height: "100%", width: "100%" }} />}
            containerElement={<div style={{ height: "100%", width: "100%" }} />}
            mapElement={<div style={{ height: "100%" }} />}
            latPosition={parseFloat(location.coordinates.lat)}
            lngPosition={parseFloat(location.coordinates.lng)}
          />
        ) : "Location data not available yet."
      }
    </div>
  );
}

export default App;
