import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../FirebaseSetup';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../FirebaseSetup'; // Replace with your actual import
import AuthContext from '../../contexts/AuthContext';
import Loading from '../data/Loading';
const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("Auth state changed: User logged in", user.uid);

                // User is signed in, get additional user data from Firestore
                const docRef = doc(db, 'users', user.uid);
                onSnapshot(docRef, (doc) => {
                    if (doc.exists()) {
                        console.log("User document updated", doc.data());
                        const newUserData = { uid: doc.id, ...doc.data() };
                        if (JSON.stringify(newUserData) !== JSON.stringify(currentUser)) {
                            setCurrentUser(newUserData);
                        }
                    }
                });
            } else {
                console.log("Auth state changed: User logged out");

                // User is signed out
                setCurrentUser(null);
            }
            setLoading(false);
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, [currentUser]);

    if (loading) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
