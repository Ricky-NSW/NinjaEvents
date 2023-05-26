import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../FirebaseSetup';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../FirebaseSetup'; // Replace with your actual import
import AuthContext from '../../contexts/AuthContext';

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, get additional user data from Firestore
                const docRef = doc(db, 'users', user.uid);
                onSnapshot(docRef, (doc) => {
                    if (doc.exists()) {
                        setCurrentUser({ uid: doc.id, ...doc.data() });
                    }
                });
            } else {
                // User is signed out
                setCurrentUser(null);
            }
            setLoading(false);
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
