import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {mapOptions} from "./mapOptions";

const GoogleMapSingle = ({ marker, loadError }) => {
    const mapRef = useRef(null);
    const [isMarkerLoaded, setMarkerLoaded] = useState(false);

    // Determine latitude and longitude based on the presence of the nested gym object
    const latitude = marker.gym ? marker.gym.latitude : marker.latitude;
    const longitude = marker.gym ? marker.gym.longitude : marker.longitude;
    const reference = marker.gym ? marker.gym.id : marker.id;

    useEffect(() => {
        if (marker) {
            setMarkerLoaded(true);
        }
    }, [marker]);

    return (
        <>
            {loadError ? (
                <div>
                    <p>Failed to load the map:</p>
                    <pre>{JSON.stringify(loadError, null, 2)}</pre>
                </div>
            ) : (
                <>
                    <GoogleMap
                        ref={mapRef}
                        options={{
                            ...mapOptions,
                            zoom: 10, // set zoom level to 10
                        }}
                        center={{ lat: latitude, lng: longitude }} // Add this line
                        mapContainerStyle={{ height: "300px", width: "100%" }}
                    >
                        {isMarkerLoaded &&
                            <Marker
                                key={reference}
                                position={{ lat: latitude, lng: longitude }}
                                onLoad={() => console.log('Marker loaded!')}
                                zIndex={99}
                                // prevent mouse click
                                clickable={false}
                            />
                        }

                    </GoogleMap>
                </>
            )}
        </>
    );
};

export default GoogleMapSingle;
