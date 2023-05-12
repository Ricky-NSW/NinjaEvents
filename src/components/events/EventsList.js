//TODO: make it so that you need to be logged in to click and see more event details, hide the 'learn more' button - also add something to the event details page so that not logged in users cant see the page
//TODO: sort events by date - most recent first
import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

//firebase
import { db, auth } from '../../FirebaseSetup';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useDataLayer } from '../data/DataLayer'; // import useDataLayer hook
import EventCard from './EventCard';
//MUI

import Button from "@mui/material/Button";
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GlobalStyles } from '@mui/material';

//Search
import Autocomplete from '@mui/lab/Autocomplete';


//style
import styled from 'styled-components';

// TODO: make it so that only gym owners can create events

const EventsList = ({ events = [], noFilter }) => {  // set a default value of an empty array to events
    const dataLayer = useDataLayer();  // use the hook here
    const { getGymById, currentUser } = dataLayer; // destructure getGymById and currentUser from dataLayer
    const [search, setSearch] = useState(''); // Add this state
    const [filteredEvents, setFilteredEvents] = useState([]); // initialize with an empty array
    const userType = currentUser ? currentUser.userType : null;

    useEffect(() => {
        if (events.length > 0) { // check if events is not empty
            setFilteredEvents(
                events
                    .filter((event) =>
                        event.title.toLowerCase().includes(search.toLowerCase())
                    )
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
            );
        }
    }, [search, events]);



    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleDelete = async (id) => {
        // const docRef = doc(db, 'events', id);
        // await deleteDoc(docRef);
    };


        // const gym = getGymById(event.gym?.id);

        return (
        <>
            {/*//Search*/}
            {noFilter ? null :
            <Autocomplete
                options={Array.from(new Set(events.map((event) => event.title)))}
                getOptionLabel={(option) => option}
                value={search}
                onChange={(event, newValue) => setSearch(newValue)}
                fullWidth
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search events"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                )}
            />
            }
            <Container maxWidth={false} disableGutters>
                <Box>
                    <Grid container spacing={2} justifyContent="center">
                        {filteredEvents && filteredEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                getGymById={getGymById}
                                userType={userType}
                            />
                        ))}
                    </Grid>
                </Box>
            </Container>
            </>
        );
    };


export default EventsList;
