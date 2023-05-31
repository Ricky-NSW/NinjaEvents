//todo centre the mao to contain all markers
//todo add marker clustering
import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { GoogleMap, Marker, MarkerClusterer } from "@react-google-maps/api";
import {mapOptions} from "./mapOptions";
import { useNavigate } from 'react-router-dom';

function GoogleMapArray({ markers = [], onMapLoad, nestedGym }) {
    const mapRef = useRef(null);
    const [markersLoaded, setMarkersLoaded] = useState(false);

    const markerPositions = useMemo(() => markers.map((marker) =>
        nestedGym
            ? { lat: Number(marker.gym.latitude), lng: Number(marker.gym.longitude) }
            : { lat: Number(marker.latitude), lng: Number(marker.longitude) }
    ), [markers, nestedGym]);


    // console.log("Map Options:", mapOptions); // Check the mapOptions object in the console

    const fitBounds = () => {
        if (!mapRef.current || markerPositions.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        markerPositions.forEach((position) => {
            bounds.extend({ lat: position.lat, lng: position.lng });
        });

        console.log("Bounds:", bounds); // Check the bounds object in the console

        if (mapRef.current) {
            mapRef.current.fitBounds(bounds);
        }
    };



//Please note that React might warn you about including mapRef.current in the dependency array, as it's generally not recommended to include mutable values in dependency arrays. However, in this case, we want to call fitBounds whenever the GoogleMap instance (i.e., mapRef.current) is available, so it's necessary to include it.
    useEffect(() => {
        if (mapRef.current) {
            setTimeout(fitBounds, 200);
        }
    }, [markers, mapRef.current, markerPositions]);



    // Filter out markers with invalid latitudes or longitudes
// Filter out markers with invalid latitudes or longitudes
    const validMarkers = markers.filter((marker) =>
        nestedGym
            ? marker.gym && marker.gym.latitude && marker.gym.longitude
            : marker.latitude && marker.longitude
    );


    // handle click event for the marker
    //refactoring to use a method that takes the marker as an argument.
    const navigate = useNavigate();
    const handleMarkerClick = (marker) => {
        const targetRoute = nestedGym ? `/events/${marker.slug}` : `/gyms/${marker.slug}`;
        navigate(targetRoute);
    };

    //Use useCallback for Functions in Props: The onLoad function can be memoized with useCallback to avoid unnecessary re-renders.
    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
        onMapLoad && onMapLoad(map);
        fitBounds(); // Call fitBounds here
        console.log("Map Reference:", mapRef.current); // Log the mapRef.current value
    }, [onMapLoad, fitBounds]);


    const handleIdle = useCallback(() => {
        setMarkersLoaded(true); // Map has finished loading
    }, []);


    return (
        <>

            <GoogleMap
                ref={mapRef}
                options={mapOptions}
                onLoad={handleMapLoad}
                onIdle={handleIdle}
                mapContainerStyle={{ height: "500px", width: "100%" }}
            >
                {markersLoaded &&
                    <MarkerClusterer
                    options={{ imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m" }}
                >
                    {(clusterer) =>
                        validMarkers.map((marker) => {
                            const position = nestedGym
                                ? { lat: Number(marker.gym.latitude), lng: Number(marker.gym.longitude) }
                                : { lat: Number(marker.latitude), lng: Number(marker.longitude) };

                            return (
                                <Marker
                                    key={marker.id}
                                    position={position}
                                    onClick={() => handleMarkerClick(marker)}
                                    clusterer={clusterer}
                                />
                            );
                        })
                    }
                </MarkerClusterer>
                }
            </GoogleMap>

        </>
    );
};

export default GoogleMapArray;
