// TODO: redirect to the event on submit
//TODO: get data from datalayer
import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import { stateToHTML } from 'draft-js-export-html';
import authContext from "../../contexts/AuthContext";

//Firebase
import firebase, { db, auth } from '../../FirebaseSetup';
import { collection, addDoc, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { useDataLayer } from '../data/DataLayer';

//autocomplete
import Autocomplete from '@mui/material/Autocomplete';

// MUI
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';
import Alert from '@mui/material/Alert';

// MUI date
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers';

//wysiwyg
// import { EditorState, ContentState } from 'draft-js';
import WysiwygEditorComponent from '../layout/tools/WysiwygEditorComponent';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';


// import { stateToHTML } from 'draft-js-export-html';
// import htmlToDraft from 'html-to-draftjs';

// const htmlString = '<p>Hello World!</p>';
// const contentState = htmlToDraft(htmlString);

const CreateEvent = () => {
    const {
        gyms,
        leagues,
        events,
        updateUserData,
        updateUserDetailsInDB,
        getGymById,
        getLeagueById,
        getEventById,
        addEvent,
        updateEvent,
        isLoading,
    } = useDataLayer();
    const { currentUser } = useContext(authContext);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [createdBy, setCreatedBy] = useState(null);
    const [searchBox, setSearchBox] = useState(null);
    const [alert, setAlert] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [userType, setUserType] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [selectedGym, setSelectedGym] = useState(null);
    const [updatedEvent, setUpdatedEvent] = useState(null);


    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(
            ContentState.createFromBlockArray(
                htmlToDraft('').contentBlocks
            )
        )
    );

    const handleEditorChange = (state) => {
        setEditorState(state);
        const contentHTML = draftToHtml(convertToRaw(state.getCurrentContent()));
        setUpdatedEvent({ ...updatedEvent, description: contentHTML });
    };



    const handleSubmit = async (e) => {
        //TODO: on submit redirect to the event page
        e.preventDefault();
        if (!userGyms) {
            setError('You need to be logged in to create an event');
            return;
        }
        if (!title) {
            setError('Event Name is required');
            return;
        }

        if (!selectedGym) {
            setError('A gym must be selected');
            return;
        }

        if (userType !== 'Gym Owner' && userType !== 'Admin') {
            setError('Only Gym owners can create an event');
            return;
        }

        try {
            const uid = auth.currentUser.uid;

            const newEvent = {
                date: dateTime.toISOString(),
                title,
                description: updatedEvent.description, // Use updatedEvent.description instead of description
                price,
                age,
                gymId: selectedGym.id,
                createdBy: uid,
                leagueId: selectedLeague ? selectedLeague.id : null,
                name: title,
            };


            const eventId = await addEvent(newEvent); // Use addEvent function from useDataLayer

            console.log('Document written with: ', newEvent);

            await updateEvent(eventId, { id: eventId }); // Use updateEvent function from useDataLayer


            // Get all users
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setTitle('');
            setDescription('');
            setPrice('');
            setAge('');
            setCreatedBy('');
            setError('');
            setAlert('success');
            setShowAlert(true);

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
                setSelectedGym({
                    id: place.place_id,
                });
            }
        }
    };


    useEffect(() => {
        let isMounted = true; // add a flag
        const fetchUserType = async () => {
            if (auth.currentUser) {
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && isMounted) { // check if component is still mounted
                    setUserType(userDoc.data().userType);
                }
            }
        };
        fetchUserType();
        return () => {
            isMounted = false; // cleanup sets flag to false on unmount
        };
    }, []);



    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setError('');
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setError('');
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
        setError('');
    };

    const handleAgeChange = (e) => {
        setAge(e.target.value);
        setError('');
    };

    const handleAddressChange = (e) => {
        // setGymId(e.target.value);
        setError('');
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        let timer;
        if (showAlert) {
            timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000); // 5 seconds
        }
        return () => clearTimeout(timer); // Clear the timer on component unmount or when showAlert changes
    }, [showAlert]);


    // find all gyms that the current user owns
    // gym.ownerUid.includes(currentUser.uid)
    const userGyms = gyms.filter((gym) => gym.ownerUid.includes(currentUser.uid));
console.log('users gyms', userGyms);

    if (currentUser) {
        console.log('create event user uid', currentUser.uid);
    } else {
        console.log('User not loaded yet');
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {userGyms.length === 0 && (
                <Alert severity="error">
                    You need to create a gym before you can create an event
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Event Date & Time"
                        inputVariant="outlined"
                        value={dateTime}
                        onChange={(newDateTime) => setDateTime(newDateTime)}
                        fullWidth
                        margin="normal"
                        required
                    />
                </LocalizationProvider>
                <TextField
                    label="Event Title"
                    variant="outlined"
                    value={title}
                    onChange={handleTitleChange}
                    margin="normal"
                    required
                    fullWidth
                />
                {/*<TextField*/}
                {/*    maxRows={30}*/}
                {/*    minRows={5}*/}
                {/*    label="Description"*/}
                {/*    variant="outlined"*/}
                {/*    value={description}*/}
                {/*    onChange={handleDescriptionChange}*/}
                {/*    margin="normal"*/}
                {/*    required*/}
                {/*    fullWidth*/}
                {/*/>*/}
                <Typography
                    variant="body1"
                    component="p"
                    style={{ marginBottom: "10px" }}
                >Event Description</Typography>
                <WysiwygEditorComponent
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange}
                />
                <TextField
                    label="Price"
                    variant="outlined"
                    value={price}
                    onChange={handlePriceChange}
                    margin="normal"
                    required
                    fullWidth
                />
                <TextField
                    label="Age"
                    variant="outlined"
                    value={age}
                    onChange={handleAgeChange}
                    margin="normal"
                    required
                    fullWidth
                />

                {userGyms.length === 1 ? (
                    //use the default gym id
                    //set gymId to the first gym in the array
                    <TextField
                        label="Gym Address"
                        variant="outlined"
                        value={userGyms[0].name}
                        margin="normal"
                        required
                        fullWidth
                        style={{ display: "none" }}
                    />

                ) : userGyms.length > 1 ? (
                    <TextField
                        select
                        label="Select Gym *"
                        value={selectedGym?.id || ""}
                        onChange={(e) => {
                            const gym = userGyms.find((g) => g.id === e.target.value);
                            setSelectedGym(gym);
                        }}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                    >
                        {gyms
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((gym) => (
                                <MenuItem key={gym.id} value={gym.id}>
                                    {gym.name}
                                </MenuItem>
                            ))}

                    </TextField>

                ) : userGyms.length === 0 ? (
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/create-gym"
                    >
                        There are no Gyms on your account, if this is an error please contact support #CE3342.
                    </Button>
                ) : (
                    <div style={{ display: "none" }} />
                )}


                <Autocomplete
                    options={leagues}
                    getOptionLabel={(option) => option.name}
                    value={selectedLeague}
                    onChange={(event, newValue) => setSelectedLeague(newValue)}
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select League"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                        />
                    )}
                />

                <br />
                {showAlert && (
                    <Alert severity={alert} onClose={handleCloseAlert}>
                        {alert === 'success'
                            ? 'Event created successfully!'
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


export default CreateEvent;
