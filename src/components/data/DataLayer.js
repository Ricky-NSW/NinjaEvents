// DataLayer.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../FirebaseSetup';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../FirebaseSetup';
import { doc, onSnapshot } from 'firebase/firestore';

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
    const [currentUser, setCurrentUser] = useState(null);

    // Fetching and listening to real-time updates from firestore
    useEffect(() => {
        let unsubscribeUserDoc; // Declare unsubscribeUserDoc here

        const unsubscribeAuth = onAuthStateChanged(auth, (loggedInUser) => {
            if (loggedInUser) {
                // User is signed in
                const userDocRef = doc(db, 'users', loggedInUser.uid);
                unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => { // Assign the unsubscribe function here
                    if (docSnapshot.exists()) {
                        setCurrentUser({ ...docSnapshot.data(), id: loggedInUser.uid });
                    } else {
                        console.error('User not found in Firestore');
                    }
                });

                // No need to return an unsubscribe function here anymore
            } else {
                // User is signed out
                setCurrentUser(null);
            }
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
            unsubscribeAuth();
            if (unsubscribeUserDoc) { // Make sure to only unsubscribe if the function has been assigned
                unsubscribeUserDoc();
            }
            unsubscribeGyms();
            unsubscribeLeagues();
            unsubscribeEvents();
        };
    }, []);



    const value = {
        currentUser,
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

