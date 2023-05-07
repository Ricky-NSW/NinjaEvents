import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    Box,
    TextField,
    Typography,
    Grid,
    Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDataLayer } from '../data/DataLayer';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import UserAvatarUpload from './UserAvatarUpload'; // Add this import

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const UpdateUserForm = () => {
    const classes = useStyles();
    const { currentUser, updateUserDetailsInDB } = useDataLayer();
    const [open, setOpen] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);

    const handleAvatarUpload = (newAvatarUrl) => {
        setAvatarUrl(newAvatarUrl);
    };


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event) => {
        setUpdatedData({
            ...updatedData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handleSubmit called");

        const nonEmptyUpdatedData = Object.fromEntries(
            Object.entries(updatedData).filter(([_, value]) => value !== '')
        );

        const finalUpdatedData = { ...currentUser, ...nonEmptyUpdatedData };
        console.log("nonEmptyUpdatedData:", nonEmptyUpdatedData);

        let updatedUserDetails = { ...finalUpdatedData }; // Initialize updatedUserDetails here

        if (avatarUrl) { // Check if there's a new avatarUrl
            updatedUserDetails.avatarUrl = avatarUrl; // Save new avatarUrl in updatedUserDetails
        }

        try {
            await updateUserDetailsInDB(currentUser.id, updatedUserDetails);
            handleClose();
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };




    useEffect(() => {
        if (!currentUser) {
            setError("User not authenticated");
            return;
        }
        setError(null);

        if (currentUser) {
            setUpdatedData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                ninjaName: currentUser.ninjaName || '',
                dob: currentUser.dob || '',
                trainingDuration: currentUser.trainingDuration || '',
                favouriteObstacle: currentUser.favouriteObstacle || '',
                email: currentUser.email || '',
            });

            if (updatedData.avatarUrl) {
                setAvatarUrl(updatedData.avatarUrl);
            } else if (currentUser.avatarUrl) {
                setAvatarUrl(currentUser.avatarUrl);
            }
        }
    }, [currentUser, updatedData.avatarUrl]);




    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Edit Profile
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="edit-profile-modal"
                aria-describedby="modal-for-editing-user-profile"
            >
                <Box
                    component={Paper}
                    className={classes.paper}
                    onSubmit={handleSubmit}
                    as="form"
                >

                    <Typography variant="h6" component="h2">
                        Edit Profile
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="First Name"
                                // variant="outlined"
                                name="firstName"
                                value={updatedData.firstName || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                // variant="outlined"
                                name="lastName"
                                value={updatedData.lastName || ''}
                                onChange={handleChange}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ninja Name"
                                name="ninjaName"
                                value={updatedData.ninjaName || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Date of Birth"
                                type="date"
                                name="dob"
                                value={updatedData.dob || ''}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="How long have you been training?"
                                name="trainingDuration"
                                value={updatedData.trainingDuration || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Favourite Obstacle"
                                name="favouriteObstacle"
                                value={updatedData.favouriteObstacle || ''}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/*//TODO: add a loading animation*/}
                        <Grid item xs={12}>
                            {(avatarUrl || currentUser.avatarUrl) && (
                                <img
                                    src={`${avatarUrl || currentUser.avatarUrl}?${Date.now()}`} // Use the avatarUrl state
                                    alt="Avatar"
                                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                                />
                            )}
                            <UserAvatarUpload userId={currentUser.id} onAvatarUpload={handleAvatarUpload} />
                        </Grid>



                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                onClick={handleSubmit} // Add this line
                            >
                                Save Changes
                            </Button>
                        {/* add a cancel button here, which closes the modal*/}


                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default UpdateUserForm;
