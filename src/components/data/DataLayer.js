//DataLayer.js

// Importing necessary hooks and services from react, firebase and local files.
import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from 'react';
import { db } from '../../FirebaseSetup';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc, collection, query, addDoc } from 'firebase/firestore';
import reducer, { initialState } from './reducer';

// Creating a data layer context
export const DataLayerContext = createContext();
export const useDataLayerValue = () => useContext(DataLayerContext);

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

    // Fetch gyms from Firestore and set them in state.
    useEffect(() => {
        const unsubscribeGyms = fetchGyms();

        return () => {
            unsubscribeGyms();
        };
    }, []);

    const fetchGyms = () => {
        setIsLoading(true);
        const gymsRef = collection(db, 'gyms');
        const gymsQuery = query(gymsRef);
        const unsubscribeGyms = onSnapshot(gymsQuery, (querySnapshot) => {
            const gymsData = [];
            querySnapshot.forEach((doc) => {
                gymsData.push({ ...doc.data(), id: doc.id });
            });
            setGyms(gymsData);
            setIsLoading(false);
        });
        return unsubscribeGyms;
    };

    const getGymBySlug = (gymSlug) => {
        const gym = gyms.find((g) => g.slug === gymSlug);
        return gym || { error: 'Gym not found' };
    };

    // Fetch leagues from Firestore and set them in state.
    useEffect(() => {
        const unsubscribeLeagues = fetchLeagues();

        return () => {
            unsubscribeLeagues();
        };
    }, []);

    const fetchLeagues = () => {
        setIsLoading(true);
        const leaguesRef = collection(db, 'leagues');
        const leaguesQuery = query(leaguesRef);
        const unsubscribeLeagues = onSnapshot(leaguesQuery, (querySnapshot) => {
            const leaguesData = [];
            querySnapshot.forEach((doc) => {
                leaguesData.push({ ...doc.data(), id: doc.id });
            });
            setLeagues(leaguesData);
            setIsLoading(false);
        });
        return unsubscribeLeagues;
    };

    const getLeagueBySlug = (leagueSlug) => {
        const league = leagues.find((l) => l.slug === leagueSlug);
        return league || { error: 'League not found' };
    };

    const getLeagueById = (leagueId) => {
        const league = leagues.find((l) => l.id === leagueId);
        return league;
    };

    // Fetch events from Firestore and set them in state.
    useEffect(() => {
        const unsubscribeEvents = fetchEvents();

        return () => {
            unsubscribeEvents();
        };
    }, []);

    const fetchEvents = () => {
        setIsLoading(true);
        const eventsRef = collection(db, 'events');
        const eventsQuery = query(eventsRef);
        const unsubscribeEvents = onSnapshot(eventsQuery, (querySnapshot) => {
            const eventsData = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ ...doc.data(), id: doc.id });
            });
            // console.log('datalayer eventsData line 113', eventsData); // Log the fetched data

            setEvents(eventsData);
            setIsLoading(false);
        });
        return unsubscribeEvents;
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
