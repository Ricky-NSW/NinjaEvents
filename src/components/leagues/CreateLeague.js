// age
// NCL = year you are born (eg jan 01 2016 - Dec 31 2016 && jan 01 2015)
// Kids
// Mature kids
// pre-teens
// Teens
// Youth (NCL)
// Adults

import React, { useEffect, useState, useContext } from 'react';

// Firebase
import firebase, { db, auth } from '../../FirebaseSetup';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import AuthContext from '../../contexts/AuthContext';

// MUI
import { Box, Button, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';

function CreateLeague() {
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [leagueName, setLeagueName] = useState('');
    const [description, setDescription] = useState(''); // Added description state
    const [address, setAddress] = useState({ address: "", lat: null, lng: null });
    const [userType, setUserType] = useState(null);
    const [message, setMessage] = useState('');
    const { currentUser } = useContext(AuthContext);
    const [createdBy, setCreatedBy] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            setError('You need to be logged in as a League Admin to create an event');
            return;
        }
        if (!leagueName) {
            setError('League Name is required');
            return;
        }

        if (userType !== 'League Admin') {
            setError('You need to be a League Admin to Create a League, contact Admin for help');
            return;
        }


        try {
            //Once you've confirmed that the user is signed in, you can get their UID by accessing the uid property of the auth.currentUser object:

            const uid = auth.currentUser.uid;
            console.log(auth.currentUser.uid)

            //create the league document
            const docRef = await addDoc(collection(db, 'leagues'), {
                name: leagueName,
                description: description, // Include the description field
                OwnerUid: currentUser.uid,
                createdBy: uid // Include the user's UID as a field in the document
            });

            // Update the user document with the new league ID
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                leagues: arrayUnion(docRef.id) // Add the new league ID to the leagues array
            });

            setMessage('League successfully created.');
            setLeagueName('');
            setDescription(''); // Reset the description field
            setCreatedBy('');
            setError('');
            setAlert('success');
            setShowAlert(true);

            console.log('Document written with ID: ', docRef.id);


        } catch (error) {
            console.error('Error adding document: ', error);
            setAlert('error');
            setShowAlert(true);
            setError(`Error adding document: ${error.message}`);
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


    const handleLeagueNameChange = (e) => {
        setLeagueName(e.target.value);
        setError('');
    };



    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setError('');
    };


    return (
        <>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="League Name"
                    value={leagueName}
                    variant="outlined"
                    onChange={handleLeagueNameChange}
                    margin="normal"
                    required
                    fullWidth
                />
                <TextField // Added description TextField
                    label="Description"
                    value={description}
                    variant="outlined"
                    onChange={handleDescriptionChange}
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    rows={4}
                />
                <br />
                {showAlert && (
                    <Alert severity={alert} onClose={handleCloseAlert}>
                        {alert === 'success'
                            ? 'League added successfully!'
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

export default CreateLeague;
