//DataLayer.js

// Importing necessary hooks and services from react, firebase and local files.
import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from 'react';
import { db } from '../../FirebaseSetup';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc, collection, query, addDoc } from 'firebase/firestore';
import reducer, { initialState } from './reducer';

// Creating a data layer context
// This will allow child components to subscribe to data changes without prop drilling.
export const DataLayerContext = createContext();

// Custom hook to easily use the data layer context
// This will be used by components to access the data layer.
export const useDataLayer = () => {
    return useContext(DataLayerContext);
};

// DataLayer component that provides state and actions to all child components.
const DataLayer = ({ children }) => {
    // Initializing necessary state variables.
    const [gyms, setGyms] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [events, setEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    // Memoizing currentUser state to avoid unnecessary re-renders.
    const memoizedCurrentUser = useMemo(() => currentUser, [currentUser]);
    const [isLoading, setIsLoading] = useState(true);
    // Initializing state and dispatch from useReducer hook with initialState and reducer.
    const [state, dispatch] = useReducer(reducer, initialState)

    // Fetch gyms from Firestore and set them in state.
    const fetchGyms = () => {
        // Indicate that data fetching has started.
        setIsLoading(true);
        // Setting up Firestore query.
        const gymsRef = collection(db, 'gyms');
        const gymsQuery = query(gymsRef);
        // Subscribe to real-time updates from Firestore.
        const unsubscribeGyms = onSnapshot(gymsQuery, (querySnapshot) => {
            // Convert querySnapshot to array of gyms.
            const gymsData = [];
            querySnapshot.forEach((doc) => {
                gymsData.push({ ...doc.data(), id: doc.id });
            });
            // Set gymsData in state and indicate that data fetching has ended.
            setGyms(gymsData);
            setIsLoading(false);
        });

        // Return the unsubscribe function to be called on component unmount.
        return unsubscribeGyms;
    };

    // Function to fetch a gym by ID.
    const getGymById = (gymId) => {
        // Use Array.find() to find the gym with the given ID.
        const gym = gyms.find((g) => g.id === gymId);
        return gym;
    };

    // Similar functions for fetching leagues, events, updating users and events etc...
    const fetchLeagues = () => {
        const leaguesRef = collection(db, 'leagues');
        const leaguesQuery = query(leaguesRef);
        const unsubscribeLeagues = onSnapshot(leaguesQuery, (querySnapshot) => {
            const leaguesData = [];
            querySnapshot.forEach((doc) => {
                leaguesData.push({ ...doc.data(), id: doc.id });
            });
            setLeagues(leaguesData);
            // console.log("Fetched leagues in datalayer:", leaguesData); // Add this line
        });

        return unsubscribeLeagues;
    };

    const getLeagueById = (leagueId) => {
        const league = leagues.find((l) => l.id === leagueId);
        return league;
    };

    const fetchEvents = () => {
        const eventsRef = collection(db, 'events');
        const eventsQuery = query(eventsRef);
        const unsubscribeEvents = onSnapshot(eventsQuery, (querySnapshot) => {
            const eventsData = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ ...doc.data(), id: doc.id });
            });
            setEvents(eventsData);
        });

        return unsubscribeEvents;
    };

    const getEventById = (eventId) => {
        const event = events.find((e) => e.id === eventId);
        return event;
    };

    const addEvent = async (eventData) => {
        const eventRef = collection(db, 'events');
        const docRef = await addDoc(eventRef, eventData);
        return docRef.id;
    };

    const updateEvent = async (eventId, eventData) => {
        const eventDocRef = doc(db, 'events', eventId);

        try {
            await updateDoc(eventDocRef, eventData);
            console.log("Event updated successfully");
        } catch (error) {
            console.error("Error updating event: ", error);
            throw error;
        }
    };




    const updateUserData = async (userId, updatedData) => {
        if (currentUser && currentUser.id === userId) {
            setCurrentUser({ ...currentUser, ...updatedData });
        }
    };

    const updateUserDetailsInDB = async (userId, userDetails) => {
        // console.log("updateUserDetailsInDB called with:", userId, userDetails); // Add this line

        const userDocRef = doc(db, 'users', userId);

        // console.log("userDocRef:", userDocRef); // Add this line

        try {
            await updateDoc(userDocRef, userDetails);
            console.log("User details updated successfully"); // Add this line
        } catch (error) {
            console.error("Error updating user details: ", error);
            throw error;
        }
    };

    const isUserSubscribedToGym = (gymId) => {
        if (!currentUser) {
            return false;
        }

        const subscribedGyms = currentUser.subscribedGyms || [];
        return subscribedGyms.some(g => g.id === gymId);
    };


    // This useEffect hook runs once on component mount and sets up Firestore subscriptions.
    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();
        // Fetch initial data and set up Firestore subscriptions.
        const unsubscribeGyms = fetchGyms();
        const unsubscribeLeagues = fetchLeagues();
        const unsubscribeEvents = fetchEvents();

        // Set up authentication state observer.
        const unsubscribeAuth = onAuthStateChanged(auth, (loggedInUser) => {
            if (loggedInUser) {
                // User is logged in.
                const userDocRef = doc(db, 'users', loggedInUser.uid);
// Set up Firestore subscription for the logged in user.
                const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        // If the user document exists in Firestore, update currentUser state.
                        setCurrentUser({ ...docSnapshot.data(), id: loggedInUser.uid });
                    } else {
                        console.error('User not found in Firestore');
                    }
                });

                // Clean up Firestore subscription when user logs out.
                return () => {
                    unsubscribeUserDoc();
                };
            } else {
                // User is logged out, reset currentUser state.
                setCurrentUser(null);
            }
        });

        // Clean up all Firestore subscriptions when component unmounts.
        return () => {
            unsubscribeAuth();
            unsubscribeGyms();
            unsubscribeLeagues();
            unsubscribeEvents();
        };
    }, []);

    // Preparing the value to be provided to child components.
    const value = {
        state,
        dispatch,
        isLoading,
        currentUser: memoizedCurrentUser,
        isUserSubscribedToGym,
        gyms,
        leagues,
        events,
        updateUserData,
        updateUserDetailsInDB,
        getGymById,
        getLeagueById,
        getEventById,
        addEvent,
        updateEvent,
    };

    // Using the context provider to pass the value to child components.
    return (
        <DataLayerContext.Provider value={value}>
            {children}
        </DataLayerContext.Provider>
    );
};

// Exporting the DataLayer component and a custom hook for accessing the data layer.
export default DataLayer;
export const useDataLayerValue = () => useContext(DataLayerContext);
