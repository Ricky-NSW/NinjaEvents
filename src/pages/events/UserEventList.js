import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import EventCard from '../../components/events/EventCard';
import { useDataLayer } from '../../components/data/DataLayer';

function UserEventList() {
    const { currentUser, events } = useDataLayer();
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        if (currentUser && currentUser.managedGyms) {
            const userManagedGymIds = currentUser.managedGyms.map((gym) => gym.id);
            const filteredEventsData = events.filter(event => userManagedGymIds.includes(event.gym.id));
            setFilteredEvents(filteredEventsData);

            console.log('AFFECT filteredEventsData',filteredEventsData)
            console.log('userManagedGymIds:', userManagedGymIds);
            console.log('currentUser:', currentUser.managedGyms);
            console.log('events:', events);
        }



    }, [currentUser, events]);


    if (!currentUser) {
        return <div>Loading...</div>;
    }

    // console.log('filteredEvents',filteredEvents)
    // console.log('currentUser.managedGyms',currentUser.managedGyms)

    console.log('filteredEvents:', filteredEvents);
    if (filteredEvents && filteredEvents.length > 0) {
        console.log('filteredEvents has data');
    } else {
        console.log('filteredEvents is empty or not an array');
    }

    filteredEvents.forEach(event => {
        console.log('event.id:', event.id);
        console.log('event.gym:', event.gym);
    });



    return (
        <>
            {currentUser?.managedGyms ? (
                <div>
                    <h2>Events you manage</h2>
                    <Typography variant="p">Click on an event to edit it.</Typography>

                    <Stack direction="column" spacing={2}>
                        {filteredEvents.map((event) => (
                            <EventCard id={event.id} event={event} />
                        ))}
                    </Stack>
                </div>
            ) : (
                <Typography
                    variant="p"
                    sx={{ color: "text.secondary" }}
                >
                    You need 1 or more gyms to use this feature.
                </Typography>
            )}
        </>
    );
}

export default UserEventList;
