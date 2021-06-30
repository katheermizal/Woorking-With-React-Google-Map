import React, { useState, useEffect } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from 'react-google-maps';
import * as parkData from '../../data/google-map-data.json';

const Map = () => {
    const [selectedPark, setSelectedPark] = useState(null);

    useEffect(() => {
        const listener = e => {
            if (e.key === "Escape") {
            setSelectedPark(null);
            }
        };
        window.addEventListener("keydown", listener);

        return () => {
            window.removeEventListener("keydown", listener);
        };
    }, []);

    return (
        <>
            <GoogleMap 
                defaultZoom={10} 
                defaultCenter={{ lat: 45.4211, lng: -75.6903 }}
            >
                { parkData.features.map(park => (
                    <Marker 
                        key={park.properties.PARK_ID}
                        position={{
                            lat: park.geometry.coordinates[1],
                            lng: park.geometry.coordinates[0]
                        }}
                        onClick={() => {
                            setSelectedPark(park);
                        }}
                        icon={{
                            url: `/logo192.png`,
                            scaledSize: new window.google.maps.Size(25, 25)
                        }}
                    />
                ))}

                {selectedPark && (
                    <InfoWindow
                        onCloseClick={() => {
                            setSelectedPark(null);
                        }}
                        position={{
                            lat: selectedPark.geometry.coordinates[1],
                            lng: selectedPark.geometry.coordinates[0]
                        }}
                    >
                        <div>
                            <h2>{selectedPark.properties.NAME}</h2>
                            <p>{selectedPark.properties.DESCRIPTIO}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </>
    )
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default WrappedMap;