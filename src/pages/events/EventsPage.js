import React from 'react';
import { useDataLayer } from '../../components/data/DataLayer';  // Import the hook

//Firebase
// import { db } from '../../FirebaseSetup'; // No longer needed

//MUI
import EventsList from "../../components/events/EventsList";
import GoogleMapArray from '../../components/api/GoogleMapArray';

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
    const { events } = useDataLayer();  // Get events from the DataLayer

    // useEffect(() => {
    //     const eventsRef = db.collection('events');
    //     const unsubscribe = eventsRef.onSnapshot((snapshot) => {
    //         const eventsArray = snapshot.docs.map((doc) => ({
    //             id: doc.id,
    //             ...doc.data(),
    //         }));
    //         setEvents(eventsArray);
    //     });
    //     // Remove the event listener when the component unmounts
    //     return () => {
    //         unsubscribe();
    //     };
    // }, []);  // No longer needed to fetch events from Firestore directly

    // console.log("Events in EventsPage:", { events });

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
