import React from 'react';
import { useDataLayer } from '../../components/data/DataLayer';  // Import the hook

//Firebase
// import { db } from '../../FirebaseSetup'; // No longer needed

//MUI
import EventsList from "../../components/events/EventsList";
import GoogleMapArray from '../../components/api/GoogleMapArray';
import Loading from '../../components/data/Loading';

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

function EventsPage() {
    const { events, isAnyDataLoading } = useDataLayer();  // Get events and isAnyDataLoading from the DataLayer

    if (isAnyDataLoading) {
        console.log('Loading events page...', events)

        return (<Loading />); // Or your preferred loading UI
    }

    // console.log('events page:', events)

    return (
        <div>
            <h1>Events</h1>
            <EventsList events={events} />

            <h2>MAP</h2>
            <GoogleMapArray markers={events} nestedGym />
        </div>
    );
}

export default EventsPage;
