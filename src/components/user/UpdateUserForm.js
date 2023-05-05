// TODO: add a createdDate prop
//TODO: sanatize the avatar filename so that there are no spaces etc
// TODO: check if users can upload png etc
//TODO: add a loading animation for the image upload
//TODO: whyd does it think the image has not uploaded? delay or something?
//TODO: needs to refresh the page after the user has updated their details

import { useState, useEffect, useContext } from 'react';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
// Add this import at the top of UpdateUserForm.js
import { useDataLayer, updateUserDetailsInDB } from '../data/DataLayer';

import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Switch
} from '@mui/material';

const UpdateUserForm = () => {
    const [userDetails, setUserDetails] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [open, setOpen] = useState(false);
    const [likedGyms, setLikedGyms] = useState([]);
    const { currentUser, gyms, leagues, updateUserData, updateUserDetailsInDB } = useDataLayer();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!currentUser) {
            setError("User not authenticated");
            return;
        }
        setError(null);


        const fetchUserDetails = async () => {
            const db = getFirestore();
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            const userDetails = userDocSnapshot.data();
            setUserDetails(userDetails || currentUser || {});
            // Initialize likedGyms state here
            setLikedGyms(userDetails.likedGyms || []);
        };

        setLoading(false); // Add this line


        fetchUserDetails();
    }, [currentUser?.uid]);

    const handleChange = (event) => {
        if (event.target.name === 'likedGyms' || event.target.name === 'leagues') {
            setUserDetails({
                ...userDetails,
                [event.target.name]: event.target.value,
            });
            // Update likedGyms state as well
            if (event.target.name === 'likedGyms') {
                setLikedGyms(event.target.value);
            }
        } else {
            setUserDetails({
                ...userDetails,
                [event.target.name]: event.target.value,
            });
        }
    };


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setAvatarFile(file);
    };

    // Modify the handleSubmit function
    const handleSubmit = async (event) => {
        event.preventDefault();
        let updatedUserDetails = { ...userDetails };


        if (avatarFile) {
            const storage = getStorage();
            const avatarRef = ref(storage, `users/uploads/${currentUser.uid}/${avatarFile.name}`);
            await uploadBytes(avatarRef, avatarFile);

            const filename = avatarFile.name.split('.')[0];
            const extension = avatarFile.name.split('.')[1];
            const resizedAvatarRef = ref(storage, `users/uploads/${currentUser.uid}/avatars/${filename}_200x200.${extension}`);

            const downloadUrl = await getDownloadURL(resizedAvatarRef);
            updatedUserDetails = {
                ...userDetails,
                avatarUrl: downloadUrl,
            };

            setUserDetails(updatedUserDetails);
        }

        try {
            // Call the imported function here
            await updateUserDetailsInDB(currentUser.uid, updatedUserDetails);
            updateUserData(currentUser.uid, updatedUserDetails); // Update the user data in the context
            handleClose();
        } catch (error) {
            console.error("Error updating user details: ", error);
        }
    };


    //manages liked gyms
    const handleLikeToggle = (gymId) => {
        let updatedLikedGyms = [...likedGyms];
        const index = updatedLikedGyms.indexOf(gymId);
        if (index > -1) {
            // gym is already liked, so remove it from the array
            updatedLikedGyms.splice(index, 1);
        } else {
            // gym is not liked, so add it to the array
            updatedLikedGyms.push(gymId);
        }
        setLikedGyms(updatedLikedGyms);
        setUserDetails({
            ...userDetails,
            likedGyms: updatedLikedGyms
        });
    };



    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    console.log("updateUserForm", userDetails);
    console.log("loading", loading);

    return currentUser ? (
        <>

            {error && (
                <>
                    {console.log('users modal error', error)}
                    <div>{error}</div>
                </>
            )}

            <Button onClick={handleOpen}>Open Update User Form</Button>

            {!loading && (
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Update User Information</DialogTitle>
                <DialogContent>
                    <Container>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        label="First Name"
                                        name="firstName"
                                        value={userDetails.firstName || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        label="Last Name"
                                        name="lastName"
                                        value={userDetails.lastName || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        label="Email"
                                        name="email"
                                        value={userDetails.email || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                {/*//TODO: add a loading animation*/}
                                <Grid item xs={12}>
                                    {userDetails.avatarUrl && (
                                        <img src={userDetails.avatarUrl} alt="Avatar" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                    )}

                                    {/*// Add this code inside the Grid component for Avatar Photo URL*/}
                                    {/*<TextField*/}
                                    {/*    label="Avatar Photo URL"*/}
                                    {/*    name="avatarUrl"*/}
                                    {/*    value={userDetails.avatarUrl || ''}*/}
                                    {/*    onChange={handleChange}*/}
                                    {/*/>*/}
                                    <input
                                        accept="image/*"
                                        type="file"
                                        id="avatarUpload"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="avatarUpload">
                                        <Button component="span" variant="outlined" color="secondary">Upload Avatar</Button>
                                    </label>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        label="Ninja Name"
                                        name="ninjaName"
                                        value={userDetails.ninjaName || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Date of Birth"
                                        type="date"
                                        name="dob"
                                        value={userDetails.dob || ''}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="How long have you been training?"
                                        name="trainingDuration"
                                        value={userDetails.trainingDuration || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Favourite Obstacle"
                                        name="
                                        favouriteObstacle"
                                        value={userDetails.favouriteObstacle || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                {/*//TODO: add a CLOSE button to close the list*/}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="gyms-label">Local Gym</InputLabel>
                                        <Select
                                            labelId="gyms-label"
                                            id="gyms"
                                            name="likedGyms" // Change the name to "likedGyms"
                                            multiple
                                            value={likedGyms} // Use likedGyms as the value
                                            onChange={handleChange} // Use the new handleChange function
                                            label="Local Gym"
                                        >
                                            {gyms.map(gym => (
                                                <MenuItem key={gym.id} value={gym.id}>
                                                    {gym.name}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Achievements"
                                        name="achievements"
                                        value={userDetails.achievements || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                {/*//TODO: add a CLOSE button to close the list*/}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="leagues-label">Associated Leagues</InputLabel>
                                        <Select
                                            labelId="leagues-label"
                                            id="leagues"
                                            name="leagues"
                                            multiple
                                            value={userDetails.leagues || []}
                                            onChange={handleChange} // Use the new handleChange function
                                            label="Associated Leagues"
                                        >
                                            {leagues.map(league => (
                                                <MenuItem key={league.id} value={league.id}>
                                                    {league.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>


                                {userDetails.likedGyms && userDetails.likedGyms.length > 0 && (
                                    <>
                                        <Typography variant="h6" gutterBottom>
                                            Liked Gyms
                                        </Typography>
                                        <Grid container spacing={2} flexDirection="column" alignItems="left">
                                            {userDetails.likedGyms.map((gymId) => {
                                                const gym = gyms.find((g) => g.id === gymId);
                                                console.log('THIS user liked gym', gymId)
                                                return (
                                                    <Grid item key={gymId}>
                                                        <Box display="flex" flexDirection="row" alignItems="center">
                                                            <Typography>{gymId.name}</Typography>
                                                            <Switch
                                                                checked={likedGyms.includes(gymId)}
                                                                onChange={() => handleLikeToggle(gymId)}
                                                            />
                                                        </Box>
                                                    </Grid>

                                                );
                                            })}
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Box>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained">
                                Update
                            </Button>
                            <Button onClick={handleClose} variant="outlined" color="secondary">
                                Close
                            </Button>
                        </Grid>
                    </Container>
                </DialogContent>
            </Dialog>
            )}
        </>
    ) : null;
};

export default UpdateUserForm;

