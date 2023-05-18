import React, { useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

import GoogleMapsApi from '../api/GoogleMapsApi';
import {mapOptions} from "./mapOptions";
const GoogleMapSingle = ({ marker, onMapLoad, loadError }) => {
    const mapRef = useRef(null);



    // Determine latitude and longitude based on the presence of the nested gym object
    const latitude = marker.gym ? marker.gym.latitude : marker.latitude;
    const longitude = marker.gym ? marker.gym.longitude : marker.longitude;
    const reference = marker.gym ? marker.gym.id : marker.id;

// Fit bounds on map load
    const onLoad = (map) => {
        if (onMapLoad) {
            onMapLoad(map);
        }

        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat: latitude, lng: longitude });
        map.fitBounds(bounds);
    };


    return (
        <>
            {loadError ? (
                <div>
                    <p>Failed to load the map:</p>
                    <pre>{JSON.stringify(loadError, null, 2)}</pre>
                </div>
            ) : (
                <>
                    <p>{latitude}</p>
                    <p>{longitude}</p>
                    {/*<p>{reference}</p>*/}
                    <GoogleMap
                        ref={mapRef}
                        options={{
                            ...mapOptions,
                            zoom: 10, // set zoom level to 10
                        }}
                        onLoad={onLoad} // Use the defined onLoad function
                        mapContainerStyle={{ height: "500px", width: "100%" }}
                    >

                            <Marker
                                key={reference}
                                position={{
                                    lat: 37.7749, // Example coordinates for San Francisco
                                    lng: -122.4194,
                                }}
                                onLoad={() => console.log('Marker loaded!')}

                                zIndex={99}
                            />

                    </GoogleMap>
                </>
            )}
        </>
    );

};

export default GoogleMapSingle;
