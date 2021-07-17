import React, { useState, useEffect } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow, Circle, DirectionsRenderer } from 'react-google-maps';
import * as parkData from '../../data/google-map-data.json';
import Autocomplete from 'react-google-autocomplete';
import Geocode from 'react-geocode';

Geocode.setApiKey( 'YOUR_API_KEY' );
Geocode.enableDebug();

const Map = (props) => {
    const [selectedPark, setSelectedPark] = useState(null);
    const [mainState, setMainState] = useState({
        address: '',
        mapPosition: {
            lat: props.latPosition,
            lng: props.lngPosition
        },
        markerPosition: {
            lat: props.latPosition,
            lng: props.lngPosition
        }
    });
    const [radiusVal, setRadiusVal] = useState(500);

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

    useEffect(()=> {
        console.log(mainState.mapPosition)
        Geocode.fromLatLng( mainState.mapPosition.lat , mainState.mapPosition.lng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components;

				console.log(address, addressArray );

				setMainState({
					address: ( address ) ? address : '',
                    mapPosition: {
                        lat: props.latPosition,
                        lng: props.lngPosition
                    },
                    markerPosition: {
                        lat: props.latPosition,
                        lng: props.lngPosition
                    }
				})
			},
			error => {
				console.error( error );
			}
		);

        // const DirectionsService = new google.maps.DirectionsService();
        // let origin = { lat: mainState.markerPosition.lat, lng: mainState.markerPosition.lng };
        // let destination;
        // if(selectedPark){
        //     destination = { 
        //         lat: parseFloat(selectedPark.property_location_latitude), lng: parseFloat(selectedPark.property_location_longitude)
        //     };
        // }

        // DirectionsService.route(
        //     {
        //       origin: new google.maps.LatLng(origin),
        //       destination: new google.maps.LatLng(destination),
        //       travelMode: google.maps.TravelMode.DRIVING
        //     },
        //     (result, status) => {
        //       if (status === google.maps.DirectionsStatus.OK) {
        //         setDirections(result);
        //       } else {
        //         console.error(`error fetching directions ${result}`);
        //       }
        //     }
        // );
    },[]);

    const onMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
		    newLng = event.latLng.lng();

		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components;
                setMainState( {
					address: ( address ) ? address : '',
					markerPosition: {
						lat: newLat,
						lng: newLng
					},
					mapPosition: {
						lat: newLat,
						lng: newLng
					},
				} )

                console.log( 'response', response.results );
			},
			error => {
				console.error(error);
			}
		);
        
	};

    const onPlaceSelected = ( place ) => {
		console.log( 'plc', place );
		const address = place.formatted_address,
		      addressArray =  place.address_components,
		      latValue = place.geometry.location.lat(),
		      lngValue = place.geometry.location.lng();
		// Set these values in the state.
		setMainState({
			address: ( address ) ? address : '',
			markerPosition: {
				lat: latValue,
				lng: lngValue
			},
			mapPosition: {
				lat: latValue,
				lng: lngValue
			},
		})
	};

	const onChange = ( event ) => {
		setMainState({ [event.target.name]: event.target.value });
	};

    const onChangeSelection = ( event ) => {
        setRadiusVal(parseFloat(event.target.value));
    }

    const onSelectProperty = (property) => {
        setSelectedPark(property);
    };

    return (
        <>
            <Autocomplete
                    style={{
                        width: '100%',
                        height: '40px',
                        paddingLeft: 0,
                        marginTop: '2px',
                        top: '0px',
                        left: '0px',
                        right: '0px',
                    }}
                    onPlaceSelected={ onPlaceSelected } 
                    
                    options={{
                        types: ["geocode"],
                        componentRestrictions: { country: "lk" },
                    }}
            />
            <div>
                <div className="form-group">
                    <label htmlFor="">Address</label>
                    <input type="text" name="address" className="form-control" onChange={ onChange } readOnly="readOnly" value={ mainState.address }/>
                </div>
                <div className="form-group">
                    <label htmlFor="">Radius</label>
                    <select onChange={ onChangeSelection } className="form-control" name="radius" >
                        <option value="500">0.5km</option>
                        <option value="1000">1km</option>
                        <option value="2000">2km</option>
                        <option value="3000">3km</option>
                        <option value="5000">5km</option>
                        <option value="8000">8km</option>
                        <option value="10000">10km</option>
                    </select>
                </div>
            </div>
            <div style={{width: '100%'}}>
                { parkData.properties.map(property => (
                    <div 
                        style={{width: '100px', display: 'inline-block', margin: '5px', opacity: selectedPark && (selectedPark.id == property.id) ? 0.5 : 1 }} 
                        key={property.id}
                        onClick={() => onSelectProperty(property)}
                    >
                        <img src={property.small_image.url} alt={property.name} style={{width: '100px', height: '100px', objectFit: 'cover' }}  />
                    </div>
                ))} 
            </div>

            <GoogleMap 
                defaultZoom={15} 
                defaultCenter={{ lat: mainState.markerPosition.lat, lng: mainState.markerPosition.lng}}
            >

                <Marker 
                    draggable={true}
                    onDragEnd={ onMarkerDragEnd }
                    position={{
                        lat: mainState.markerPosition.lat,
                        lng: mainState.markerPosition.lng
                    }}
                    icon={{
                        url: `/location.png`,
                        scaledSize: new window.google.maps.Size(45, 60)
                    }}
                />

                { parkData.properties.map(property => (
                    <Marker 
                        key={property.id}
                        draggable={false}
                        position={{
                            lat: parseFloat(property.property_location_latitude),
                            lng: parseFloat(property.property_location_longitude)
                        }}
                        onClick={() => onSelectProperty(property)}
                        icon={{
                            url: `/map-icon.png`,
                            scaledSize: new window.google.maps.Size(45, 60)
                        }}
                    />
                ))}

                {selectedPark && (
                    <>
                        <InfoWindow
                            onCloseClick={() => {
                                setSelectedPark(null);
                            }}
                            position={{
                                lat: parseFloat(selectedPark.property_location_latitude) + 0.0025,
                                lng: parseFloat(selectedPark.property_location_longitude)
                            }}
                        >
                            <div>
                                <h2>{selectedPark.name}</h2>
                                <p>{selectedPark.url_key}</p>
                            </div>
                        </InfoWindow>
                        {/* <DirectionsRenderer directions={directions} /> */}
                    </>
                )}

                <Circle
                    // required
                    center={{
                        lat: mainState.markerPosition.lat,
                        lng: mainState.markerPosition.lng
                    }}

                    onClick={(event) => {
                        console.log(click);
                    }}
                    // required
                    options={{
                        strokeColor: '#902efd',
                        strokeOpacity: 0.5,
                        strokeWeight: 2,
                        fillColor: '#902efd',
                        fillOpacity: 0.35,
                        clickable: false,
                        draggable: false,
                        editable: false,
                        visible: true,
                        radius: radiusVal,
                        zIndex: 1
                    }}
                />

                
            </GoogleMap>
        </>
    )
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default WrappedMap;