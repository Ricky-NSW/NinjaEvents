import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { db } from '../../FirebaseSetup';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc, collection, query, addDoc } from 'firebase/firestore';

// Creating a data layer context
export const DataLayerContext = createContext();

// Custom hook to easily use the data layer context
export const useDataLayer = () => {
    return useContext(DataLayerContext);
};

const DataLayer = ({ children }) => {
    const [gyms, setGyms] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [events, setEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const memoizedCurrentUser = useMemo(() => currentUser, [currentUser]);

    const fetchGyms = () => {
        const gymsRef = collection(db, 'gyms');
        const gymsQuery = query(gymsRef);
        const unsubscribeGyms = onSnapshot(gymsQuery, (querySnapshot) => {
            const gymsData = [];
            querySnapshot.forEach((doc) => {
                gymsData.push({ ...doc.data(), id: doc.id });
            });
            setGyms(gymsData);
            // console.log("Fetched gyms in datalayer:", gymsData); // Add this line
        });

        return unsubscribeGyms;
    };

    //TODO: do i need this?
    const getGymById = (gymId) => {
        const gym = gyms.find((g) => g.id === gymId);
        return gym;
    };

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



    // Fetching and listening to real-time updates from firestore
    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();
        const unsubscribeGyms = fetchGyms();
        const unsubscribeLeagues = fetchLeagues();
        const unsubscribeEvents = fetchEvents();

        const unsubscribeAuth = onAuthStateChanged(auth, (loggedInUser) => {
            // console.log("loggedInUser:", loggedInUser);

            if (loggedInUser) {
                const userDocRef = doc(db, 'users', loggedInUser.uid);
                const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        // console.log("User data from Firestore:", docSnapshot.data());
                        setCurrentUser({ ...docSnapshot.data(), id: loggedInUser.uid });
                        // console.log("Fetched currentUser:", { ...docSnapshot.data(), id: loggedInUser.uid }); // Add this line
                    } else {
                        console.error('User not found in Firestore');
                    }
                });

                return () => {
                    unsubscribeUserDoc();
                };
            } else {
                setCurrentUser(null);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeGyms();
            unsubscribeLeagues();
            unsubscribeEvents();
        };
    }, []);

    const value = {
        currentUser: memoizedCurrentUser,
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


    return (
        <DataLayerContext.Provider value={value}>
            {children}
        </DataLayerContext.Provider>
    );
};

export default DataLayer;
