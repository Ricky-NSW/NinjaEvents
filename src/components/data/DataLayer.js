import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../FirebaseSetup';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';

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

    const updateUserData = async (userId, updatedData) => {
        if (currentUser && currentUser.id === userId) {
            setCurrentUser({ ...currentUser, ...updatedData });
        }
    };

    const updateUserDetailsInDB = async (userId, userDetails) => {
        const userDocRef = doc(db, 'users', userId);

        try {
            await updateDoc(userDocRef, userDetails);
        } catch (error) {
            console.error("Error updating user details: ", error);
            throw error;
        }
    };

    // Fetching and listening to real-time updates from firestore
    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();

        const unsubscribeAuth = onAuthStateChanged(auth, (loggedInUser) => {
            console.log("loggedInUser:", loggedInUser);

            if (loggedInUser) {
                const userDocRef = doc(db, 'users', loggedInUser.uid);
                const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        console.log("User data from Firestore:", docSnapshot.data());
                        setCurrentUser({ ...docSnapshot.data(), id: loggedInUser.uid });
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
        };
    }, []);

    const value = {
        currentUser,
        gyms,
        leagues,
        events,
        updateUserData,
        updateUserDetailsInDB,
    };

    return (
        <DataLayerContext.Provider value={value}>
            {children}
        </DataLayerContext.Provider>
    );
};

export default DataLayer;
