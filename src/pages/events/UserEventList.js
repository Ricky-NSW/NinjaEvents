import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import MenuItemIcon from "@mui/material/ListItemIcon";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import GymCard from '../../components/gyms/GymCard';
import { useDataLayer } from '../../components/data/DataLayer'; // Import useDataLayer
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function UserEventList() {
    const { currentUser, events } = useDataLayer(); // Get currentUser and events from the data layer

    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        if (currentUser && currentUser.managedGyms && events) {
            const userManagedGymIds = currentUser.managedGyms.map((gym) => gym.id);
            const matchingEvents = events.filter((event) => userManagedGymIds.includes(event.gym.id));
            setFilteredEvents(matchingEvents);
        }
    }, [currentUser, events]);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    console.log('User details on managed gyms', currentUser);

    return (
        <>
            {currentUser.managedGyms ? (
                <div>
                    <h2>Events you manage</h2>
                    <Typography variant="p">Click on an event to edit it.</Typography>

                    <Stack direction="column" spacing={2}>
                        {filteredEvents.map((event) => (
                            <Link key={event.id} to={`/events/${event.id}`}>
                                <GymCard id={event.id} gym={event.gym} />
                            </Link>
                        ))}
                    </Stack>
                </div>
            ) : (
                <Typography
                    variant="p"
                    sx={{ color: "text.secondary" }}
                >
                    You need 2 or more gyms to use this feature.
                </Typography>
            )}
        </>
    );
}

export default UserEventList;
