
//NOTES
//Now, in your other components, you can import the DataLayer component and wrap your components with it. You can also use the useDataLayer custom hook to access the data.
//And here's an example of how to use the useDataLayer custom hook in SomeComponent.js:
// import React from 'react';
// import { useDataLayer } from './DataLayer';
//
// const SomeComponent = () => {
//     const { user, gyms, leagues, events } = useDataLayer();
//
//     // Your component logic and rendering here
// };
//
// export default SomeComponent;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../FirebaseSetup';

// Creating a data layer context
export const DataLayerContext = createContext();

// Custom hook to easily use the data layer context
export const useDataLayer = () => {
    return useContext(DataLayerContext);
};

const DataLayer = ({ children }) => {
    const [user, setUser] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [events, setEvents] = useState([]);

    // Fetching and listening to real-time updates from firestore
    useEffect(() => {
        const unsubscribeUsers = db.collection('users').onSnapshot((snapshot) => {
            setUser(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });

        const unsubscribeGyms = db.collection('gyms').onSnapshot((snapshot) => {
            setGyms(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });

        const unsubscribeLeagues = db.collection('leagues').onSnapshot((snapshot) => {
            setLeagues(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });

        const unsubscribeEvents = db.collection('events').onSnapshot((snapshot) => {
            setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });

        // Cleanup function to unsubscribe from snapshot listeners when the component is unmounted
        return () => {
            unsubscribeUsers();
            unsubscribeGyms();
            unsubscribeLeagues();
            unsubscribeEvents();
        };
    }, []);

    const value = {
        user,
        gyms,
        leagues,
        events,
    };

    return (
        <DataLayerContext.Provider value={value}>
            {children}
        </DataLayerContext.Provider>
    );
};

export default DataLayer;

