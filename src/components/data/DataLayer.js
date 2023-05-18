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
export const useDataLayerValue = () => useContext(DataLayerContext);

// Custom hook to easily use the data layer context
// This will be used by components to access the data layer.
export const useDataLayer = () => {
    return useContext(DataLayerContext);
};

// DataLayer component that provides state and actions to all child components.
export function DataLayer({ children }) { // Change from default export to named export
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
    useEffect(() => {
        const unsubscribeGyms = fetchGyms();

        return () => {
            unsubscribeGyms();
        };
    }, []);

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
            //This line gets all the data from the document and adds it to the gymsData array.
            // NOTE: The ID of the document isn't considered part of the data; it's metadata about the document. hence why we are getting it seperately
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

    // Function to fetch a gym by slug.
    const getGymBySlug = (gymSlug) => {
        // Use Array.find() to find the gym with the given slug.
        const gym = gyms.find((g) => g.slug === gymSlug);
        return gym || { error: 'Gym not found' };
    };


        // Similar functions for fetching leagues, events, updating users and events etc...

    const isUserSubscribedToGym = (gymSlug) => {
        if (!currentUser) {
            return false;
        }

        const subscribedGyms = currentUser.subscribedGyms || [];
        return subscribedGyms.some(g => g.slug === gymSlug);
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

    const getLeagueById = (leagueId) => {
        const league = leagues.find((l) => l.id === leagueId);
        return league;
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
        getGymBySlug,  // changed to getGymBySlug
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

