import React, { useState, useEffect } from "react";
import Map from './Map';
import useGeoLocation from "../hooks/useGeoLocation";


const Home = (props) => {
    const location = useGeoLocation();

    return (
        <div style={{ margin: '100px' }}>
            {
                location.loaded ? (
                    <Map
                        google={props.google}
                        center={{lat: parseFloat(location.coordinates.lat), lng: parseFloat(location.coordinates.lng)}}
                        height='300px'
                        zoom={15}
                    />
                ) : "Location data not available yet."
            }
        </div>
    );
}


export default Home;