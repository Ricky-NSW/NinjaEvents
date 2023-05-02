import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const EditGymDetails = ({ onUpdate }) => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [gym, setGym] = useState(null);
    const [updatedGym, setUpdatedGym] = useState(null);

    useEffect(() => {
        const fetchGym = async () => {
            const gymRef = doc(getFirestore(), 'gyms', id);
            const gymDoc = await getDoc(gymRef);
            if (gymDoc.exists()) {
                setGym({ id, ...gymDoc.data() });
            }
        };

        fetchGym();
    }, [id]);

    const handleClickOpen = () => {
        setOpen(true);
        if (gym) setUpdatedGym({ ...gym });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (gym && updatedGym) {
            try {
                // Save the updated gym data to Firestore
                const gymRef = doc(getFirestore(), 'gyms', gym.id);
                await updateDoc(gymRef, { name: updatedGym.name });

                // Call the onUpdate callback to update the parent component's state
                onUpdate();
                handleClose();
            } catch (error) {
                console.error('Error updating gym:', error);
            }
        }
    };

    if (!gym) {
        return <div>Loading...</div>;
    }




    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                Edit Gym Details
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Gym Details</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Gym Name"
                        type="text"
                        fullWidth
                        defaultValue={gym.name}
                        onChange={(e) => setUpdatedGym({ ...updatedGym, name: e.target.value })}
                    />

                    {/* Add more TextField components for other gym properties here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditGymDetails;
