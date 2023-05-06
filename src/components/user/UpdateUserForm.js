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
        console.log("handleSubmit called"); // Add this line

        const nonEmptyUpdatedData = Object.fromEntries(
            Object.entries(updatedData).filter(([_, value]) => value !== '')
        );

        const finalUpdatedData = { ...currentUser, ...nonEmptyUpdatedData };
        console.log("nonEmptyUpdatedData:", nonEmptyUpdatedData); // Add this line

        try {
            await updateUserDetailsInDB(currentUser.id, finalUpdatedData);
            handleClose();
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    useEffect(() => {
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
                                fullWidth
                                label="Email"
                                variant="outlined"
                                type="email"
                                name="email"
                                value={updatedData.email || ''}
                                onChange={handleChange}
                            />
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
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default UpdateUserForm;
