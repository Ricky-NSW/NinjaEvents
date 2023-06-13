import React, { useContext, useState, useEffect, useMemo } from 'react';
import AuthContext from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useDataLayer } from '../data/DataLayer';
import EventCard from './EventCard';
import Autocomplete from '@mui/lab/Autocomplete';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Loading from '../data/Loading';

const EventsList = ({ events = [], filterDisabled }) => {
    const { gyms, loading } = useDataLayer();
    //TODO check authcontext implementation
    const { currentUser } = useContext(AuthContext);
    const [gymSearch, setGymSearch] = useState('');
    const [selectedGym, setSelectedGym] = useState(null);
    const [ageSearch, setAgeSearch] = useState('');
    const [stateSearch, setStateSearch] = useState('');
    const [countrySearch, setCountrySearch] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);

    console.log('gymn on eventlist component', gyms)

    const dataLayer = useDataLayer();
    console.log('dataLayer', dataLayer);


    useEffect(() => {
        if (events.length > 0) {
            setFilteredEvents(
                events
                    .filter((event) => {
                        // Find the gym only once
                        const eventGym = gyms.find(gym => gym.id === (event.gym ? event.gym.id : event.gymId));
                        //TODO: FIX this
                        // const eventGym = gyms.find(gym => (gym.id || gym.gymId) === (event.gym ? event.gym.id : event.gymId));

                        // Filter by gym name
                        const gymMatch = selectedGym
                            ? eventGym && eventGym.name.toLowerCase().includes(selectedGym.name.toLowerCase())
                            : true;

                        // Filter by event age
                        const ageMatch = ageSearch
                            ? event.age.toString() === ageSearch
                            : true;

                        // Filter by state
                        const stateMatch = stateSearch
                            ? eventGym && eventGym.state.toLowerCase() === stateSearch.toLowerCase()
                            : true;

                        // Filter by country
                        const countryMatch = countrySearch
                            ? eventGym && eventGym.country.toLowerCase() === countrySearch.toLowerCase()
                            : true;

                        // Return true if all conditions are met
                        return gymMatch && ageMatch && stateMatch && countryMatch;
                    })
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
            );
        }
    }, [selectedGym, ageSearch, stateSearch, countrySearch, events, gyms]);

    // Get gyms that are assigned to an event
    const eventGyms = useMemo(() => {
        const uniqueGymSet = new Set();
        if (!gyms) return []; // Return empty array if gyms is not loaded yet

        const uniqueGyms = events
            .map((event) => {
                const gym = gyms.find(gym => gym.id === (event.gym ? event.gym.id : event.gymId));
                // const gym = gyms.find(gym => gym.id === event.gym?.id);
                if (gym && !uniqueGymSet.has(gym.id)) {
                    uniqueGymSet.add(gym.id);
                    return { id: gym.id, name: gym.name };
                }
                return null;
            })
            .filter(Boolean);

        return uniqueGyms;
    }, [events, gyms]);

    // Get ages from events
    const eventAges = useMemo(() => Array.from(new Set(events.map(event => event.age.toString()))), [events]);

    // Get states from gyms
    const eventStates = useMemo(() => {
        if (gyms) {
            return Array.from(new Set(gyms.map(gym => gym.state))).sort();
        }
        return [];
    }, [gyms]);

    const eventCountries = useMemo(() => {
        if (gyms) {
            return Array.from(new Set(gyms.map(gym => gym.country))).sort();
        }
        return [];
    }, [gyms]);

    if (loading) {
        return <Loading />; // or some other placeholder content
    }


    return (
        <>
            {!filterDisabled && (
                <>
                    <Autocomplete
                        options={eventStates}
                        getOptionLabel={(option) => option}
                        value={stateSearch}
                        onChange={(event, newValue) => setStateSearch(newValue || '')}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search state"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        )}
                    />

                    <Autocomplete
                        options={eventCountries}
                        getOptionLabel={(option) => option}
                        value={countrySearch}
                        onChange={(event, newValue) => setCountrySearch(newValue || '')}
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search country"
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
            <Box
                sx={{
                    display: 'grid',
                    columnGap: 3,
                    rowGap: 3,
                    gridTemplateColumns: 'repeat(2, 1fr)',
                }}
            >
                {filteredEvents.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        gyms={gyms}
                        userType={currentUser?.userType}
                    />
                ))}
            </Box>
        </>
    );
};

export default EventsList;

