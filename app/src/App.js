import React from 'react';
import WrappedMap from './components/google-map/Map';

function App() {
  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBNTafGMXWcUCcqTOojeG7WlV14VX_2w8A`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
      />
    </div>
  );
}

export default App;
