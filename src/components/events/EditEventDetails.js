import React, { useState, useEffect } from 'react';
import {
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Autocomplete,
    MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useDataLayer } from '../data/DataLayer';


const EditEventDetails = ({ event, gym, leagues }) => {
    const [open, setOpen] = useState(false); // Add this state
    const [updatedEvent, setUpdatedEvent] = useState(event);
    const [searchBox, setSearchBox] = useState(null);
    const { updateEvent, gyms, league } = useDataLayer();
    const [selectedGym, setSelectedGym] = useState(event.gym || null);
    const [selectedLeague, setSelectedLeague] = useState(null);

    if (!event) {
        return null; // or show a loading indicator or error message
    }

    const toggleModal = () => {
        setOpen(!open);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEvent({
            ...updatedEvent,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        // Handle saving changes for the event
        try {
            await updateEvent(event.id, { ...updatedEvent, gym: selectedGym, league: selectedLeague });
            console.log('Event updated successfully:', updatedEvent);
        } catch (error) {
            console.error('Error updating event:', error);
        }
        toggleModal();
    };




    return (
        <>
        <Button color="primary" onClick={toggleModal}>
            Edit Event Details
        </Button>
        <Dialog
            open={open}
            onClose={toggleModal}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Edit Event Details</DialogTitle>
            <DialogContent>
                <TextField
                    name="title"
                    label="Title"
                    value={updatedEvent.title || ''}
                    onChange={handleInputChange}
                />
                {/*<TextField*/}
                {/*    name="gymName"*/}
                {/*    label="Event Location"*/}
                {/*    value={updatedEvent.gym ? updatedEvent.gym.name : ''}*/}
                {/*    onChange={handleInputChange}*/}
                {/*/>*/}
                <TextField
                    name="description"
                    label="Description"
                    value={updatedEvent.description || ''}
                    onChange={handleInputChange}
                />
                <TextField
                    name="price"
                    label="Price"
                    value={updatedEvent.price || ''}
                    onChange={handleInputChange}
                />
                <TextField
                    name="age"
                    label="Age"
                    value={updatedEvent.age || ''}
                    onChange={handleInputChange}
                />
                <DialogContent>
                    {/* ... other TextField components ... */}
                    <TextField
                        name="age"
                        label="Age"
                        value={updatedEvent.age || ''}
                        onChange={handleInputChange}
                    />
                    {gyms.length === 1 ? (
                        <TextField
                            label="Gym Address"
                            variant="outlined"
                            value={gyms[0].name}
                            margin="normal"
                            required
                            fullWidth
                            style={{ display: "none" }}
                        />
                    ) : gyms.length > 1 ? (
                        <TextField
                            select
                            label="Select Gym"
                            value={selectedGym.id} // Change this line
                            onChange={(e) => {
                                const gym = gyms.find((g) => g.id === e.target.value);
                                setSelectedGym(gym);
                            }}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                        >
                            //TODO: Make it so that only the gyms owned by the user are shown - unless its admin then show all the gyms
                            {gyms.map((gym) => (
                                <MenuItem key={gym.id} value={gym.id}>
                                    {gym.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    ) : gyms.length === 0 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/create-gym"
                        >
                            You need to add your Gym before you can create an event.
                        </Button>
                    ) : (
                        <div style={{ display: "none" }} />
                    )}
                </DialogContent>

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

                {/*Assign a gym - get the list of gyms from the user*/}
                {/*<Autocomplete*/}
                {/*    options={leagues}*/}
                {/*    getOptionLabel={(option) => option.name}*/}
                {/*    value={updatedEvent.league || null}*/}
                {/*    onChange={(event, newValue) =>*/}
                {/*        setUpdatedEvent((prev) => ({*/}
                {/*            ...prev,*/}
                {/*            league: newValue ? newValue : null*/}
                {/*        }))*/}
                {/*    }*/}
                {/*    fullWidth*/}
                {/*    data-lpignore="true"*/}
                {/*    renderInput={(params) => (*/}
                {/*        <TextField*/}
                {/*            {...params}*/}
                {/*            label="League"*/}
                {/*            variant="outlined"*/}
                {/*            value={updatedEvent.league ? updatedEvent.league.name : ''}*/}
                {/*            margin="normal"*/}
                {/*            fullWidth*/}
                {/*        />*/}
                {/*    )}*/}
                {/*/>*/}

                {/*//Assign a league*/}
                {/*<Autocomplete*/}
                {/*    options={leagues}*/}
                {/*    getOptionLabel={(option) => option.name}*/}
                {/*    value={updatedEvent.league || null}*/}
                {/*    onChange={(event, newValue) =>*/}
                {/*        setUpdatedEvent((prev) => ({*/}
                {/*            ...prev,*/}
                {/*            league: newValue ? newValue : null*/}
                {/*        }))*/}
                {/*    }*/}
                {/*    fullWidth*/}
                {/*    data-lpignore="true"*/}
                {/*    renderInput={(params) => (*/}
                {/*        <TextField*/}
                {/*            {...params}*/}
                {/*            label="League"*/}
                {/*            variant="outlined"*/}
                {/*            value={updatedEvent.league ? updatedEvent.league.name : 'null'}*/}
                {/*            margin="normal"*/}
                {/*            fullWidth*/}
                {/*        />*/}
                {/*    )}*/}
                {/*/>*/}
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleModal} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSaveChanges} color="primary">
                    Save changes
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default EditEventDetails;
