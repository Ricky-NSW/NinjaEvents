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
import LoginModal from '../user/LoginModal';
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
    const [modalOpen, setModalOpen] = useState(false);
    // Existing state and hooks...
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    // console.log('gymn on eventlist component', gyms)

    const dataLayer = useDataLayer();
    console.log('dataLayer', dataLayer);


    useEffect(() => {
        if (!currentUser) {
            setModalOpen(true);
        }
    }, [currentUser]);

    const handleClose = () => {
        setModalOpen(false);
        // You can handle any additional logic on closing the modal
    };

    useEffect(() => {
        const now = new Date();
        const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
        const upcoming = sortedEvents.filter(event => new Date(event.date) >= now);
        const past = sortedEvents.filter(event => new Date(event.date) < now).reverse(); // Reverse for most recent first

        setUpcomingEvents(upcoming);
        setPastEvents(past);
    }, [events]);

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
            <LoginModal open={modalOpen} handleClose={handleClose} />

            {!filterDisabled && (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 2,
                            marginBottom: 3,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Autocomplete
                                options={eventCountries}
                                getOptionLabel={(option) => option}
                                value={countrySearch}
                                onChange={(event, newValue) => setCountrySearch(newValue || '')}
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select country"
                                        margin="normal"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Autocomplete
                                options={eventStates}
                                getOptionLabel={(option) => option}
                                value={stateSearch}
                                onChange={(event, newValue) => setStateSearch(newValue || '')}
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select state"
                                        margin="normal"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Autocomplete
                                options={eventAges}
                                getOptionLabel={(option) => option}
                                value={ageSearch}
                                onChange={(event, newValue) => setAgeSearch(newValue || '')}
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select age"
                                        margin="normal"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                </>
            )}
            <Container>
                <h2>Upcoming Events</h2>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                    }}
                >
                    {upcomingEvents.length > 0 ? (
                        <Box
                            sx={{
                                display: 'grid',
                                columnGap: 3,
                                rowGap: 3,
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                // Apply specific styling for upcoming events here
                            }}
                        >
                            {upcomingEvents.map((event) => (
                                <Box key={event.id} sx={{ flex: '1 0 calc(50% - 16px)' }}>
                                    <EventCard
                                        event={event}
                                        gyms={gyms}
                                        userType={currentUser?.userType}
                                    />
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <p>There are no upcoming events listed.</p>
                    )}
                </Box>
            </Container>

            {/* Past Events Section */}
            <Container>
                <h2>Past Events</h2>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                    }}
                >
                    {pastEvents.map((event) => (
                        <Box key={event.id} sx={{ flex: '1 0 calc(50% - 16px)' }}>
                            <EventCard
                                event={event}
                                gyms={gyms}
                                userType={currentUser?.userType}
                            />
                        </Box>
                    ))}
                </Box>
            </Container>
        </>
    );
};

export default EventsList;

