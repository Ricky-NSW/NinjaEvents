//todo centre the mao to contain all markers
//todo add marker clustering
import React, { useEffect, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {mapOptions} from "./mapOptions";

function GoogleMapArray({ markers, onMapLoad, nestedGym}) {
    const mapRef = useRef(null);

    const markerPositions = markers.map((marker) =>
        nestedGym
            ? { lat: Number(marker.gym.latitude), lng: Number(marker.gym.longitude) }
            : { lat: Number(marker.latitude), lng: Number(marker.longitude) }
    );


    const fitBounds = () => {
        if (!mapRef.current || markerPositions.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        markerPositions.forEach((position) => {
            bounds.extend({ lat: position.lat, lng: position.lng });
        });
        mapRef.current.fitBounds(bounds);
    };


    useEffect(() => {
        fitBounds();
    }, [markers]);


    // const filteredMarkers = markers.gym.filter(
    //     (marker) => marker.latitude && marker.longitude
    // );

    // handle click event for the marker
    const handleMarkerClick = (targetRoute) => {
        window.location.href = targetRoute;
    };

    return (
        <>

                <GoogleMap
                    ref={mapRef}
                    options={mapOptions}
                    onLoad={(map) => {
                        mapRef.current = map;
                        onMapLoad && onMapLoad(map);
                    }}
                    mapContainerStyle={{ height: "500px", width: "100%" }}
                >

                    {markers.map((marker, index) => {
                        const position = nestedGym
                            ? { lat: Number(marker.gym.latitude), lng: Number(marker.gym.longitude) }
                            : { lat: Number(marker.latitude), lng: Number(marker.longitude) };

                        console.log("Event position:", position);

                        const targetRoute = nestedGym
                            ? `/events/${marker.id}`
                            : `/gyms/${marker.id}`;

                        return (
                                <Marker
                                    key={marker.id}
                                    position={position}
                                    onClick={() => handleMarkerClick(targetRoute)}
                                />
                        );
                    })}


                </GoogleMap>
        </>
    );
};

export default GoogleMapArray;
