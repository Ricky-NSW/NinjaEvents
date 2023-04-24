import React, { useState, useEffect } from 'react';
import { doc, addDoc, getDocs, collection, getFirestore } from 'firebase/firestore';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

const SubmitEventResults = ({ eventId }) => {
    const [numPlaces, setNumPlaces] = useState(0);
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);
    const [placeFields, setPlaceFields] = useState([]);
    const [name, setName] = useState('');

    const handleManualEnter = (index, event) => {
        const newResults = [...results];
        const inputValue = event.target.value.trim();

        const user = users.find((user) => {
            const userDisplayName =
                user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.ninjaName || user.displayName || user.email;
            return userDisplayName.toLowerCase() === inputValue.toLowerCase();
        });

        if (inputValue) {
            if (!user) {
                // If it's a manual entry, update the displayName
                newResults[index] = { displayName: inputValue };
            } else {
                // If the user is found in the list, update the id, firstName, and lastName
                newResults[index] = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
            }
        }
        setResults(newResults);
    };




    const resetForm = () => {
        setNumPlaces(0);
        setResults([]);
        setName('');
    };

    useEffect(() => {
        const getUsers = async () => {
            const usersSnapshot = await getDocs(collection(getFirestore(), 'users'));
            const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
        };
        getUsers();
    }, []);

    useEffect(() => {
        const fields = [];
        for (let i = 1; i <= numPlaces; i++) {
            fields.push(
                <div key={i}>
                    <h4>Place {i}</h4>
                    <Autocomplete
                        options={users}
                        getOptionLabel={(user) => {
                            if (user.firstName && user.lastName) {
                                return `${user.firstName} ${user.lastName}`;
                            }
                            return user.ninjaName || user.displayName || user.email;
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id || value === ''}
                        renderInput={(params) => <TextField {...params} label={`User at place ${i}`} onBlur={(event) => handleManualEnter(i - 1, event)} />}
                        renderOption={(props, option, { inputValue }) => (
                            <div {...props}>
                                {option.firstName && option.lastName ? `${option.firstName} ${option.lastName}` : option.displayName || option.email || option.ninjaName}
                            </div>
                        )}
                        onChange={(event, newValue) => {
                            const newResults = [...results];
                            if (typeof newValue === 'string' || Object.keys(newValue).length === 0) {
                                const inputValue = event.target.value.trim();
                                if (inputValue) {
                                    newResults[i - 1] = { displayName: inputValue };
                                }
                            } else {
                                newResults[i - 1] = {
                                    id: newValue.id,
                                    firstName: newValue.firstName,
                                    lastName: newValue.lastName,
                                    displayName: newValue.ninjaName || newValue.displayName || newValue.email,
                                };
                            }
                            setResults(newResults);
                        }}
                        filterOptions={(options, state) => {
                            if (state.inputValue.length >= 4) {
                                return options.filter((option) => {
                                    const label = option.firstName && option.lastName ? `${option.firstName} ${option.lastName}` : option.ninjaName || option.displayName || option.email;
                                    return label.toLowerCase().includes(state.inputValue.toLowerCase());
                                });
                            }
                            return [];
                        }}
                        freeSolo={true}
                    />
                </div>
            );
        }
        setPlaceFields(fields);
    }, [numPlaces, users, results]);

    const handleSubmit = async () => {
        // Save the form results to the event document
        const db = getFirestore();
        const eventDocRef = doc(db, 'events', eventId);
        const resultsCollectionRef = collection(eventDocRef, 'results');

        try {
            // Create a new document in the results subcollection and set its data to the form results
            const docRef = await addDoc(resultsCollectionRef, {
                name,
                results: results.map((result) => {
                    if (result.id) {
                        return {
                            id: result.id,
                            firstName: result.firstName,
                            lastName: result.lastName,
                        };
                    } else {
                        return { displayName: result.displayName };
                    }
                }),
            });
            console.log('Results submitted:', { name, results });
            console.log('Document ID:', docRef.id);
            resetForm();
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    return (
        <div>
            <h3>Submit Event Results</h3>
            <TextField
            type="text"
            size="small"
            sx={{ m: 1, width: '25ch' }}
            label="Title of Results (eg. Pre-teens)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <TextField
                type="number"
                size="small"
                sx={{ m: 1, width: '25ch' }}
                label="Number of Competitors?"
                value={numPlaces}
                onChange={(e) => setNumPlaces(Math.max(0, parseInt(e.target.value)))}
            />
            {placeFields}
            <Button variant="contained" onClick={handleSubmit}>Submit Results</Button>
        </div>
    );
};

export default SubmitEventResults;
