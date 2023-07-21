import React, { useEffect, useState, useContext } from 'react';

//Firebase
import firebase, { db, auth, storage } from '../../FirebaseSetup';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDoc } from 'firebase/firestore';
import AuthContext from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // this replaces useHistory

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
    const navigate = useNavigate();
    const [area, setArea] = useState('');


    useEffect(() => {
        if (auth.currentUser) {
            setCreatedBy(auth.currentUser.uid);
        }
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            setError('You need to be logged in as a Gym Owner to create an gym');
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

        const cleanedGymName = gymName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').toLowerCase();

        try {
            //Once you've confirmed that the user is signed in, you can get their UID by accessing the uid property of the auth.currentUser object:

            const uid = auth.currentUser.uid;
            console.log(auth.currentUser.uid)

            const docRef = await addDoc(collection(db, 'gyms'), {
                name: gymName,
                slug: cleanedGymName,
                ownerUid: currentUser.uid,
                address: address.address,
                suburb: address.suburb,
                state: address.state,
                country: address.country,
                latitude: address.lat,
                longitude: address.lng,
                createdBy: uid
            });




            setMessage('Gym successfully created.');
            setGymName('');
            // setCreatedBy('');
            setError('');
            setAlert('success');
            setShowAlert(true);
            // Clear the address field
            setAddress({ address: "", lat: null, lng: null });
            console.log('Gym data added to Firestore:', docRef);
            console.log('Document written with ID: ', docRef.id);
            console.log('Document for Gynmane: ', docRef.name);

            const docSnap = await getDoc(doc(db, 'gyms', docRef.id));
            if (docSnap.exists()) {
                const gymData = docSnap.data();
                console.log('Document Data: ', gymData);
            }

            if (image) {
                // Upload image to Firebase Storage
                const imageRef = ref(storage, `images/${docRef.id}`);
                await uploadBytes(imageRef, image);

                // Update gym document with image URL
                const gymDocRef = doc(db, 'gyms', docRef.id);
                const imageUrl = await getDownloadURL(imageRef);
                await updateDoc(gymDocRef, { imageUrl });
            }

            // Update the user document with the new gym id in the managedGyms field
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                managedGyms: arrayUnion({ id: docRef.id, name: gymName }),
            });


            //navigate to the new gym
            navigate(`/gyms/${docRef.id}`);

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
                let suburb = '';
                let state = '';
                let country = '';
                for (let i = 0; i < place.address_components.length; i++) {
                    const component = place.address_components[i];
                    switch (component.types[0]) {
                        case 'locality':
                            suburb = component.long_name;
                            break;
                        case 'administrative_area_level_1':
                            state = component.long_name;
                            break;
                        case 'country':
                            country = component.long_name;
                            break;
                    }
                }
                setAddress({
                    address: place.formatted_address,
                    suburb,
                    state,
                    country,
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


    const handleImageChange = (gym) => {
        if (gym.target.files[0]) {
            setImage(gym.target.files[0]);
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

    // Handle function for Area input
    const handleAreaChange = (e) => {
        setArea(e.target.value);
        setError('');
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return (
        <>
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

                {/*//this needs to be a description field with a qysiwyg editor */}
                {/*WysiwygEditor goes here*/}
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
        </>
    );
}


export default CreateGym;
