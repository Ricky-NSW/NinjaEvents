import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDocs,
    query,
    collection, where
} from 'firebase/firestore';
import CardMedia from "@mui/material/CardMedia";
import { auth } from "../../FirebaseSetup";
import Switch from "@mui/material/Switch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IsSubscribedSwitch from "../user/isSubscribedSwitch";
import { requestNotificationPermission } from './../messaging/fcm';

const LeagueDetails = () => {
    const { id } = useParams();
    const [league, setLeague] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribedUsers, setSubscribedUsers] = useState([]);

    // Fetch league data from Firebase Firestore
    useEffect(() => {
        // The issue was here, you missed the 'id' in the doc function
        const leagueRef = doc(getFirestore(), 'leagues', id);

        const getLeague = async () => {
            const leagueDoc = await getDoc(leagueRef);
            if (leagueDoc.exists()) {
                setLeague(leagueDoc.data());
            }
        };

        getLeague();
    }, [id]);



    const handleSubscribeToggle = async () => {
        setIsSubscribed(!isSubscribed);
        const leagueRef = doc(getFirestore(), 'leagues', id);
        const leagueDoc = await getDoc(leagueRef);
        const leagueName = leagueDoc.data().name;

        const userRef = doc(getFirestore(), "users", auth.currentUser.uid);
        if (!isSubscribed) {
            await updateDoc(userRef, {
                subscribedLeagues: arrayUnion({ id, name: leagueName }),
            });
        } else {
            await updateDoc(userRef, {
                subscribedLeagues: arrayRemove({ id, name: leagueName }),
            });
        }
    };

    //allow user the register for an event
    const handleSubscription = async () => {
        const userRef = doc(getFirestore(), 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const currentSubscriptions = userDoc.data()?.subscribedLeagues ?? [];
            let updatedSubscriptions;
            if (isSubscribed) {
                updatedSubscriptions = currentSubscriptions.filter((leagueId) => leagueId !== id);
            } else {
                updatedSubscriptions = [...currentSubscriptions, id];
            }

            await updateDoc(userRef, { subscribedLeagues: updatedSubscriptions });
            // Call this function when appropriate, such as when a user clicks a "Subscribe" button
            await requestNotificationPermission();
            setIsSubscribed(!isSubscribed);
        }
    };

    //TODO: Does this control the subscription button for the gym stuff or subscriotion for this league
    // useEffect(() => {
    //     const checkSubscribedGym = async () => {
    //         if (auth.currentUser) {
    //             const userRef = doc(getFirestore(), "users", auth.currentUser.uid);
    //             const userDoc = await getDoc(userRef);
    //
    //             if (userDoc.exists()) {
    //                 const subscribedLeagues = userDoc.data().subscribedLeagues || [];
    //                 setIsSubscribed(subscribedLeagues.includes(id));
    //             }
    //         }
    //     };
    //
    //     checkSubscribedGym();
    // }, [id, auth.currentUser]);

    //allow user to register for an event
    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            if (auth.currentUser) {
                const userRef = doc(getFirestore(), 'users', auth.currentUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const currentSubscriptions = userDoc.data()?.subscribedLeagues ?? [];
                    const isUserSubscribed = currentSubscriptions.includes(id);
                    setIsSubscribed(isUserSubscribed);
                }
            }
        };
        checkSubscriptionStatus();
    }, [auth.currentUser, id]);


// fetch subscribed users
    const fetchSubscribedUsers = async () => {
        const usersSnapshot = await getDocs(query(collection(getFirestore(), 'users'), where('subscribedLeagues', 'array-contains', id)));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubscribedUsers(usersData);
    };

    useEffect(() => {
        fetchSubscribedUsers();
    }, [id]);

    return (
        <div>
            {league ? (
                <>
                    <h2>{league.name}</h2>
                    <div>
                        <IsSubscribedSwitch
                            isSubscribed={isSubscribed}
                            handleSubscription={handleSubscription}
                        />
                        <span>Follow this league</span>
                    </div>
                    <p>{league.location}</p>
                    <p>{league.description}</p>
                    <p>Price: {league.price}</p>
                    <p>Location: {league.location}</p>
                    <p>Age: {league.age}</p>
                </>
            ) : (
                <p>Loading league details...</p>
            )}
        </div>
    );
};

export default LeagueDetails;
