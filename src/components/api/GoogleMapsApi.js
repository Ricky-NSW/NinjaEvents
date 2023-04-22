// GoogleMapsApi.js
import React, { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';

const GoogleMapsApi = ({ children, libraries, apiKey }) => {
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);

    return (
        <LoadScript
            googleMapsApiKey={apiKey}
            libraries={libraries}
            onLoad={() => {
                console.log('Google Maps API loaded');
                setIsApiLoaded(true);
            }}
            onError={(error) => setLoadError(error)}
        >
            {isApiLoaded && React.cloneElement(children, { loadError })}
        </LoadScript>
    );
};

export default GoogleMapsApi;
