//DataLayer.js

//I am using AuthProvider to handle authentication and user state
// Importing necessary hooks and services from react, firebase and local files.
import React, { createContext, useContext, useReducer, useEffect, useState, useMemo, useCallback } from 'react';

import { db } from '../../FirebaseSetup';
import { getFirestore, doc, onSnapshot, updateDoc, collection, query, getDocs, addDoc } from 'firebase/firestore';
import AuthContext from '../../contexts/AuthContext'; // Update the path to your actual file

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
    const [users, setUsers] = useState([]);
    // const [currentUser, setCurrentUser] = useState(null);
    const { currentUser, setCurrentUser } = useContext(AuthContext);

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
        const unsubscribeUsers = fetchUsers();

        return () => {
            unsubscribeGyms();
            unsubscribeLeagues();
            unsubscribeEvents();
            unsubscribeUsers();
        };
    }, []);


    const fetchGyms = () => {
        setIsLoading(true);
        const ref = collection(db, 'gyms');
        const q = query(ref);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                // Store the document id in the data
                data.push({ ...doc.data(), id: doc.id });
            });
            // Sort gyms alphabetically by name
            data.sort((a, b) => a.name.localeCompare(b.name));
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
            // Sort leagues alphabetically by name
            data.sort((a, b) => a.name.localeCompare(b.name));
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

    // get users
    const fetchUsers = () => {
        setIsLoading(true);
        const ref = collection(db, 'users');
        const q = query(ref);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setUsers(data);
            setIsLoading(false);
        });

        return unsubscribe;
    };


    //TODO: Can i delete this?
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




    // In order to prevent unnecessary re-renders, you can memoize your getGymBySlug function using the useCallback hook:
    //TODO  loook at applying this to all functions
    const getGymBySlug = useCallback((gymSlug) => {
        const gym = gyms.find((g) => g.slug === gymSlug);
        return gym || { error: 'Gym slug not found in datalayer' };
    }, [gyms]);

    const getGymById = (gymId) => {
        const gym = gyms.find((g) => g.id === gymId);
        return gym || { error: 'Gym id not found in datalayer' };
    };

    const getLeagueBySlug = (leagueSlug) => {
        const league = leagues.find((l) => l.slug === leagueSlug);
        return league || { error: 'League not found' };
    };

    const getLeagueById = (leagueId) => {
        const league = leagues.find((l) => l.id === leagueId);
        return league;
    };

    const getUserById = (userId) => {
        if (!userId) {
            console.error("No userId provided");
            return null;
        }

        if (!users || users.length === 0) {
            console.error("Users array is empty or not loaded yet");
            return null;
        }

        const user = users.find((u) => u.id === userId);
        if (!user) {
            console.error(`User with userId ${userId} not found`);
        }

        return user;
    };

    const getEventById = useCallback((eventId) => {
        if (!events.length) {
            return null; // Or a loading status
        }
        const event = events.find((e) => e.id === eventId);
        return event;
    }, [events]);


    // const fetchEventsForLeague = (leagueId) => {
    //     console.log('League ID:', leagueId);
    //     console.log('All Events:', events);
    //     const leagueEvents = events.filter(event => {
    //         console.log('Checking event:', event);
    //         return event.leagueId === leagueId;
    //     });
    //     console.log('Fetched events for league:', leagueEvents);
    //     return leagueEvents;
    // };

    //If I refactor league data in the event to only contain the league id, I might need to reconfigure this function.
    const fetchEventsForLeague = (leagueId) => {
        const leagueEvents = events.filter(event => event.league && event.league.id === leagueId);
        console.log('Fetched events for league:', leagueEvents);
        return leagueEvents;
    };



    const checkUserSubscriptionToLeague = (leagueId) => {
        if (!currentUser) {
            return false;
        }
        const subscribedLeagues = currentUser.subscribedLeagues || [];
        return subscribedLeagues.includes(leagueId);
    };

    const updateUserSubscriptionToLeague = async (leagueId, currentUser) => {
        if (!currentUser) {
            console.error("User is not logged in");
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

    //this needs to be after the get eventbyId function
    // this needs to be after the get eventbyId function
    const fetchUserResults = useCallback(async () => {
        if (currentUser) {
            setIsLoading(true);
            const userRef = doc(db, 'users', currentUser.uid);
            const resultsRef = collection(userRef, 'results');

            const snapshot = await getDocs(resultsRef);

            const results = await Promise.all(snapshot.docs.map(async (doc) => {
                const result = doc.data();
                let eventTitle = 'N/A';
                if (result.eventId) {
                    const event = getEventById(result.eventId);
                    if (event) {
                        eventTitle = event.title;
                    } else {
                        console.error(`No event found with id: ${result.eventId}`);
                    }
                }
                return { ...result, id: doc.id, eventTitle: eventTitle };
            }));

            setIsLoading(false);
            console.log('Results:', results);

            return results;
        }
    }, [currentUser, getEventById, db]); // Remember to add all dependencies

    useEffect(() => {
        fetchUserResults();
    }, [fetchUserResults]); // Add fetchUserResults as dependency

    // eslint-disable-next-line react-hooks/exhaustive-deps


    const value = {
        state,
        dispatch,
        isLoading,
        currentUser: memoizedCurrentUser,
        isUserSubscribedToGym,
        updateUserData,
        updateUserDetailsInDB,
        getGymBySlug,
        getGymById,
        updateGymBannerUrl,
        gyms,
        leagues,
        events,
        users,
        fetchLeagues,
        getLeagueById,
        getLeagueBySlug,
        getEventById,
        getUserById,
        addEvent,
        updateEvent,
        checkUserSubscriptionToLeague,
        updateUserSubscriptionToLeague,
        fetchEventsForLeague,
        fetchUserResults,
    };

    return (
        <DataLayerContext.Provider value={value}>
            {children}
        </DataLayerContext.Provider>
    );
};
