import React, { useState } from 'react';
import GoogleMapsApi from '../api/GoogleMapsApi';
import { db } from '../../FirebaseSetup';

const GymScraper = () => {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [gyms, setGyms] = useState([]);

    const handleSearch = () => {
        const center = { lat: parseFloat(lat), lng: parseFloat(lng) };
        const map = new window.google.maps.Map(document.createElement('div'), {
            center: center,
            zoom: 12,
        });
        const service = new window.google.maps.places.PlacesService(map);
        const request = {
            location: center,
            radius: '999999', // Specify the search radius in meters
            keyword: 'Ninja Warrior Gym',
        };
        service.nearbySearch(request, callback);
    };

    const callback = (results, status) => {
        const locationData = [];
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
                const service = new window.google.maps.places.PlacesService(
                    document.createElement('div')
                );
                service.getDetails({ placeId: place.place_id }, (details, status) => {
                    if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        details.website
                    ) {
                        locationData.push({
                            name: details.name,
                            address: details.formatted_address,
                            id: place.place_id,
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng(),
                            country: details.address_components.find(component => component.types.includes('country')).long_name,
                            state: details.address_components.find(component => component.types.includes('administrative_area_level_1')).long_name,
                            website: details.website,
                        });
                    }
                    setGyms(locationData);
                });
            });
        } else {
            console.error('An error occurred while fetching the data');
        }
    };

    const handleSaveToFirestore = () => {
        gyms.forEach((gym) => {
            db.collection('gyms')
                .add(gym)
                .then((docRef) => {
                    console.log('Gym document written with ID: ', docRef.id);
                })
                .catch((error) => {
                    console.error('Error adding gym document: ', error);
                });
        });
    };


    return (
        <>
            <input
                type="text"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
            />
            <input
                type="text"
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
            />
            <button onClick={handleSearch}>Search Gyms</button>
            {gyms.length > 0 && (
                <>
                    <h2>Gyms Found:</h2>
                    <ul>
                        {gyms.map((gym) => (
                            <li key={gym.id}>
                                <strong>{gym.name}</strong>
                                <br />
                                {gym.address}
                                <br />
                                {gym.country} - {gym.state}
                                <br />
                                {gym.website}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleSaveToFirestore}>
                        Save to Firestore
                    </button>
                </>
            )}
            <GoogleMapsApi
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                libraries={['places']}
            />
        </>
    );
};

export default GymScraper;
