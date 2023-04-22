import React, { useEffect, useState, useContext } from 'react';

//Firebase
import firebase, { db, auth, storage } from '../../FirebaseSetup';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDoc } from 'firebase/firestore';
import AuthContext from '../../contexts/AuthContext';

//google maps
import { StandaloneSearchBox } from '@react-google-maps/api';


// MUI
import { Box, Button, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Alert from '@mui/material/Alert';


function CreateGym() {
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [gymName, setGymName] = useState('');
    const [image, setImage] = useState(null);
    const [searchBox, setSearchBox] = useState(null);
    const [address, setAddress] = useState({ address: "", lat: null, lng: null });
    const [userType, setUserType] = useState(null);
    const [message, setMessage] = useState('');
    const { currentUser } = useContext(AuthContext);
    const [createdBy, setCreatedBy] = useState(null);
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            setError('You need to be logged in as a Gym Owner to create an event');
            return;
        }
        if (!gymName) {
            setError('Gym Name is required');
            return;
        }

        if (userType !== 'Gym Owner') {
            setError('You need to be a Gym Owner to Create a Gym, contact Admin for help');
            return;
        }

        if (!address.lat || !address.lng) {
            setError('Please select a valid address from the search box');
            return;
        }

        try {
            //Once you've confirmed that the user is signed in, you can get their UID by accessing the uid property of the auth.currentUser object:

            const uid = auth.currentUser.uid;
            console.log(auth.currentUser.uid)

            const docRef = await addDoc(collection(db, 'gyms'), {
                name: gymName,
                ownerUid: currentUser.uid,
                address: address.address,
                latitude: address.lat,
                longitude: address.lng,
                createdBy: uid // Include the user's UID as a field in the document
            });

            setMessage('Gym successfully created.');
            setGymName('');
            setCreatedBy('');
            setError('');
            setAlert('success');
            setShowAlert(true);
            // Clear the address field
            setAddress({ address: "", lat: null, lng: null });

            console.log('Document written with ID: ', docRef.id);

            if (image) {
                // Upload image to Firebase Storage
                const imageRef = ref(storage, `images/${docRef.id}`);
                await uploadBytes(imageRef, image);

                // Update event document with image URL
                const eventDocRef = doc(db, 'events', docRef.id);
                const imageUrl = await getDownloadURL(imageRef);
                await updateDoc(eventDocRef, { imageUrl });
            }

        } catch (error) {
            console.error('Error adding document: ', error);
            setAlert('error');
            setShowAlert(true);
            setError(`Error adding document: ${error.message}`);
        }
    };


    const handlePlacesChanged = () => {
        if (searchBox) {
            const place = searchBox.getPlaces()[0];
            if (place) {
                setAddress({
                    address: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            }
        }
    };

    useEffect(() => {
        const fetchUserType = async () => {
            if (auth.currentUser) {
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserType(userDoc.data().userType);
                }
            }
        };

        fetchUserType();
    }, []);


    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const handleGymNameChange = (e) => {
        setGymName(e.target.value);
        setError('');
    };


    const handleAddressChange = (e) => {
        setAddress({
            address: e.target.value,
            lat: null,
            lng: null,
        });
        setError('');
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };



    return (
        <>
            {/*<LoadScript*/}
            {/*    googleMapsApiKey={apiKey}*/}
            {/*    libraries={libraries}*/}
            {/*    onLoad={() => {*/}
            {/*        console.log('Google Maps API loaded');*/}
            {/*        setIsApiLoaded(true);*/}
            {/*    }}*/}
            {/*    onError={(error) => setLoadError(error)}*/}
            {/*>*/}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Gym Name"
                            value={gymName}
                            variant="outlined"
                            onChange={handleGymNameChange}
                            margin="normal"
                            required
                            fullWidth
                        />

                        {/*//TODO: make this auto fill from google*/}
                        {/*//TODO: prevent autofull from starting until they have entered 5 characters or spaces*/}
                        {/*TODO: See this for optimisation tips https://developers.google.com/maps/optimization-guide*/}
                        <StandaloneSearchBox
                            onLoad={ref => setSearchBox(ref)}
                            onPlacesChanged={handlePlacesChanged}
                        >
                            <TextField
                                label="address"
                                variant="outlined"
                                value={address.address}
                                onChange={handleAddressChange}
                                margin="normal"
                                required
                                fullWidth
                            />
                        </StandaloneSearchBox>

                        <IconButton color="primary" aria-label="upload picture" component="label">
                            <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                            <PhotoCamera />
                        </IconButton>
                        <br />
                        {showAlert && (
                            <Alert severity={alert} onClose={handleCloseAlert}>
                                {alert === 'success'
                                    ? 'Gym added successfully!'
                                    : error}
                            </Alert>
                        )}
                        <br />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        &nbsp;
                        <Button type="submit" variant="contained">Submit</Button>
                    </Box>
            {/*</LoadScript>*/}
        </>
    );
}


export default CreateGym;
