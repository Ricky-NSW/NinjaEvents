//todo centre the mao to contain all markers
//todo add marker clustering
import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { GoogleMap, Marker, MarkerClusterer } from "@react-google-maps/api";
import {mapOptions} from "./mapOptions";
import { useNavigate } from 'react-router-dom';
import { useDataLayer } from '../data/DataLayer';

function GoogleMapArray({ markers = [], onMapLoad, nestedGym }) {
    const mapRef = useRef(null);
    const [markersLoaded, setMarkersLoaded] = useState(false);
    const { gyms } = useDataLayer();
    // Function to get gym data based on gymId
    const getGymData = (gymId) => gyms.find(gym => gym.id === gymId);

    function removeDuplicates(originalArray, props) {
        let unique_values = [];
        let result = originalArray.filter((obj, index, self) =>
            self.findIndex((t) => {
                let match = true;
                for (let p of props) {
                    match = match && t[p] === obj[p];
                }
                if (match) {
                    if (!unique_values.includes(obj[props[0]])) {
                        unique_values.push(obj[props[0]]);
                        return true;
                    }
                }
                return false;
            }) === index
        );
        return result;
    }


    const markerPositions = useMemo(() => markers.map((marker) =>
        nestedGym
            ? getGymData(marker.gymId)
                ? { lat: Number(getGymData(marker.gymId).latitude), lng: Number(getGymData(marker.gymId).longitude) }
                : { lat: Number(marker.latitude), lng: Number(marker.longitude) }
            : { lat: Number(marker.latitude), lng: Number(marker.longitude) }
    ), [markers, nestedGym, gyms]);

    const uniqueMarkerPositions = removeDuplicates(markerPositions, ['lat', 'lng']);

// Filter out markers with invalid latitudes or longitudes
    const validMarkers = markers.filter((marker) =>
        nestedGym
            ? getGymData(marker.gymId) && getGymData(marker.gymId).latitude && getGymData(marker.gymId).longitude
            : marker.latitude && marker.longitude
    );

    const uniqueValidMarkers = removeDuplicates(validMarkers, ['latitude', 'longitude']);


    // console.log("Map Options:", mapOptions); // Check the mapOptions object in the console

    const fitBounds = () => {
        if (!mapRef.current || uniqueMarkerPositions.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        uniqueMarkerPositions.forEach((position) => {
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
    }, [markers, mapRef.current, uniqueMarkerPositions]);


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
                            uniqueValidMarkers.map((marker) => {
                                const position = nestedGym
                                    ? getGymData(marker.gymId)
                                        ? { lat: Number(getGymData(marker.gymId).latitude), lng: Number(getGymData(marker.gymId).longitude) }
                                        : { lat: Number(marker.latitude), lng: Number(marker.longitude) }
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
