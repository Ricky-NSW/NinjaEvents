import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';

const EditGymDetails = ({ gym }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (gym) {
            setFormData(gym);
        }
    }, [gym]);

    // Update the formData object when input values change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Save the updated gym data to Firestore
// Save the updated gym data to Firestore
    const saveGymData = async (handleClose) => {
        const gymRef = doc(getFirestore(), 'gyms', gym.id);
        await updateDoc(gymRef, formData);
        handleClose();
    };


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    console.log('editgymdetails', gym);
    return (
        <>
            <Button variant="contained" onClick={handleOpen}>
                Edit Gym Details
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Gym Details</DialogTitle>
                <DialogContent>
                    {formData && (
                        <>
                            <TextField
                                label="Name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Location"
                                name="location"
                                value={formData.location || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="State"
                                name="state"
                                value={formData.state || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Country"
                                name="country"
                                value={formData.country || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Website"
                                name="website"
                                value={formData.website || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            {/* Add more form fields for other gym properties */}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => saveGymData(handleClose)}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditGymDetails;
