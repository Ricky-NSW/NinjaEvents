import React, { useState, useEffect } from 'react';
import { doc, addDoc, getDocs, collection, getFirestore } from 'firebase/firestore';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
const SubmitEventResults = ({ eventId, eventDate }) => {
    const [numPlaces, setNumPlaces] = useState(0);
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);
    const [placeFields, setPlaceFields] = useState([]);
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleModalToggle = () => {
        setOpen(!open);
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

    //handle result time
    const handleMinutesChange = (event, index) => {
        const newResults = [...results];
        newResults[index] = newResults[index] || {}; // <-- This line
        newResults[index].totalTime = (newResults[index].totalTime % 60000) + (parseInt(event.target.value, 10) * 60000);
        setResults(newResults);
    }

    const handleSecondsChange = (event, index) => {
        const newResults = [...results];
        newResults[index] = newResults[index] || {}; // <-- This line
        newResults[index].totalTime = (newResults[index].totalTime % 1000) + ((parseInt(event.target.value, 10) % 60) * 1000);
        setResults(newResults);
    }

    const handleSplitSecondsChange = (event, index) => {
        const newResults = [...results];
        newResults[index] = newResults[index] || {}; // <-- This line
        newResults[index].totalTime = ((Math.floor(newResults[index].totalTime / 1000)) * 1000) + (parseInt(event.target.value, 10) % 1000);
        setResults(newResults);
    }



    useEffect(() => {
        const fields = [];
        for (let i = 1; i <= numPlaces; i++) {
            fields.push(
                <div key={i}>
                    <h4>Place {i}</h4>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={users}
                                getOptionLabel={(user) => {
                                    if (typeof user === 'string') {
                                        return user;
                                    }
                                    if (user.firstName && user.lastName) {
                                        return `${user.firstName} ${user.lastName}`;
                                    }
                                    return user.ninjaName || user.displayName || user.email;
                                }}

                                isOptionEqualToValue={(option, value) => option.id === value.id || value === ''}
                                renderInput={(params) => <TextField {...params} label={`User at place ${i}`} fullWidth onChange={(event) => handleManualEnter(i, event)} />}

                                renderOption={(props, option, { inputValue }) => (
                                    <div {...props}>
                                        {option.firstName && option.lastName ? `${option.firstName} ${option.lastName}` : option.displayName || option.email || option.ninjaName}
                                    </div>
                                )}
                                onChange={(event, newValue) => {
                                    const newResults = [...results];
                                    if (typeof newValue === 'string' || newValue === null || Object.keys(newValue).length === 0) {
                                        const inputValue = (typeof newValue === 'string' ? newValue : event.target.value).trim();
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
                        </Grid>
                        <Grid container XS={6} spacing={1}>
                            <Grid item xs={4}>
                                <TextField
                                    type="number"
                                    label="Minutes"
                                    fullWidth
                                    inputProps={{ min: 0 }}
                                    onChange={(event) => handleMinutesChange(event, i - 1)}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    type="number"
                                    label="Seconds"
                                    fullWidth
                                    inputProps={{ min: 0, max: 59 }}
                                    onChange={(event) => handleSecondsChange(event, i - 1)}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    type="number"
                                    label="Split Seconds"
                                    fullWidth
                                    inputProps={{ min: 0, max: 999 }}
                                    onChange={(event) => handleSplitSecondsChange(event, i - 1)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="text"
                                label="Furthest Obstacle"
                                fullWidth
                                onChange={(event) => {
                                    const newResults = [...results];
                                    newResults[i - 1] = { ...newResults[i - 1], furthestObstacle: event.target.value };
                                    setResults(newResults);
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            );
        }
        setPlaceFields(fields);
    }, [numPlaces, users, results]);

    useEffect(() => {
        const currentDate = new Date();
        const eventDateObj = new Date(eventDate);

        if (eventDateObj < currentDate) {
            setShowForm(true);
        } else {
            setShowForm(false);
        }
    }, [eventDate]);


    const handleSubmit = async () => {
        // Save the form results to the event document
        const db = getFirestore();
        const eventDocRef = doc(db, 'events', eventId);
        const resultsCollectionRef = collection(eventDocRef, 'results');
        setIsSubmitting(true);

        try {
            // Create a new document in the results subcollection and set its data to the form results
            const docRef = await addDoc(resultsCollectionRef, {
                name,
                results: results.map((result, index) => {
                    if (result.id) {
                        return {
                            id: result.id,
                            firstName: result.firstName,
                            lastName: result.lastName,
                            totalTime: result.totalTime ?? 0,  // default value if undefined
                            furthestObstacle: result.furthestObstacle ?? "",  // default value if undefined
                            resultPlace: index + 1, // get the index of the result in the results array and add 1
                        };
                    } else {
                        return {
                            displayName: result.displayName,
                            totalTime: result.totalTime ?? 0,  // default value if undefined
                            furthestObstacle: result.furthestObstacle ?? "",  // default value if undefined
                        };
                    }
                }),
            });
            console.log('Results submitted:', { name, results });
            console.log('Document ID:', docRef.id);
            resetForm();
        } catch (error) {
            console.error('Error adding document:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return showForm ? (
        <div>
            <Button variant="contained" onClick={handleModalToggle}>
                Enter Results
            </Button>
            <Dialog open={open} onClose={handleModalToggle} fullWidth maxWidth="sm">
                <DialogTitle>Submit Event Results</DialogTitle>
                <DialogContent>
                    <TextField
                        type="text"
                        size="small"
                        sx={{ m: 1, width: '25ch' }}
                        label="Title of Results (eg. Pre-teens OR Pro Males)"
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
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>Submit Results</Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    ) : null;

};

export default SubmitEventResults;
