import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDataLayer } from '../data/DataLayer';
import EventCard from './EventCard';
import Autocomplete from '@mui/lab/Autocomplete';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const EventsList = ({ events = [], noFilter }) => {
    const { gyms, currentUser } = useDataLayer();
    const [search, setSearch] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        if (events.length > 0) {
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

    console.log('gym', gyms)

    return (
        <>
            {!noFilter && (
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
            )}
            <Container maxWidth={false} disableGutters>
                <Box>
                    <Grid container spacing={2} justifyContent="center">
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                gyms={gyms}
                                userType={currentUser?.userType}
                            />
                        ))}
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default EventsList;
