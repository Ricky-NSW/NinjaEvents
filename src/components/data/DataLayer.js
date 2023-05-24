//DataLayer.js

// Importing necessary hooks and services from react, firebase and local files.
import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from 'react';
import { db } from '../../FirebaseSetup';
import { getFirestore, doc, onSnapshot, updateDoc, collection, query, getDocs, addDoc } from 'firebase/firestore';

import reducer, { initialState } from './reducer';

// Creating a data layer context
export const DataLayerContext = createContext();

// Custom hook to easily use the data layer context
export const useDataLayer = () => {
    return useContext(DataLayerContext);
};

// DataLayer component that provides state and actions to all child components.
export function DataLayer({ children }) {
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

    // Fetch data from Firestore and set them in state.
    useEffect(() => {
        const unsubscribeGyms = fetchGyms();
        const unsubscribeLeagues = fetchLeagues();
        const unsubscribeEvents = fetchEvents();

        return () => {
            unsubscribeGyms();
            unsubscribeLeagues();
            unsubscribeEvents();
        };
    }, []);

    const fetchGyms = () => {
        setIsLoading(true);
        const ref = collection(db, 'gyms');
        const q = query(ref);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setGyms(data);
            setIsLoading(false);
        });

        return unsubscribe;
    };

    const fetchLeagues = () => {
        setIsLoading(true);
        const ref = collection(db, 'leagues');
        const q = query(ref);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setLeagues(data);
            setIsLoading(false);
        });

        return unsubscribe;
    };

    const fetchEvents = () => {
        setIsLoading(true);
        const ref = collection(db, 'events');
        const q = query(ref);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setEvents(data);
            setIsLoading(false);
        });

        return unsubscribe;
    };


    const fetchDataFromFirestore = async (collectionName) => {
        const ref = collection(db, collectionName);
        const q = query(ref);
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), id: doc.id });
        });
        return data;
    };

    const updateGymBannerUrl = async (gymId, bannerUrl) => {
        const gymDocRef = doc(db, 'gyms', gymId);

        try {
            await updateDoc(gymDocRef, { bannerUrl });
            console.log("Gym banner URL updated successfully");
        } catch (error) {
            console.error("Error updating gym banner URL: ", error);
            throw error;
        }
    };


    const getGymBySlug = (gymSlug) => {
        const gym = gyms.find((g) => g.slug === gymSlug);
        return gym || { error: 'Gym not found' };
    };

    const getLeagueBySlug = (leagueSlug) => {
        const league = leagues.find((l) => l.slug === leagueSlug);
        return league || { error: 'League not found' };
    };

    const getLeagueById = (leagueId) => {
        const league = leagues.find((l) => l.id === leagueId);
        return league;
    };

    const fetchEventsForLeague = (leagueId) => {
        const leagueEvents = events.filter(event => event.leagueId === leagueId);
        return leagueEvents;
    };

    const checkUserSubscriptionToLeague = (leagueId) => {
        if (!currentUser) {
            return false;
        }
        const subscribedLeagues = currentUser.subscribedLeagues || [];
        return subscribedLeagues.includes(leagueId);
    };

    const updateUserSubscriptionToLeague = async (leagueId) => {
        if (!currentUser) {
            throw new Error("User is not logged in");
        }
        const userDocRef = doc(db, 'users', currentUser.id);
        let updatedLeagues;
        if (checkUserSubscriptionToLeague(leagueId)) {
            updatedLeagues = currentUser.subscribedLeagues.filter(id => id !== leagueId);
        } else {
            updatedLeagues = [...(currentUser.subscribedLeagues || []), leagueId];
        }
        await updateDoc(userDocRef, {subscribedLeagues: updatedLeagues});
        setCurrentUser({ ...currentUser, subscribedLeagues: updatedLeagues });
    };

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
        const userDocRef = doc(db, 'users', userId);

        try {
            await updateDoc(userDocRef, userDetails);
            console.log("User details updated successfully");
        } catch (error) {
            console.error("Error updating user details: ", error);
            throw error;
        }
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

    const value = {
        state,
        dispatch,
        isLoading,
        currentUser: memoizedCurrentUser,
        isUserSubscribedToGym,
        updateUserData,
        updateUserDetailsInDB,
        getGymBySlug,
        updateGymBannerUrl,
        gyms,
        leagues,
        events,
        fetchLeagues,
        getLeagueById,
        getLeagueBySlug,
        getEventById,
        addEvent,
        updateEvent,
        checkUserSubscriptionToLeague,
        updateUserSubscriptionToLeague,
        fetchEventsForLeague,
    };

    return (
        <DataLayerContext.Provider value={value}>
            {children}
        </DataLayerContext.Provider>
    );
};
