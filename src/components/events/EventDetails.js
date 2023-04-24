//TODO make it so that the person who created the event can edit it
//TODO: make it check if there is a league assigned to the event, if there is allow any of the league admins to edit it
//TODO: add a MUI <Switch /> to the event page, when the user clicks the <Switch /> it adds the event id to an array on the 'user' called 'eventSubscriptions'. If they disable the <Switch /> it removes it from the array
//TODO: create a list of all the users who have subscribed for the event
// TODO: allow the gym manager to add a register for this event button which linkns away to the official page
//TODO can we careate a calendar file from the event
import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import {getFirestore, doc, getDoc, updateDoc, getDocs, query, collection, where} from 'firebase/firestore';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
import {auth, db} from "../../FirebaseSetup";
import { Switch } from '@mui/material';
import IsSubscribedSwitch from "../user/isSubscribedSwitch";
import SubmitResultsForm from "./results/SubmitResultsForm";
const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [open, setOpen] = useState(false); // state for dialog open/closed
    const [updatedEvent, setUpdatedEvent] = useState({}); // state for updated event data
    const [address, setAddress] = useState({ name: "", address: "", lat: null, lng: null });
    const [searchBox, setSearchBox] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [error, setError] = useState("");
    const [leagues, setLeagues] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribedUsers, setSubscribedUsers] = useState([]);

    useEffect(() => {
        const eventRef = doc(getFirestore(), 'events', id);
        const getEvent = async () => {
            const eventDoc = await getDoc(eventRef);
            if (eventDoc.exists()) {
                setEvent(eventDoc.data());
            }
        };
        getEvent();
    }, [id]);

    //get the league information, so we can check if the user is a league admin
    //because league admins can edit events if the league is assigned to the event
    useEffect(() => {
        const leaguesRef = collection(getFirestore(), 'leagues');
        const getLeagues = async () => {
            const leaguesSnapshot = await getDocs(leaguesRef);
            const leaguesData = leaguesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLeagues(leaguesData);
        };
        getLeagues();
    }, []);

    const handleOpen = () => {
        // set the updated event data to the current event data
        setUpdatedEvent(event);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        // update the updated event data when the user changes an input field
        const { name, value } = event.target;
        if (name === "gymName") {
            setUpdatedEvent((prev) => ({ ...prev, gym: { ...prev.gym, name: value } }));
        } else {
            setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveChanges = async () => {
        const eventRef = doc(getFirestore(), 'events', id);
        const eventDoc = await getDoc(eventRef);
        const eventData = eventDoc.data();

        // Check if the user is the creator of the event
        if (auth.currentUser.uid === eventData.createdBy) {
            // Save the updated event data to Firestore
            // Save the updated event data to Firestore with the updated gym data
            await updateDoc(eventRef, {
                ...updatedEvent,
                gym: {
                    name: address.name,
                    address: address.address,
                    latitude: address.lat,
                    longitude: address.lng,
                },
            });
            setEvent({
                ...updatedEvent,
                gym: {
                    name: address.name,
                    address: address.address,
                    latitude: address.lat,
                    longitude: address.lng,
                },
            });

            setOpen(false);
        } else {
            // Check if the user is an admin of the league assigned to the event
            const leagueRef = doc(getFirestore(), 'leagues', eventData.league.id);
            const leagueDoc = await getDoc(leagueRef);
            const leagueData = leagueDoc.data();
            if (leagueData.admins.includes(auth.currentUser.uid)) {
                // Save the updated event data to Firestore
                await updateDoc(eventRef, updatedEvent);
                setEvent(updatedEvent);
                setOpen(false);
            } else {
                // Display an error message and prevent the user from saving the changes
                setError("You do not have permission to edit this event.");
            }
        }
    };

    const handlePlacesChanged = () => {
        if (searchBox) {
            const place = searchBox.getPlaces()[0];
            if (place) {
                setAddress({
                    address: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            }
        }
    };

    const handleAddressChange = (e) => {
        const value = e.target.value;

        if (!value) {
            setError("Please enter a gym address");
            setAddress({ name: "", address: "", lat: null, lng: null });
            return;
        }

        setAddress(value);
        setError("");
    };

//This component fetches information from the 'gyms' collection in Firebase Firestore. Specifically, the fetchGyms function fetches gym documents created by the currently logged-in user:
    const fetchGyms = async () => {
        if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            const gymsSnapshot = await getDocs(query(collection(db, 'gyms'), where('createdBy', '==', uid)));
            const gymsData = gymsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setGyms(gymsData);
        }
    };

    // Fetch gyms when the user logs in
    useEffect(() => {
        if (auth.currentUser) {
            fetchGyms();
        }
    }, [auth.currentUser]);

    // If there is only one gym, set it as the default address
    useEffect(() => {
        if (gyms.length === 1) {
            setAddress(gyms[0]);
        }
    }, [gyms]);

    //allow user to register (subscribe) to the event
    const handleSubscription = async () => {
        const userRef = doc(getFirestore(), 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const currentSubscriptions = userDoc.data()?.eventSubscriptions ?? [];
            let updatedSubscriptions;
            if (isSubscribed) {
                updatedSubscriptions = currentSubscriptions.filter((eventId) => eventId !== id);
            } else {
                updatedSubscriptions = [...currentSubscriptions, id];
            }

            await updateDoc(userRef, { eventSubscriptions: updatedSubscriptions });
            setIsSubscribed(!isSubscribed);
        }
    };


    //allow user to register for an event
    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            if (auth.currentUser) {
                const userRef = doc(getFirestore(), 'users', auth.currentUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const currentSubscriptions = userDoc.data()?.eventSubscriptions ?? [];
                    const isUserSubscribed = currentSubscriptions.includes(id);
                    setIsSubscribed(isUserSubscribed);
                }
            }
        };
        checkSubscriptionStatus();
    }, [auth.currentUser, id]);


// fetch subscribed users
    const fetchSubscribedUsers = async () => {
        const usersSnapshot = await getDocs(query(collection(getFirestore(), 'users'), where('eventSubscriptions', 'array-contains', id)));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubscribedUsers(usersData);
    };

    useEffect(() => {
        fetchSubscribedUsers();
    }, [id]);


    return (
        <>
        <div>
            {event ? (
                <>
                    <h2>{event.title}</h2>
                    <div>
                        <IsSubscribedSwitch
                            isSubscribed={isSubscribed}
                            handleSubscription={handleSubscription}
                        />
                        <span>Register for this event</span>
                    </div>
                    <p>Description: {event.description}</p>
                    <p>ID: {event.id}</p>

                    <p>Location: {event.gym.name}</p>

                    <h3>Event Location</h3>
                    {/*TODO: add the avatar for the gym*/}
                    <p>Gym's Address: {event.gym.address}</p>
                    <p>Lat: {event.gym.latitude}</p>
                    <p>Long: {event.gym.longitude}</p>
                    <a href={`/gyms/${event.gym.id}`}>View {event.gym.name}</a>

                    <h3>Event League</h3>
                    {/*TODO: add the avatar for the league*/}
                    <p>League name: {event.league.name}</p>
                    <p>Description: {event.league.description}</p>
                    <a href={`/leagues/${event.league.id}`}>View {event.league.name}</a>

                    <h3>Subscribed Users</h3>
                    <ul>
                        {subscribedUsers.map((user) => (
                            <li key={user.id}>
                                <Link to={`/users/${user.id}`}>{user.ninjaName || user.displayName || user.email}</Link>
                            </li>
                        ))}
                    </ul>

                    <hr />
                    <Button variant="contained" onClick={handleOpen}>Edit</Button>

                    {/*This is the dialogue that allows the Gym owner or the league admin to edit the events*/}
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Edit Event Details</DialogTitle>
                        <DialogContent>
                            <TextField
                                name="title"
                                label="Title"
                                value={updatedEvent.title || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="gymName"
                                label="Event Location"
                                value={updatedEvent.gym ? updatedEvent.gym.name : ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="description"
                                label="Description"
                                value={updatedEvent.description || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="price"
                                label="Price"
                                value={updatedEvent.price || ''}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="age"
                                label="Age"
                                value={updatedEvent.age || ''}
                                onChange={handleInputChange}
                            />
                            {/*Assign a gym*/}
                            <Autocomplete
                                options={gyms}
                                getOptionLabel={(option) => option.name}
                                value={address}
                                onChange={(event, newValue) =>
                                    setAddress(
                                        newValue
                                            ? {
                                                name: newValue.name,
                                                address: newValue.address,
                                                lat: newValue.latitude,
                                                lng: newValue.longitude,
                                            }
                                            : { name: "", address: "", lat: null, lng: null }
                                    )
                                }
                                fullWidth
                                data-lpignore="true"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Gym"
                                        variant="outlined"
                                        value={address.name} // Use the gym's name from the address state
                                        onChange={handleAddressChange}
                                        margin="normal"
                                        required
                                        fullWidth
                                    />
                                )}
                            />

                            {/*//Assign a league*/}
                            <Autocomplete
                                options={leagues}
                                getOptionLabel={(option) => option.name}
                                value={updatedEvent.league || null}
                                onChange={(event, newValue) =>
                                    setUpdatedEvent((prev) => ({
                                        ...prev,
                                        league: newValue ? newValue : null
                                    }))
                                }
                                fullWidth
                                data-lpignore="true"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="League"
                                        variant="outlined"
                                        value={updatedEvent.league ? updatedEvent.league.name : 'null'}
                                        margin="normal"
                                        fullWidth
                                    />
                                )}
                            />



                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleSaveChanges}>Save Changes</Button>
                        </DialogActions>
                    </Dialog>
                    {/*//TODO: after the events date has passed show the results of the event - this needs to be a notification for the league and gym owner*/}
                    {/*//TODO: once events results have been added, they should be displayed below*/}
                    <SubmitResultsForm eventId={event.id} />
                    <br />
                </>

            ) : (
                <p>Loading event details...</p>
            )}
        </div>


        </>
    );
};

export default EventDetails;
