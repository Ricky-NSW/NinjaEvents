import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDataLayer } from '../data/DataLayer';
import EventCard from './EventCard';
import Autocomplete from '@mui/lab/Autocomplete';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const EventsList = ({ events = [], filterDisabled }) => {
    const { gyms, currentUser } = useDataLayer();
    const [gymSearch, setGymSearch] = useState('');
    const [selectedGym, setSelectedGym] = useState(null);
    const [ageSearch, setAgeSearch] = useState('');
    const [suburbSearch, setSuburbSearch] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        if (events.length > 0) {
            setFilteredEvents(
                events
                    .filter((event) => {
                        // Find the gym only once
                        const eventGym = gyms.find(gym => gym.id === event.gym?.id);

                        // Filter by gym name
                        const gymMatch = selectedGym
                            ? eventGym && eventGym.name.toLowerCase().includes(selectedGym.name.toLowerCase())
                            : true;



                        // Filter by event age
                        const ageMatch = ageSearch
                            ? event.age.toString() === ageSearch
                            : true;

                        // Filter by suburb
                        const suburbMatch = suburbSearch
                            ? eventGym && eventGym.address.split(',')[1]?.trim().toLowerCase() === suburbSearch.toLowerCase()
                            : true;

                        // Return true if all conditions are met
                        return gymMatch && ageMatch && suburbMatch;
                    })
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
            );
        }
    }, [selectedGym, ageSearch, suburbSearch, events, gyms]);




    // Get gyms that are assigned to an event
    const eventGyms = useMemo(() => {
        const uniqueGymSet = new Set();

        const uniqueGyms = events
            .map((event) => {
                const gym = gyms.find(gym => gym.id === event.gym?.id);
                if (gym && !uniqueGymSet.has(gym.id)) {
                    uniqueGymSet.add(gym.id);
                    return { key: gym.id, name: gym.name };
                }
                return null;
            })
            .filter(Boolean);

        return uniqueGyms;
    }, [events, gyms]);




    // Get ages from events
    const eventAges = useMemo(() => Array.from(new Set(events.map(event => event.age.toString()))), [events]);
    // Get suburbs from gyms
    // sort alphabetically
    const eventSuburbs = useMemo(() => Array.from(new Set(gyms.map(gym => gym.address.split(',')[1]?.trim()))).sort(), [gyms]);
    // const eventSuburbs = useMemo(() => Array.from(new Set(gyms.map(gym => gym.address.split(',')[1]?.trim()))), [gyms]);

    return (
        <>
            {!filterDisabled && (
                <>
                    <Autocomplete
                        options={eventGyms}
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) => option.key === value.key}
                        value={selectedGym}
                        onChange={(event, newValue) => setSelectedGym(newValue)}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search gyms"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        )}
                    />

                    <Autocomplete
                        options={eventSuburbs}
                        getOptionLabel={(option) => option}
                        value={suburbSearch}
                        onChange={(event, newValue) => setSuburbSearch(newValue || '')}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search suburb"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        )}
                    />

                    <Autocomplete
                        options={eventAges}
                        getOptionLabel={(option) => option}
                        value={ageSearch}
                        onChange={(event, newValue) => setAgeSearch(newValue || '')}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search age"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        )}
                    />
                </>
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

