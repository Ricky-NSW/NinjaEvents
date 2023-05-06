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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event) => {
        setUpdatedData({
            ...updatedData,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setAvatarFile(file);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handleSubmit called");

        const nonEmptyUpdatedData = Object.fromEntries(
            Object.entries(updatedData).filter(([_, value]) => value !== '')
        );

        const finalUpdatedData = { ...currentUser, ...nonEmptyUpdatedData };
        console.log("nonEmptyUpdatedData:", nonEmptyUpdatedData);

        let updatedUserDetails; // Declare updatedUserDetails here

        if (currentUser && currentUser.id && avatarFile) {
            const storage = getStorage();
            const avatarRef = ref(storage, `users/uploads/${currentUser.id}/${avatarFile.name}`);
            await uploadBytes(avatarRef, avatarFile);

            const filename = avatarFile.name.split('.')[0];
            const extension = avatarFile.name.split('.')[1];
            const resizedAvatarRef = ref(storage, `users/uploads/${currentUser.id}/avatars/${filename}_200x200.${extension}`);
            console.log("Resized avatar reference:", resizedAvatarRef);

            const downloadUrl = await getDownloadURL(resizedAvatarRef);
            updatedUserDetails = { // Update updatedUserDetails
                ...finalUpdatedData,
                avatarUrl: downloadUrl,
            };

            setUpdatedData(updatedUserDetails);
        } else {
            console.error("currentUser or currentUser.uid is not set.");
        }

        try {
            await updateUserDetailsInDB(currentUser.id, updatedUserDetails); // Use updatedUserDetails here
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
                email: currentUser.email || '',
            });
        }
    }, [currentUser]);


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
                                variant="outlined"
                                name="firstName"
                                value={updatedData.firstName || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                variant="outlined"
                                name="lastName"
                                value={updatedData.lastName || ''}
                                onChange={handleChange}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                required
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
                                label="How long have you been training?"
                                name="trainingDuration"
                                value={updatedData.trainingDuration || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Favourite Obstacle"
                                name="favouriteObstacle"
                                value={updatedData.favouriteObstacle || ''}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/*//TODO: add a loading animation*/}
                        <Grid item xs={12}>
                            {currentUser.avatarUrl && (
                                <img
                                    src={`${currentUser.avatarUrl}?${Date.now()}`} // Add cache-busting query parameter
                                    alt="Avatar"
                                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                                />
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
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default UpdateUserForm;
